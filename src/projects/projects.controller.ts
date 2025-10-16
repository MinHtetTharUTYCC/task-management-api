import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Auth } from 'src/auth/auth.decorator';
import { ReqUser } from 'src/auth/req-user.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedProjectResponse, ProjectDetailsResponse } from './dto/project-response.dto';
import { GetProjectsDto } from './dto/get-projects.dto';


@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Auth()
    @Get()
    @ApiOperation({
        summary: 'Get all projects',
        description: 'Returns projects based on user role. Admin sees all projects, Manager sees their created projects, Member sees projects they are participated.'
    })
    @ApiResponse({ status: 200, description: 'Projects retrieved', type: PaginatedProjectResponse })
    getAllProjects(@Query(ValidationPipe) getProjectsDto: GetProjectsDto, @ReqUser() user: RequestUser) {
        return this.projectsService.getAllProjects(getProjectsDto, user);
    }

    @Auth()
    @Get(':id')
    @ApiOperation({ summary: 'Get a project by id', description: 'Returns task details. Fields available depend on user role: Admin (all fields), Manager (no creator), Member (no assignee).' })
    @ApiResponse({
        status: 200, description: 'Project found', type: ProjectDetailsResponse
    })
    getProject(@Param('id') id: string, @ReqUser() user: RequestUser): Promise<ProjectDetailsResponse> {
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