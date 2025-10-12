import { IsDateString, IsOptional, IsEnum } from "class-validator";
import { TaskPriority, TaskStatus } from "@prisma/client";

export class UpdateTaskDto {
    @IsOptional()
    title?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    @IsDateString()
    dueDate?: string;


}