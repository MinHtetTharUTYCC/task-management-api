import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project, UserRole } from '@prisma/client';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RequestUser } from 'src/auth/request-user.interface';
import { AdminProjectService } from './admin-project/admin-project.service';
import { ManagerProjectService } from './manager-project/manager-project.service';
import { MemberProjectService } from './member-project/member-project.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { CreateNotificationDto } from 'src/notifications/dto/create-noti.dto';
import { PaginatedProjectResponse, ProjectDetailsResponse } from './dto/project-response.dto';
import { GetProjectsDto } from './dto/get-projects.dto';

@Injectable()
export class ProjectsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly adminProjectService: AdminProjectService,
        private readonly managerProjectService: ManagerProjectService,
        private readonly memberProjectService: MemberProjectService,
        private readonly notificationsGateway: NotificationsGateway,
    ) { }

    //All Users
    async getAllProjects(getProjectsDto: GetProjectsDto, user: RequestUser): Promise<PaginatedProjectResponse> {
        switch (user.role) {
            case UserRole.ADMIN:
                return this.adminProjectService.getAllProjects(getProjectsDto);
            case UserRole.MANAGER:
                return this.managerProjectService.getAllProjects(getProjectsDto, user.sub);
            case UserRole.MEMBER:
                return this.memberProjectService.getAllProjects(getProjectsDto, user.sub);
            default:
                throw new ForbiddenException("You don't have access to this resource")
        }
    }

    //All users
    async getProject(id: string, user: RequestUser): Promise<ProjectDetailsResponse> {
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

    // MANAGER
    async createProject(createProjectDto: CreateProjectDto, user: RequestUser): Promise<Project> {
        try {

            const newProject = await this.databaseService.$transaction(async (tx) => {
                const project = await tx.project.create({
                    data: { ...createProjectDto, ownerId: user.sub },
                });

                const admin = await tx.user.findFirst({
                    where: { role: 'ADMIN' },
                    select: { id: true }
                });

                if (admin) {
                    const notificationData: CreateNotificationDto = {
                        type: 'PROJECT_CREATED',
                        message: `${user.username} created a new project: ${project.name}`,
                        link: `/projects/${project.id}`,
                        userId: admin.id,
                    };

                    await this.databaseService.notification.create({
                        data: notificationData,
                    });
                    this.notificationsGateway.sendNotification(notificationData)
                }
                return project;
            })

            return newProject;
        } catch (error) {
            throw new InternalServerErrorException("Failed to create project");
        }
    }

    // MANAGER
    async updateProject(id: string, updateProjectDto: UpdateProjectDto, user: RequestUser): Promise<Project> {
        try {
            await this.validateOwnerShip(id, user.sub);

            const project = await this.databaseService.$transaction(async (tx) => {
                const updated = await tx.project.update({
                    where: { id },
                    data: updateProjectDto,
                    include: {
                        members: {
                            select: {
                                userId: true,
                            }
                        }
                    }
                });

                const admin = await tx.user.findFirst({
                    where: { role: 'ADMIN' },
                    select: { id: true }
                });

                const baseNotification = {
                    type: "PROJECT_UPDATED" as const,
                    message: `${user.username} updated project: ${updated.name}`,
                    link: `/projects/${updated.id}`,
                };


                const recepients = [
                    ...(updated.members.map(mem => mem.userId) ?? []),
                    ...(admin ? [admin.id] : [])
                ]

                await Promise.all(
                    recepients.map(rec => {
                        tx.notification.create({
                            data: {
                                ...baseNotification,
                                userId: rec,
                            }
                        })
                    })
                )

                return { updated, recepients, baseNotification };
            });

            // EMIT NOTI
            for (const recepient of project.recepients) {
                this.notificationsGateway.sendNotification({ ...project.baseNotification, userId: recepient })
            }
            return project.updated;
        } catch (error) {
            console.log("ERROR:", error)
            handlePrismaError(error, "Failed to update project");
        }
    }

    // Manager
    async deleteProject(id: string, user: RequestUser): Promise<{ message: string }> {
        try {
            await this.validateOwnerShip(id, user.sub);

            await this.databaseService.project.delete({
                where: { id },
            });

            return { message: 'Project deleted successfully' };
        } catch (error) {
            handlePrismaError(error, "Failed to delete project");

        }
    }


    private async validateOwnerShip(id: string, ownerId: string): Promise<void> {
        const project = await this.databaseService.project.findUnique({
            where: { id, ownerId },
            select: { id: true, ownerId: true }
        });
        if (!project) {
            throw new NotFoundException('Project not found')
        }
        if (project.ownerId !== ownerId) {
            throw new BadRequestException('You do not have access to the project');

        }

    }
}
