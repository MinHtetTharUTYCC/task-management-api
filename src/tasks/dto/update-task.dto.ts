// import { PartialType } from "@nestjs/swagger"
// import { CreateTaskDto } from "./create-task.dto"

import { IsOptional, IsString } from "class-validator";
import { TaskStatus } from "generated/prisma";

// export class UpdateTaskDto extends PartialType(CreateTaskDto) { }
export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    status?: TaskStatus;
}