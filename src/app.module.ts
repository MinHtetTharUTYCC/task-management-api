import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';



@Module({
  imports: [AuthModule, DatabaseModule, TasksModule, ProjectsModule, CommentsModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
