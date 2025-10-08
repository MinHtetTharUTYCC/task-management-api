import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {
    constructor(private readonly databaseService: DatabaseService) { }

    // need to edit to specific user
    async getAllTasks() {
        return await this.databaseService.task.findMany()
    }

    async findUserTask(id: string, userId: string) {
        const task = await this.databaseService.task.findFirst({
            where: { id, userId },
            select: {
                id: true,
            }
        })
        if (!task) throw new NotFoundException("Task Not Found")
        return task;

    }

    async getTask(id: string, userId: string) {
        const task = await this.databaseService.task.findFirst({
            where: { id, userId }
        })
        if (!task) throw new NotFoundException("Task Not Found")
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto, userId: string) {
        const newTask = await this.databaseService.task.create({
            data: {
                ...createTaskDto,
                userId,

            }
        })
        return newTask;
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
        const taskToUpdate = await this.findUserTask(id, userId);

        const updatedTask = await this.databaseService.task.update({
            where: { id: taskToUpdate.id },
            data: updateTaskDto,
        })

        return updatedTask; //Or return this.getTask(id,userId)

    }

    async deleteTask(id: string, userId: string) {
        const taskToDelete = await this.findUserTask(id, userId)
        await this.databaseService.task.delete({
            where: {
                id: taskToDelete.id,
            }
        })

        return { success: true, message: "Task deleted successfully" }
    }


}
