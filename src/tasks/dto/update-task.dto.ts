// import { PartialType } from "@nestjs/swagger"
// import { CreateTaskDto } from "./create-task.dto"

import { IsOptional } from "class-validator";
import { TaskStatus } from "generated/prisma";

// export class UpdateTaskDto extends PartialType(CreateTaskDto) { }
export class UpdateTaskDto {
    @IsOptional()
    title?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    status?: TaskStatus;
}