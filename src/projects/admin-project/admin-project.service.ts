import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminProjectService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }
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
