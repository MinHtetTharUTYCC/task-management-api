import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { GetTasksDto } from '../dto/get-tasks.dto';

@Injectable()
export class AdminTaskService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getAllTasks(getTasksDto: GetTasksDto) {
        try {
            return this.databaseService.task.findMany({
                where: {
                    ...(getTasksDto.priority && { priority: getTasksDto.priority })
                },
                include: {
                    project: true,
                    assignee: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                },
                orderBy: { ...getTasksDto.byDate ? { createdAt: getTasksDto.byDate } : { createdAt: 'desc' } },
            })
        } catch (error) {
            throw new InternalServerErrorException("Failed to get tasks")
        }
    }

    async getTask(id: string) {
        try {
            const task = await this.databaseService.task.findUnique({
                where: { id },
                include: {
                    project: true,
                    creator: { select: { id: true, username: true } },
                    assignee: { select: { id: true, username: true } }
                }
            })
            if (!task) throw new NotFoundException("Task not found")

            return task;
        } catch (error) {
            handlePrismaError(error, "Failed to get task")
        }
    }
}
