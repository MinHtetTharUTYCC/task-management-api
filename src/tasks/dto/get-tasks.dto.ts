import { IsEnum, IsOptional } from "class-validator";
import { TaskPriority } from "@prisma/client";

export class GetTasksDto {
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    byDate?: "desc" | 'asc';
}