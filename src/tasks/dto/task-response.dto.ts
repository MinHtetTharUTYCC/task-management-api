import { ApiProperty } from "@nestjs/swagger";
import { TaskPriority, TaskStatus } from "@prisma/client";

class UserInfo {
    @ApiProperty()
    id: string;

    @ApiProperty()
    username: string;
}

class ProjectInfo {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ nullable: true })
    description: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    ownerId: string;
}
export class TaskBase {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty({ type: 'string', required: false, nullable: true })
    description: string | null;

    @ApiProperty({ enum: TaskStatus })
    status: TaskStatus;

    @ApiProperty({ enum: TaskPriority })
    priority: TaskPriority;

    @ApiProperty({ type: 'string', format: 'date-time', required: false, nullable: true })
    dueDate: Date | null;

    @ApiProperty()
    projectId: string;

    @ApiProperty()
    creatorId: string;

    @ApiProperty()
    assigneeId: string;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    @ApiProperty({ type: 'string', format: 'date-time' })
    updatedAt: Date;
}
export class TaskDetailsResponse extends TaskBase {
    @ApiProperty({ type: ProjectInfo })
    project: ProjectInfo;

    @ApiProperty({ type: UserInfo, required: false, description: 'Available for Admin and Member roles' })
    creator?: UserInfo;

    @ApiProperty({ type: UserInfo, required: false, description: 'Available for Admin and Manager roles' })
    assignee?: UserInfo;
}


//getTasks
export class TaskListItem extends TaskBase {
    @ApiProperty({ type: ProjectInfo })
    project: ProjectInfo;

    @ApiProperty({ type: UserInfo, required: false })
    creator?: UserInfo;

    @ApiProperty({ type: UserInfo, required: false })
    assignee?: UserInfo;
}

export class PaginatedTaskResponse {
    @ApiProperty({ type: [TaskListItem] })
    tasks: TaskListItem[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    totalPages: number;
}


