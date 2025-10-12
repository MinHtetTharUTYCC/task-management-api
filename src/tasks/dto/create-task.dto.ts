import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from "class-validator"
import { TaskPriority } from "@prisma/client";

export class CreateTaskDto {
    @IsNotEmpty()
    title: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty()
    projectId: string;

    @IsNotEmpty()
    assigneeId: string;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    @IsDateString()
    dueDate?: string;
}