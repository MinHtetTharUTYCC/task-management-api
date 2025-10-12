import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-noti.dto';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';

@Injectable()
export class NotificationsService {

    constructor(private readonly databaseService: DatabaseService) { }

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
