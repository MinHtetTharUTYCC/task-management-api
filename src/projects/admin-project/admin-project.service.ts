import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Project } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminProjectService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async getAllProjects(): Promise<Project[]> {
        try {
            return this.databaseService.project.findMany({
                include: {
                    owner: { select: { id: true, username: true } },
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
    async getProject(id: string) {

        try {
            const project = await this.databaseService.project.findUnique({
                where: { id },
                include: {
                    members: true,
                    owner: true,
                    tasks: true,
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
