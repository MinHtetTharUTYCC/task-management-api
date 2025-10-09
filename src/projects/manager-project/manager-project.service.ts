import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ManagerProjectService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

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
