import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class GetProjectsDto {
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

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sortBy?: "desc" | 'asc';
}