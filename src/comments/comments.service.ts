import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Comment, NotificationType, UserRole } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { RequestUser } from 'src/auth/request-user.interface';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
@Injectable()
export class CommentsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly notificationService: NotificationsService,
        private readonly notificationGateway: NotificationsGateway
    ) { }

    async getComments(taskId: string): Promise<Comment[]> {
        try {
            return this.databaseService.comment.findMany({
                where: {
                    taskId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

        } catch (error) {
            throw new InternalServerErrorException("Failed to get comments")
        }
    }


    // All Auth Users
    async createComment(taskId: string, user: RequestUser, createCommentDto: CreateCommentDto): Promise<Comment> {
        try {
            if (user.role as UserRole === "MANAGER") {
                await this.validateTaskAndOwnership(taskId, user.sub);
            } else if (user.role as UserRole === "MEMBER") {
                await this.validateTaskAndAssigneeship(taskId, user.sub);
            }

            const result = await this.databaseService.$transaction(async (tx) => {
                const comment = await tx.comment.create({
                    data: {
                        ...createCommentDto,
                        taskId,
                        userId: user.sub,
                    },
                    include: {
                        task: {
                            select: {
                                id: true,
                                title: true,
                                creatorId: true,
                                assigneeId: true,
                            }
                        }
                    }
                });

                const { task } = comment;

                const recepients: { userId: string, message: string }[] = [];

                if (user.role as UserRole === "ADMIN") {
                    // to creator if admin is not task creator
                    if (task.creatorId !== user.sub) {
                        recepients.push({
                            userId: task.creatorId,
                            message: `${user.username} (Admin) commented on your task: ${task.title}`
                        });
                    }
                    recepients.push({
                        userId: task.assigneeId,
                        message: `${user.username} (Admin) commented on your assigned task: ${task.title}`
                    })
                } else if (user.role as UserRole === "MANAGER") {
                    recepients.push({
                        userId: task.assigneeId,
                        message: `${user.username} (Manager) commented on your assigned task: ${task.title}`
                    })
                } else if (user.role as UserRole === "MEMBER") {
                    recepients.push({
                        userId: task.creatorId,
                        message: `${user.username} commented on your task: ${task.title}`
                    })
                }

                //create notis
                const notifications = await Promise.all(
                    recepients.map(r =>
                        this.notificationService.createNotification({
                            message: r.message,
                            type: NotificationType.COMMENT_ADDED,
                            link: `/tasks/${taskId}/comments`,
                            userId: r.userId
                        })
                    )
                )

                return { comment, notifications };
            });

            //emit 
            for (const notification of result.notifications) {
                this.notificationGateway.sendNotification(notification)
            }

            return result.comment;
        } catch (error) {
            handlePrismaError(error, "Failed to comment")
        }
    }

    async updateComment(id: string, taskId: string, user: RequestUser, updateCommentDto: UpdateCommentDto): Promise<Comment> {
        try {

            await this.validateCommentAndOwnership(id, user.sub, user.role as UserRole, "update");
            return this.databaseService.comment.update({
                where: { id, },
                data: {
                    ...updateCommentDto,
                    taskId,
                    userId: user.sub,

                }
            });
        } catch (error) {
            handlePrismaError(error, "Failed to comment")
        }
    }

    async deleteComment(id: string, user: RequestUser): Promise<{ message: string }> {
        try {

            await this.validateCommentAndOwnership(id, user.sub, user.role as UserRole, "delete");
            await this.databaseService.comment.delete({ where: { id } });

            return { message: "Comment deleted successfully" }
        } catch (error) {
            handlePrismaError(error, "Failed to delete comment")
        }
    }

    async validateCommentAndOwnership(id: string, userId: string, role: UserRole, action: "update" | "delete"): Promise<void> {
        const comment = await this.databaseService.comment.findUnique({
            where: { id },
            select: { id: true, userId: true }
        });

        if (!comment) {
            throw new NotFoundException("Comment not found")
        }

        if (role !== 'ADMIN' && comment.userId !== userId) {
            throw new ForbiddenException(`You are not allowed ${action} this comment`)
        }
    }

    async validateTaskAndOwnership(id: string, creatorId: string): Promise<void> {
        const task = await this.databaseService.task.findUnique({
            where: { id },
            select: { id: true, creatorId: true }
        });

        if (!task) {
            throw new NotFoundException("Comment not found")
        }

        if (task.creatorId !== creatorId) {
            throw new ForbiddenException(`You do not belong to this task.`)
        }
    }
    async validateTaskAndAssigneeship(id: string, assigneeId: string): Promise<void> {
        const task = await this.databaseService.task.findUnique({
            where: { id },
            select: { id: true, assigneeId: true }
        });

        if (!task) {
            throw new NotFoundException("Comment not found")
        }

        if (task.assigneeId !== assigneeId) {
            throw new ForbiddenException(`You are not allowed to comment on the task`)
        }
    }
}
