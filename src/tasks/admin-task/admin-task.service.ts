import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminTaskService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getAllTasks() {
        try {
            return this.databaseService.task.findMany({ orderBy: { createdAt: 'desc' }, include: { project: true, assignee: true } })
        } catch (error) {
            throw new InternalServerErrorException("Failed to get tasks")
        }
    }

    async getTask(id: string) {
        try {
            return this.databaseService.task.findUnique({ where: { id }, include: { project: true, creator: true, assignee: true } })
        } catch (error) {
            throw new InternalServerErrorException("Failed to get task")
        }
    }
}
