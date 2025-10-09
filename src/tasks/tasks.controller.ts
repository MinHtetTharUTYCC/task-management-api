import { Body, Controller, Delete, Post, Get, Param, Patch, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Auth } from 'src/auth/auth.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';
import { ReqUser } from 'src/auth/req-user.decorator';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }

    @Auth('ADMIN', 'MANAGER')
    @Post()
    createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto, @ReqUser() user: RequestUser) {
        return this.taskService.createTask(createTaskDto, user.sub)
    }

    @Auth()
    @Get()
    getTasks(@ReqUser() user: RequestUser) {
        return this.taskService.getTasks(user)
    }

    @Auth()
    @Get(':id')
    getTask(@Param('id') id: string, @ReqUser() user: RequestUser) {
        return this.taskService.getTask(id, user)
    }

    @Auth('ADMIN', 'MANAGER')
    @Patch(':id')
    updateTask(@Param('id') id: string, @Body(ValidationPipe) updateTaskDto: UpdateTaskDto, @ReqUser() user: RequestUser) {
        return this.taskService.updateTask(id, updateTaskDto, user)
    }

    @Auth()
    @Patch(':id/status')
    updateTaskStatus(@Param('id') id: string, @Body(ValidationPipe) updateTaskStatusDto: UpdateTaskStatusDto, @ReqUser() user: RequestUser) {
        return this.taskService.updateTaskStatus(id, updateTaskStatusDto, user)
    }

    @Auth('ADMIN', 'MANAGER')
    @Delete(':id')
    deleteTask(@Param('id') id: string, @ReqUser() user: RequestUser) {
        return this.taskService.deleteTask(id, user.sub, user.role)
    }
}
