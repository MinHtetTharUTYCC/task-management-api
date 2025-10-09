import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from 'generated/prisma';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RequestUser } from 'src/auth/request-user.interface';
import { AdminProjectService } from './admin-project/admin-project.service';
import { ManagerProjectService } from './manager-project/manager-project.service';
import { MemberProjectService } from './member-project/member-project.service';


@Injectable()
export class ProjectsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly adminProjectService: AdminProjectService,
        private readonly managerProjectService: ManagerProjectService,
        private readonly memberProjectService: MemberProjectService,
    ) { }

    // (SKIP pagination, search, filter for now)

    //ADMIN
    async getAllProjects(): Promise<Project[]> {
        try {
            return this.databaseService.project.findMany({
                include: {
                    owner: { select: { id: true, email: true, username: true } },
                    _count: {
                        select: {
                            members: true,
                            tasks: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw new InternalServerErrorException("Failed to fetch projects");
        }
    }

    // ADMIN,MANAGER
    async getCreatedProjects(ownerId: string): Promise<Project[]> {
        try {
            return this.databaseService.project.findMany({
                where: { ownerId },
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw new InternalServerErrorException("Failed to fetch projects");
        }
    }

    //All Authenticated users
    async getProject(id: string, user: RequestUser): Promise<Project> {
        switch (user.role) {
            case 'ADMIN':
                return this.adminProjectService.getProject(id);
            case 'MANAGER':
                return this.managerProjectService.getProject(id, user.sub);
            case 'MEMBER':
                return this.memberProjectService.getProject(id, user.sub);
            default:
                throw new ForbiddenException("You don't have access to this resource")
        }
    }

    // ADMIN,MANAGER
    async createProject(createProjectDto: CreateProjectDto, ownerId: string): Promise<{ message: string }> {
        try {
            await this.databaseService.project.create({
                data: { ...createProjectDto, ownerId },
            });

            return { message: 'Project created successfully' };
        } catch (error) {
            console.error('Error creating project:', error);
            throw new InternalServerErrorException("Failed to create project");
        }
    }

    async updateProject(id: string, updateProjectDto: UpdateProjectDto, ownerId: string): Promise<Project> {
        try {
            const isValid = await this.validateOwnerShip(id, ownerId);
            if (!isValid) {
                throw new NotFoundException('Project not found');
            }

            return this.databaseService.project.update({
                where: { id },
                data: updateProjectDto,
            });

        } catch (error) {
            console.error('Error updateding project:', error);
            throw new InternalServerErrorException("Failed to update project");

        }
    }
    async deleteProject(id: string, ownerId: string): Promise<{ message: string }> {
        try {
            const isValid = await this.validateOwnerShip(id, ownerId);
            if (!isValid) {
                return { message: 'Project not found' };
            }

            await this.databaseService.project.delete({
                where: { id },
            });
            return { message: 'Project deleted successfully' };
        } catch (error) {
            console.error('Error deleting project:', error);
            throw new InternalServerErrorException("Failed to delete project");

        }
    }

    private async projectExists(id: string): Promise<boolean> {
        const project = await this.databaseService.project.findUnique({
            where: { id },
            select: { id: true }
        });
        return !!project;
    }
    private async validateOwnerShip(id: string, ownerId: string): Promise<boolean> {
        const project = await this.databaseService.project.findUnique({
            where: { id, ownerId },
            select: { id: true }
        });
        return !!project;
    }
}
