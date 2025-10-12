import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-noti.dto';
import { NotificationsService } from './notifications.service';
import { Auth } from 'src/auth/auth.decorator';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationService: NotificationsService) { }

    @Auth()
    @Post()
    createNotification(@Body(ValidationPipe) createNotificationDto: CreateNotificationDto) {
        return this.notificationService.createNotification(createNotificationDto)
    }
}
