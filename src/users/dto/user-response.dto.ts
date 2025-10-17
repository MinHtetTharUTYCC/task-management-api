import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

export class UserListItem {
    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ enum: UserRole })
    role: UserRole;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;
}

export class PaginatedUserResponse {
    @ApiProperty({ type: [UserListItem] })
    users: UserListItem[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    totalPages: number;
}

