import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Project } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ManagerProjectService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async getAllProjects(ownerId: string): Promise<Project[]> {
        try {
            return this.databaseService.project.findMany({
                where: { ownerId },
                include: {
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
            throw new InternalServerErrorException("Failed to fetch projects");
        }
    }


    async getProject(id: string, ownerId: string) {
        try {
            const project = await this.databaseService.project.findUnique({
                where: { id, ownerId },
                include: {
                    members: true,
                    tasks: true,
                }
            });
            if (!project) {
                throw new NotFoundException('Project not found or you do not have access to it');
            }
            return project;
        } catch (error) {
            throw new InternalServerErrorException("Failed to load project");
        }

    }
}
