import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AdminTaskService } from './admin-task/admin-task.service';
import { ManagerTaskService } from './manager-task/manager-task.service';
import { MemberTaskService } from './member-task/member-task.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
    imports: [NotificationsModule],
    providers: [TasksService, AdminTaskService, ManagerTaskService, MemberTaskService],
    controllers: [TasksController],
})
export class TasksModule { }
