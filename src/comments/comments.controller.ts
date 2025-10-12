import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReqUser } from 'src/auth/req-user.decorator';
import type { RequestUser } from 'src/auth/request-user.interface';
import { UpdateCommentDto } from './dto/update-comment-dto';

@Controller('tasks/:taskId/comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService) { }

    @Auth()
    @Get()
    async getComments(@Param('taskId') taskId: string) {
        return this.commentService.getComments(taskId)
    }

    @Auth()
    @Post()
    async createComment(@Param('taskId') taskId: string, @Body(ValidationPipe) createCommentDto: CreateCommentDto, @ReqUser() user: RequestUser) {
        return this.commentService.createComment(taskId, user, createCommentDto)
    }

    @Auth()
    @Patch(':id')
    async updateComment(@Param('id') id: string, @Param('taskId') taskId: string, @Body(ValidationPipe) updateCommentDto: UpdateCommentDto, @ReqUser() user: RequestUser) {
        return this.commentService.updateComment(id, taskId, user, updateCommentDto)
    }

    @Auth()
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteComment(@Param('id') id: string, @ReqUser() user: RequestUser) {
        return this.commentService.deleteComment(id, user)
    }

}
