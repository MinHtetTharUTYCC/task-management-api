import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-noti.dto';
import { NotificationsService } from './notifications.service';
import { Auth } from 'src/auth/auth.decorator';
import { ReqUser } from 'src/auth/req-user.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';
import { GetNotisDto } from './dto/get-Notis.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedNotificationResponse } from './dto/noti-response.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationService: NotificationsService) { }

    @Auth()
    @Get()
    @ApiOperation({ summary: 'Get all notifications', description: "Return notifications for requested user" })
    @ApiResponse({ status: 200, description: 'Notifications retrieved', type: PaginatedNotificationResponse })
    getNotifications(@Query(ValidationPipe) getNotisDto: GetNotisDto, @ReqUser() user: RequestUser): Promise<PaginatedNotificationResponse> {
        return this.notificationService.getNotifications(getNotisDto, user)
    }

    @Auth()
    @Post()
    createNotification(@Body(ValidationPipe) createNotificationDto: CreateNotificationDto) {
        return this.notificationService.createNotification(createNotificationDto)
    }
}
