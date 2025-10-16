import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator"
import { TaskPriority } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
    @ApiProperty({ description: 'Task title' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Task description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Project of task' })
    @IsString()
    projectId: string;

    @ApiProperty({ description: 'Task assignee' })
    @IsString()
    assigneeId: string;

    @ApiProperty({ enum: TaskPriority, required: false })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @ApiProperty({ description: 'Task due date', required: false })
    @IsOptional()
    @IsDateString()
    dueDate?: string;
}