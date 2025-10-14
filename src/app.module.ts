import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { DueDateNotificationsModule } from './due-date-notifications/due-date-notifications.module';
import { ScheduleModule } from '@nestjs/schedule';



@Module({
  imports: [AuthModule, DatabaseModule, TasksModule, ProjectsModule, CommentsModule, NotificationsModule, UsersModule, ProfileModule,
    DueDateNotificationsModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
