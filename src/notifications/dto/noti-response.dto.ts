import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "@prisma/client";

class NotificationListItem {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: NotificationType })
    type: NotificationType

    @ApiProperty({ type: 'string' })
    message: string;

    @ApiProperty({ type: 'string' })
    link: string;

    @ApiProperty({ type: 'boolean' })
    read: boolean;

    @ApiProperty({ type: 'string' })
    userId: string;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;
}

export class PaginatedNotificationResponse {
    @ApiProperty({ type: [NotificationListItem] })
    notifications: NotificationListItem[]

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    unreadCount: number;
}