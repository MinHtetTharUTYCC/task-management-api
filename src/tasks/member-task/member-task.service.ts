import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { GetTasksDto } from '../dto/get-tasks.dto';
import { PaginatedTaskResponse, TaskDetailsResponse } from '../dto/task-response.dto';

@Injectable()
export class MemberTaskService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getTasks(getTasksDto: GetTasksDto, assigneeId: string): Promise<PaginatedTaskResponse> {
        const { page = 1, pageSize = 10, status, priority, projectId, sortBy } = getTasksDto;
        const skip = (page - 1) * pageSize;

        const where = {
            assigneeId,
            ...(status && { status }),
            ...(priority && { priority }),
            ...(projectId && { projectId }),
        }
        try {
            const [tasks, total] = await Promise.all([
                this.databaseService.task.findMany(
                    {
                        where,
                        include: {
                            project: true,
                            creator: { select: { id: true, username: true } }
                        },
                        skip,
                        take: pageSize,
                        orderBy: {
                            ...(sortBy ? { createdAt: sortBy } : { createdAt: 'desc' })
                        },
                    }
                ),
                this.databaseService.task.count({ where })
            ])

            return {
                tasks,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)

            }
        } catch (error) {
            throw new InternalServerErrorException("Failed to get tasks")
        }
    }

    async getTask(id: string, assigneeId: string): Promise<TaskDetailsResponse> {
        try {
            const task = await this.databaseService.task.findFirst(
                {
                    where: { id, assigneeId },
                    include: {
                        project: true,
                        creator: {
                            select: {
                                id: true,
                                username: true
                            }
                        },

                    }
                }
            );

            if (!task) throw new NotFoundException("Task not found or you don't have access to it")

            return task;
        } catch (error) {
            handlePrismaError(error, "Failed to get task")
        }
    }
}
