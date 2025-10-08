import { Body, Controller, Delete, Post, Get, Param, Patch, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }

    @UseGuards(AuthGuard)
    @Post()
    createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto, @Request() req: { user: { sub: string; email: string } }) {
        return this.taskService.createTask(createTaskDto, req.user.sub)
    }

    @UseGuards(AuthGuard)
    @Get()
    getMyTasks(@Request() req: { user: { sub: string; email: string } }) {
        return this.taskService.getMyTasks(req.user.sub)
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    getTask(@Param('id') id: string, @Request() req: { user: { sub: string; email: string } }) {
        return this.taskService.getTask(id, req.user.sub)
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    updateTask(@Param('id') id: string, @Body(ValidationPipe) updateTaskDto: UpdateTaskDto, @Request() req: { user: { sub: string; email: string } }) {
        console.log("UPDATE:", updateTaskDto)
        return this.taskService.updateTask(id, updateTaskDto, req.user.sub)
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    deleteTask(@Param('id') id: string, @Request() req: { user: { sub: string; email: string } }) {
        return this.taskService.deleteTask(id, req.user.sub)
    }
}
