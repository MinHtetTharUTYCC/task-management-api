import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Auth } from 'src/auth/auth.decorator';
import { ReqUser } from 'src/auth/req-user.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';
import { UpdateProjectDto } from './dto/update-project.dto';


@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Auth()
    @Get()
    getAllProjects(@ReqUser() user: RequestUser) {
        return this.projectsService.getAllProjects(user);
    }

    @Auth()
    @Get(':id')
    getProject(@Param('id') id: string, @ReqUser() user: RequestUser) {
        return this.projectsService.getProject(id, user);
    }

    @Auth('MANAGER')
    @Post()
    createProject(@Body(ValidationPipe) createProjectDto: CreateProjectDto, @ReqUser() user: RequestUser) {
        return this.projectsService.createProject(createProjectDto, user);
    }

    @Auth('MANAGER')
    @Patch(':id')
    updateProject(@Param('id') id: string, @Body(ValidationPipe) updateProjectDto: UpdateProjectDto, @ReqUser() user: RequestUser) {
        return this.projectsService.updateProject(id, updateProjectDto, user);
    }

    @Auth('MANAGER')
    @Delete(':id')
    deleteProject(@Param('id') id: string, @ReqUser() user: RequestUser) {
        return this.projectsService.deleteProject(id, user);
    }
}