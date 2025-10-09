import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ManagerTaskService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getTasks(creatorId: string) {
        try {
            return this.databaseService.task.findMany(
                {
                    where: { creatorId },
                    orderBy: { createdAt: 'desc' }
                }
            )
        } catch (error) {
            throw new InternalServerErrorException("Failed to get tasks")
        }
    }

    async getTask(id: string, creatorId: string) {
        try {
            return this.databaseService.task.findUnique(
                {
                    where: { id, creatorId },
                    include: { project: true, assignee: true }
                }
            )
        } catch (error) {
            throw new InternalServerErrorException("Failed to get task")
        }
    }
}
