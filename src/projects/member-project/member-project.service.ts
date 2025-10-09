import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Project } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MemberProjectService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async getProject(id: string, assigneeId: string): Promise<Project> {
        try {
            const member = await this.databaseService.projectMember.findFirst({
                where: {
                    projectId: id,
                    userId: assigneeId
                }
            })

            if (!member) {
                throw new NotFoundException('You are not a member of this project');
            }

            const project = await this.databaseService.project.findUnique({
                where: { id },
                include: {
                    tasks: {
                        where: { assigneeId },
                        orderBy: { createdAt: 'desc' }
                    },
                }
            });

            if (!project) {
                throw new NotFoundException('Project not found');
            }
            return project;
        } catch (error) {
            throw new InternalServerErrorException("Failed to load project");
        }

    }
}
