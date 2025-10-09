import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AdminProjectService } from './admin-project/admin-project.service';
import { ManagerProjectService } from './manager-project/manager-project.service';
import { MemberProjectService } from './member-project/member-project.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, AdminProjectService, ManagerProjectService, MemberProjectService]
})
export class ProjectsModule { }
