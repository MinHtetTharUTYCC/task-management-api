import { Body, Controller, Delete, Post, Get, Param, Patch, ValidationPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Auth } from 'src/auth/auth.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';
import { ReqUser } from 'src/auth/req-user.decorator';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedTaskResponse, TaskDetailsResponse } from './dto/task-response.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }

    @Auth('MANAGER')
    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'Task created', type: TaskDetailsResponse })
    createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto, @ReqUser() user: RequestUser) {
        return this.taskService.createTask(createTaskDto, user.sub)
    }

    @Auth()
    @Get()
    @ApiOperation({
        summary: 'Get all tasks',
        description: 'Returns tasks based on user role. Admin sees all tasks, Manager sees their created tasks, Member sees assigned tasks.'
    })
    @ApiResponse({ status: 200, description: 'Tasks retrieved', type: PaginatedTaskResponse })
    getTasks(@Query(ValidationPipe) getTasksDto: GetTasksDto, @ReqUser() user: RequestUser): Promise<PaginatedTaskResponse> {
        return this.taskService.getTasks(getTasksDto, user)
    }

    @Auth()
    @Get(':id')
    @ApiOperation({ summary: 'Get a task by id', description: 'Returns task details. Fields available depend on user role: Admin (all fields), Manager (no creator), Member (no assignee).' })
    @ApiResponse({
        status: 200, description: 'Task found', type: TaskDetailsResponse
    })
    getTask(@Param('id') id: string, @ReqUser() user: RequestUser): Promise<TaskDetailsResponse> {
        return this.taskService.getTask(id, user)
    }

    @Auth('MANAGER')
    @Patch(':id')
    @ApiOperation({ summary: 'Update a task' })
    @ApiResponse({ status: 200, description: 'Task updated', type: TaskDetailsResponse })
    updateTask(@Param('id') id: string, @Body(ValidationPipe) updateTaskDto: UpdateTaskDto, @ReqUser() user: RequestUser) {
        return this.taskService.updateTask(id, updateTaskDto, user)
    }

    @Auth('MANAGER', 'MEMBER')
    @Patch(':id/status')
    updateTaskStatus(@Param('id') id: string, @Body(ValidationPipe) updateTaskStatusDto: UpdateTaskStatusDto, @ReqUser() user: RequestUser) {
        return this.taskService.updateTaskStatus(id, updateTaskStatusDto, user)
    }

    @Auth('MANAGER')
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteTask(@Param('id') id: string, @ReqUser() user: RequestUser) {
        return this.taskService.deleteTask(id, user)
    }
}
