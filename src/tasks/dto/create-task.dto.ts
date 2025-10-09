import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsUUID()
    projectId: string;

    @IsNotEmpty()
    @IsUUID()
    assigneeId: string;
}