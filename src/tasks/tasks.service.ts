import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { NotificationType, Task, TaskStatus, UserRole } from '@prisma/client';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { RequestUser } from 'src/auth/request-user.interface';
import { AdminTaskService } from './admin-task/admin-task.service';
import { ManagerTaskService } from './manager-task/manager-task.service';
import { MemberTaskService } from './member-task/member-task.service';
import { GetTasksDto } from './dto/get-tasks.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-noti.dto';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { handlePrismaError } from 'src/utils/handle-prisma-error';

@Injectable()
export class TasksService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly adminTaskService: AdminTaskService,
        private readonly managerTaskService: ManagerTaskService,
        private readonly memberTaskService: MemberTaskService,

        private readonly notificationService: NotificationsService,
        private readonly notificationsGateway: NotificationsGateway,

    ) { }

    //ALL autehnticated Users
    async getTasks(getTasksDto: GetTasksDto, user: RequestUser) {

        switch (user.role) {
            case 'ADMIN':
                return this.adminTaskService.getAllTasks(getTasksDto);
            case 'MANAGER':
                return this.managerTaskService.getTasks(getTasksDto, user.sub);
            case 'MEMBER':
                return this.memberTaskService.getTasks(getTasksDto, user.sub);
            default:
                throw new ForbiddenException("You don't have access to this resource")
        }
    }

    // All Authenticated Users
    async getTask(id: string, user: RequestUser) {
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

    //MANAGER
    async createTask(createTaskDto: CreateTaskDto, creatorId: string): Promise<Task> {
        try {
            const [task, createNotificationDto] = await this.databaseService.$transaction(async (tx) => {
                const newTask = await tx.task.create({
                    data: { ...createTaskDto, creatorId },
                });

                await tx.projectMember.upsert({
                    where: { projectId_userId: { projectId: createTaskDto.projectId, userId: createTaskDto.assigneeId } },
                    update: {},
                    create: { projectId: createTaskDto.projectId, userId: createTaskDto.assigneeId },
                });

                const createNotificationDto: CreateNotificationDto = {
                    message: "You are assinged to a task",
                    type: NotificationType.TASK_ASSIGNED,
                    link: `/tasks/${newTask.id}`,
                    userId: newTask.assigneeId,
                }

                await this.notificationService.createNotification(createNotificationDto)
                return [newTask, createNotificationDto];
            });

            this.notificationsGateway.sendNotification(createNotificationDto)

            return task;
        } catch {
            throw new InternalServerErrorException("Failed to create new task")
        }
    }

    // MANAGER
    async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: RequestUser): Promise<Task> {
        this.validateTaskId(id);

        try {
            const task = await this.validateTask(id);
            const isCreator = task.creatorId === user.sub;

            if (!isCreator) {
                throw new ForbiddenException(`You cannot update this task`)
            }

            const taskUpdate = await this.databaseService.$transaction(async (tx) => {
                const task = await tx.task.update({
                    where: { id },
                    data: updateTaskDto,
                });

                const createNotificationDto: CreateNotificationDto = {
                    message: "A task assigned to you has been updated",
                    type: NotificationType.TASK_UPDATED,
                    link: `/tasks/${task.id}`,
                    userId: task.assigneeId,
                }

                const notification = await this.notificationService.createNotification(createNotificationDto)

                return { task, notification };
            });

            this.notificationsGateway.sendNotification(taskUpdate.notification)

            return taskUpdate.task;

        } catch (error) {
            handlePrismaError(error, "Failed to update task")
        }
    }

    //Manager_Member
    async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, user: RequestUser): Promise<{ newStatus: TaskStatus }> {
        this.validateTaskId(id);
        try {
            const existingTask = await this.validateTask(id);
            const isAssignee = existingTask.assigneeId === user.sub;
            const isCreator = existingTask.creatorId === user.sub;

            if (!isAssignee && !isCreator) {
                throw new ForbiddenException(`You cannot update this task status`)
            }

            if (isAssignee && updateTaskStatusDto.status === "OPEN") {
                throw new ForbiddenException("You cannot change status to 'OPEN'")

            }

            const taskUpdate = await this.databaseService.$transaction(async (tx) => {
                const task = await tx.task.update({
                    where: { id },
                    data: updateTaskStatusDto,
                    select: { status: true }
                });


                let notiType: NotificationType;
                switch (updateTaskStatusDto.status) {
                    case "OPEN":
                        notiType = NotificationType.TASK_OPEN;
                        break;
                    case "IN_PROGRESS":
                        notiType = NotificationType.TASK_IN_PROGRESS;
                        break;
                    case "DONE":
                        notiType = NotificationType.TASK_COMPLETED;
                        break;
                    default:
                        throw new BadRequestException("Invalid status");
                }

                const createNotificationDto: CreateNotificationDto = {
                    message: `Task status updated to ${updateTaskStatusDto.status}`,
                    type: notiType,
                    link: `/tasks/${id}`,
                    userId: isAssignee ? existingTask.creatorId : existingTask.assigneeId,
                };

                const notification = await this.notificationService.createNotification(createNotificationDto);

                return { task, notification }
            });

            this.notificationsGateway.sendNotification(taskUpdate.notification)

            return { newStatus: taskUpdate.task.status };
        } catch (error) {
            handlePrismaError(error, "Failed to update task status")
        }
    }

    // MANAGER
    async deleteTask(id: string, user: RequestUser): Promise<{ message: string }> {
        this.validateTaskId(id);

        try {
            await this.validateTaskAndCreatorship(id, user.sub)
            await this.databaseService.task.delete({
                where: {
                    id
                }
            })
            return { message: "Task deleted successfully" }
        } catch (error) {
            handlePrismaError(error, "Failed to delete task")
        }
    }

    async findDueTasks(): Promise<Pick<Task, 'id' | 'title' | 'assigneeId'>[]> {
        try {
            const now = new Date();
            const oneDayFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));

            return this.databaseService.task.findMany({
                where: {
                    status: {
                        not: "DONE",
                    },
                    dueDate: {
                        gte: now,
                        lte: oneDayFromNow,
                    }
                },
                select: {
                    id: true,
                    title: true,
                    assigneeId: true,
                }
            })

        } catch (error) {
            handlePrismaError(error, "Failed to get tasks")
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
    async validateTaskAndCreatorship(id: string, creatorId: string): Promise<void> {
        const task = await this.databaseService.task.findUnique({
            where: { id },
            select: {
                id: true,
                creatorId: true,
            }
        })
        if (!task) throw new NotFoundException(`Task not found`)
        if (task.creatorId !== creatorId) {
            throw new ForbiddenException(`You cannot access this task`)
        }
    }


    async validateTask(id: string): Promise<{ assigneeId: string, creatorId: string }> {
        const task = await this.databaseService.task.findUnique({
            where: { id }, select: { assigneeId: true, creatorId: true }
        });
        if (!task) throw new NotFoundException(`Task not found`)
        return { assigneeId: task.assigneeId, creatorId: task.creatorId };
    }

    private validateTaskId(taskId: string): void {
        if (!taskId || taskId.trim().length === 0) {
            throw new BadRequestException('Task ID is required');
        }
    }


}
