import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { GetTasksDto } from '../dto/get-tasks.dto';

@Injectable()
export class ManagerTaskService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getTasks(getTasksDto: GetTasksDto, creatorId: string) {
        try {
            return this.databaseService.task.findMany(
                {
                    where: { creatorId, ...(getTasksDto.priority && { priority: getTasksDto.priority }) },
                    orderBy: { ...getTasksDto.byDate ? { createdAt: getTasksDto.byDate } : { createdAt: 'desc' } },
                }
            )
        } catch (error) {
            throw new InternalServerErrorException("Failed to get tasks")
        }
    }

    async getTask(id: string, creatorId: string) {
        try {
            const task = await this.databaseService.task.findFirst(
                {
                    where: { id, creatorId },
                    include: { project: true, assignee: { select: { id: true, username: true } } }
                }
            )
            if (!task) throw new NotFoundException("Task not found or you don't have access to it")
        } catch (error) {
            handlePrismaError(error, "Failed to get task")
        }
    }
}
