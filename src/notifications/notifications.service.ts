import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-noti.dto';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { Notification, Prisma } from '@prisma/client';
import { RequestUser } from 'src/auth/request-user.interface';
import { GetNotisDto } from './dto/get-Notis.dto';
import { PaginatedNotificationResponse } from './dto/noti-response.dto';

@Injectable()
export class NotificationsService {

    constructor(private readonly databaseService: DatabaseService) { }

    async getNotifications(getNotisDto: GetNotisDto, user: RequestUser): Promise<PaginatedNotificationResponse> {
        const { page = 1, pageSize = 10 } = getNotisDto;
        const skip = (page - 1) * pageSize;

        try {
            const where: Prisma.NotificationWhereInput = {
                userId: user.sub
            }

            const [notifications, total, unreadCount] = await Promise.all([

                this.databaseService.notification.findMany({
                    where,
                    skip,
                    take: pageSize,
                    orderBy: {
                        createdAt: "desc"
                    }
                }),
                this.databaseService.notification.count({ where }),
                this.databaseService.notification.count({
                    where: {
                        ...where,
                        read: false,
                    }
                }),
            ]);

            return {
                notifications,
                total,
                page,
                pageSize,
                totalPages: total / pageSize,
                unreadCount,
            }
        } catch (error) {
            handlePrismaError(error, "Failed to get notifications")
        }
    }


    async createNotification(createNotificationDto: CreateNotificationDto) {
        try {
            return this.databaseService.notification.create({
                data: createNotificationDto,
                select: {
                    message: true,
                    type: true,
                    link: true,
                    userId: true,
                }
            })
        } catch (error) {
            handlePrismaError(error, "Failed to send notification")
        }

    }
}
