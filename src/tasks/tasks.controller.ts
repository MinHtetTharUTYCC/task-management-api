import { Body, Controller, Delete, Post, Get, Param, Patch, ValidationPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Auth } from 'src/auth/auth.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';
import { ReqUser } from 'src/auth/req-user.decorator';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }

    @Auth('MANAGER')
    @Post()
    createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto, @ReqUser() user: RequestUser) {
        return this.taskService.createTask(createTaskDto, user.sub)
    }

    @Auth()
    @Get()
    getTasks(@Query(ValidationPipe) getTasksDto: GetTasksDto, @ReqUser() user: RequestUser) {
        return this.taskService.getTasks(getTasksDto, user)
    }

    @Auth()
    @Get(':id')
    getTask(@Param('id') id: string, @ReqUser() user: RequestUser) {
        return this.taskService.getTask(id, user)
    }

    @Auth('MANAGER')
    @Patch(':id')
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
