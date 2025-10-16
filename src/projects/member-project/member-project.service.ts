import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { PaginatedProjectResponse, ProjectDetailsResponse } from '../dto/project-response.dto';
import { GetProjectsDto } from '../dto/get-projects.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MemberProjectService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async getAllProjects(getProjectsDto: GetProjectsDto, assigneeId: string): Promise<PaginatedProjectResponse> {
        const { page = 1, pageSize = 10, sortBy } = getProjectsDto;
        const skip = (page - 1) * pageSize;

        const orderBy: Prisma.ProjectOrderByWithRelationInput = {
            ...(sortBy ? { createdAt: sortBy } : { createdAt: 'desc' })
        }
        try {
            const [projects, total] = await Promise.all([
                this.databaseService.project.findMany({
                    where: { members: { some: { userId: assigneeId } } },
                    include: {
                        owner: { select: { id: true, username: true } },
                        _count: {
                            select: {
                                members: true,
                                tasks: true,
                            }
                        }
                    },
                    skip,
                    take: pageSize,
                    orderBy,
                }),
                this.databaseService.project.count({
                    where: { members: { some: { userId: assigneeId } } },

                })
            ]);

            return {
                projects,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        } catch (error) {
            throw new InternalServerErrorException("Failed to fetch projects");
        }
    }

    async getProject(id: string, assigneeId: string): Promise<ProjectDetailsResponse> {
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
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            status: true,
                            priority: true,
                            createdAt: true,
                        },
                        orderBy: { createdAt: 'desc' }
                    },
                },
            });

            if (!project) {
                throw new NotFoundException('Project not found or you are not a member of this project');
            }

            return project;
        } catch (error) {
            handlePrismaError(error, "Failed to load project");
        }

    }
}
