import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { Task } from 'generated/prisma';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { RequestUser } from 'src/auth/request-user.interface';
import { AdminTaskService } from './admin-task/admin-task.service';
import { ManagerTaskService } from './manager-task/manager-task.service';
import { MemberTaskService } from './member-task/member-task.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly adminTaskService: AdminTaskService,
        private readonly managerTaskService: ManagerTaskService,
        private readonly memberTaskService: MemberTaskService,
    ) { }

    //ALL autehnticated Users
    async getTasks(user: RequestUser) {
        this.validateUserId(user.sub);//do we really need this?

        switch (user.role) {
            case 'ADMIN':
                return this.adminTaskService.getAllTasks();
            case 'MANAGER':
                return this.managerTaskService.getTasks(user.sub);
            case 'MEMBER':
                return this.memberTaskService.getTasks(user.sub);
            default:
                throw new ForbiddenException("You don't have access to this resource")
        }
    }

    // All Authenticated Users
    async getTask(id: string, user: RequestUser) {
        this.validateUserId(user.sub);
        this.validateTaskId(id);

        switch (user.role) {
            case 'ADMIN':
                return this.adminTaskService.getTask(id);
            case 'MANAGER':
                return this.managerTaskService.getTask(id, user.sub);
            case 'MEMBER':
                return this.memberTaskService.getTask(id, user.sub);
            default:
                throw new ForbiddenException("You don't have access to this resource")
        }

    }

    // ADMIN_MANAGER
    async createTask(createTaskDto: CreateTaskDto, creatorId: string): Promise<Task> {
        this.validateUserId(creatorId);
        try {
            const newTask = await this.databaseService.task.create({
                data: {
                    ...createTaskDto,
                    creatorId,
                }
            })
            return newTask;
        } catch {
            throw new InternalServerErrorException("Failed to create new task")
        }
    }

    // ADMIN_MANAGER
    async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: RequestUser) {
        this.validateUserId(user.sub);
        this.validateTaskId(id);

        const task = await this.validateTask(id);

        const isCreator = task.creatorId === user.sub;
        const isAdmin = user.role === 'ADMIN';

        if (!isCreator && !isAdmin) {
            throw new ForbiddenException(`You cannot update this task`)
        }

        try {
            return this.databaseService.task.update({
                where: { id },
                data: updateTaskDto,
            })
        } catch {
            throw new InternalServerErrorException("Failed to update task")
        }
    }

    //All Authenticated Users
    async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, user: RequestUser) {
        this.validateUserId(user.sub);
        this.validateTaskId(id);

        const task = await this.validateTask(id);

        const isAssignee = task.assigneeId === user.sub;
        const isCreator = task.creatorId === user.sub;
        const isAdmin = user.role === 'ADMIN';

        if (!isAssignee && !isCreator && !isAdmin) {
            throw new ForbiddenException(`You cannot update this task status`)
        }

        try {
            return this.databaseService.task.update({
                where: { id },
                data: updateTaskStatusDto,
            })
        } catch {
            throw new InternalServerErrorException("Failed to update task status")
        }
    }

    // ADMIN_MANAGER
    async deleteTask(id: string, creatorId: string, role: string) {
        this.validateUserId(creatorId);
        this.validateTaskId(id);

        if (role !== 'ADMIN') {
            await this.validateTaskCreatorship(id, creatorId)
        }

        try {
            await this.databaseService.task.delete({
                where: {
                    id
                }
            })
            return { success: true, message: "Task deleted successfully" }
        } catch {
            throw new InternalServerErrorException("Failed to delete task")
        }
    }

    // MEMBER
    async counMyTasks(assigneeId: string): Promise<number> {
        try {
            return this.databaseService.task.count({
                where: { assigneeId }
            })
        } catch {
            throw new InternalServerErrorException("Failed to get tasks count")
        }
    }


    //helpers
    async validateTaskCreatorship(id: string, creatorId: string): Promise<void> {
        const task = await this.databaseService.task.findUnique({
            where: { id, creatorId },
            select: {
                id: true,
            }
        })
        if (!task) throw new NotFoundException(`Task with ID ${id} not found or you don't have access to it`)
    }
    async validateTaskAssigneeship(id: string, assigneeId: string): Promise<void> {
        const task = await this.databaseService.task.findUnique({
            where: { id, assigneeId },
            select: {
                id: true,
            }
        })
        if (!task) throw new NotFoundException(`Task with ID ${id} not found or you don't have access to it`)
    }

    async validateTask(id: string): Promise<{ assigneeId: string, creatorId: string }> {
        const task = await this.databaseService.task.findUnique({
            where: { id }, select: { assigneeId: true, creatorId: true }
        });
        if (!task) throw new NotFoundException(`Task with ID ${id} not found`)
        return { assigneeId: task.assigneeId, creatorId: task.creatorId };
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
