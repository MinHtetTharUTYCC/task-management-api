import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-noti.dto';
import { NotificationsService } from './notifications.service';
import { Auth } from 'src/auth/auth.decorator';
import { ReqUser } from 'src/auth/req-user.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationService: NotificationsService) { }

    @Auth()
    @Get()
    getNotifications(@ReqUser() user: RequestUser) {
        return this.notificationService.getNotifications(user)
    }

    @Auth()
    @Post()
    createNotification(@Body(ValidationPipe) createNotificationDto: CreateNotificationDto) {
        return this.notificationService.createNotification(createNotificationDto)
    }
}
