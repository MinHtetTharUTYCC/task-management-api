import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { Task } from 'generated/prisma';

@Injectable()
export class TasksService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getMyTasks(userId: string): Promise<Task[]> {
        this.validateUserId(userId);
        try {
            return this.databaseService.task.findMany(
                {
                    where: { userId },
                    orderBy: { createdAt: 'desc' }
                }
            )
        } catch (error) {
            throw new InternalServerErrorException("Failed to get tasks")

        }
    }

    async getTask(id: string, userId: string): Promise<Task> {
        this.validateUserId(userId);
        this.validateTaskId(id)

        try {
            const task = await this.databaseService.task.findFirst({
                where: { id, userId }
            })
            if (!task) throw new NotFoundException("Task with ID ${id} not found or you don't have access to it")
            return task;
        } catch {
            throw new InternalServerErrorException("Failed to get task")
        }
    }

    async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
        this.validateUserId(userId);
        try {
            const newTask = await this.databaseService.task.create({
                data: {
                    ...createTaskDto,
                    userId,
                }
            })
            return newTask;
        } catch {
            throw new InternalServerErrorException("Failed to create new task")
        }
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
        this.validateUserId(userId);
        this.validateTaskId(id);

        await this.validateTaskOwnership(id, userId)

        try {
            return this.databaseService.task.update({
                where: { id },
                data: updateTaskDto,
            })
        } catch {
            throw new InternalServerErrorException("Failed to create new task")
        }
    }

    async deleteTask(id: string, userId: string) {
        this.validateUserId(userId);
        this.validateTaskId(id);

        await this.validateTaskOwnership(id, userId);

        try {
            await this.databaseService.task.delete({
                where: {
                    id
                }
            })
            return { success: true, message: "Task deleted successfully" }
        } catch {
            throw new InternalServerErrorException("Failed to create new task")
        }
    }

    async counMyTasks(userId: string): Promise<number> {
        try {
            return this.databaseService.task.count({
                where: { userId }
            })
        } catch {
            throw new InternalServerErrorException("Failed to create new task")
        }
    }

    //helpers
    async validateTaskOwnership(id: string, userId: string): Promise<void> {
        const task = await this.databaseService.task.findFirst({
            where: { id, userId },
            select: {
                id: true,
            }
        })
        if (!task) throw new NotFoundException(`Task with ID ${id} not found or you don't have access to it`)
    }

    private validateUserId(userId: string): void {
        if (!userId || userId.trim().length === 0) {
            throw new BadRequestException('User ID is required');
        }
    }

    private validateTaskId(taskId: string): void {
        if (!taskId || taskId.trim().length === 0) {
            throw new BadRequestException('Task ID is required');
        }
    }


}
