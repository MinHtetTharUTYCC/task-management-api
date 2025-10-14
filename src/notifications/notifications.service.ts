import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-noti.dto';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';
import { Notification } from '@prisma/client';
import { RequestUser } from 'src/auth/request-user.interface';

@Injectable()
export class NotificationsService {

    constructor(private readonly databaseService: DatabaseService) { }

    async getNotifications(user: RequestUser): Promise<Notification[]> {
        try {
            return this.databaseService.notification.findMany({
                where: {
                    userId: user.sub
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
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
