import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MemberTaskService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getTasks(assigneeId: string) {
        try {
            return this.databaseService.task.findMany(
                {
                    where: { assigneeId },
                    orderBy: { createdAt: 'desc' }
                }
            )
        } catch (error) {
            throw new InternalServerErrorException("Failed to get tasks")
        }
    }

    async getTask(id: string, assigneeId: string) {
        try {
            return this.databaseService.task.findUnique(
                {
                    where: { id, assigneeId },
                    include: { project: true, creator: true }
                }
            )
        } catch (error) {
            throw new InternalServerErrorException("Failed to get task")
        }
    }
}
