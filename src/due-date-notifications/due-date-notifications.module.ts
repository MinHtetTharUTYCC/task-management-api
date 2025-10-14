import { Module } from '@nestjs/common';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { DueDateNotificationsService } from './due-date-notifications.service';

@Module({
    imports: [TasksModule, NotificationsModule],
    providers: [DueDateNotificationsService],
})
export class DueDateNotificationsModule { }
