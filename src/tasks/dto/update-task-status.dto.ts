import { IsEnum } from "class-validator";
import { TaskStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskStatusDto {
    @ApiProperty({ enum: TaskStatus, required: false })
    @IsEnum(TaskStatus)
    status: TaskStatus;
}