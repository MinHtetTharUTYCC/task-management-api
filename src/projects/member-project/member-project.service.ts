import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Project } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';

@Injectable()
export class MemberProjectService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async getAllProjects(assigneeId: string): Promise<Project[]> {
        try {
            return this.databaseService.project.findMany({
                where: { members: { some: { userId: assigneeId } } },
                include: {
                    owner: { select: { id: true, username: true } },
                    _count: {
                        select: {
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

    async getProject(id: string, assigneeId: string): Promise<Project | undefined> {
        try {
            const project = await this.databaseService.project.findUnique({
                where: { id, members: { some: { userId: assigneeId } } },
                include: {
                    owner: { select: { id: true, username: true } },
                    _count: {
                        select: {
                            members: true,
                            tasks: true,
                        }
                    },
                    tasks: {
                        where: { assigneeId },
                        orderBy: { createdAt: 'desc' }
                    },
                }
            });

            if (!project) {
                console.log('Project not found or user is not a member');
                throw new NotFoundException('Project not found or you are not a member of this project');
            }

            return project;
        } catch (error) {
            handlePrismaError(error, "Failed to load project");
        }

    }
}
