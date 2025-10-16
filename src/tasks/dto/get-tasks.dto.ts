// get-tasks.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTasksDto {
    @ApiPropertyOptional({ minimum: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize?: number;

    @ApiPropertyOptional({ enum: TaskStatus })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiPropertyOptional({ enum: TaskPriority })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    projectId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sortBy?: "desc" | 'asc';
}