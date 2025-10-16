import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PaginatedProjectResponse, ProjectDetailsResponse } from '../dto/project-response.dto';
import { GetProjectsDto } from '../dto/get-projects.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminProjectService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async getAllProjects(getProjectsDto: GetProjectsDto): Promise<PaginatedProjectResponse> {
        const { page = 1, pageSize = 10, sortBy } = getProjectsDto;
        const skip = (page - 1) * pageSize;

        const orderBy: Prisma.ProjectOrderByWithRelationInput = {
            ...(sortBy ? { createdAt: sortBy } : { createdAt: 'desc' })
        }

        try {
            const [projects, total] = await Promise.all([
                this.databaseService.project.findMany({
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
                this.databaseService.project.count({}),
            ])

            return {
                projects,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            }
        } catch (error) {
            throw new InternalServerErrorException("Failed to fetch projects");
        }
    }


    async getProject(id: string): Promise<ProjectDetailsResponse> {
        try {
            const project = await this.databaseService.project.findUnique({
                where: { id },
                include: {
                    members: {
                        select: {
                            id: true,
                            userId: true,
                            user: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    },
                    owner: {
                        select: {
                            id: true,
                            username: true,
                        }
                    },
                    tasks: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            status: true,
                            priority: true,
                            createdAt: true,
                        }
                    },
                }
            });
            if (!project) {
                throw new NotFoundException('Project not found');
            }
            return project;
        } catch (error) {
            throw new InternalServerErrorException("Failed to fetch project");
        }

    }
}
