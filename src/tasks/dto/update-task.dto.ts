import { IsDateString, IsOptional, IsEnum, IsString } from "class-validator";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskDto {
    @ApiProperty({ description: 'Task title', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'Task description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: TaskStatus, required: false })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiProperty({ enum: TaskPriority, required: false })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @ApiProperty({ description: 'Task due date', required: false })
    @IsOptional()
    @IsDateString()
    dueDate?: string;


}