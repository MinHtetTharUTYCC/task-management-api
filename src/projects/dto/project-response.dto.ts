import { ApiProperty } from "@nestjs/swagger";
import { TaskPriority, TaskStatus } from "@prisma/client";

class ProjectBase {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ type: 'string', required: false, nullable: true })
    description: string | null;

    @ApiProperty()
    ownerId: string;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;
}

class OwnerInfo {
    @ApiProperty()
    id: string

    @ApiProperty()
    username: string;
}


class MemberInfo {
    @ApiProperty()
    id: string

    @ApiProperty()
    userId: string;

    @ApiProperty()
    user: { username: string }
}

class TaskInfo {
    @ApiProperty()
    id: string

    @ApiProperty()
    title: string;

    @ApiProperty({ type: 'string', required: false, nullable: true })
    description: string | null;

    @ApiProperty({ enum: TaskStatus })
    status: TaskStatus;

    @ApiProperty({ enum: TaskPriority })
    priority: TaskPriority;

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;
}


export class ProjectDetailsResponse extends ProjectBase {
    @ApiProperty({ type: OwnerInfo, required: false, description: "Availabe for Admin and Member" })
    owner?: OwnerInfo;

    @ApiProperty({ type: MemberInfo, required: false, description: "Available for Admin and Manager" })
    members?: MemberInfo[];

    @ApiProperty({ type: TaskInfo, required: false, description: "Avaialbe for all users" })
    tasks?: TaskInfo[];

    @ApiProperty({ required: false, description: 'Avaialbe for members' })
    _count?: { tasks: number, members: number }
}

//get Projects
class CountsInProjectItem {
    @ApiProperty({ type: 'number', required: false, description: "Availabe for all users" })
    members: number;

    @ApiProperty({ type: 'number', required: false, description: "Availabe for all users" })
    tasks: number
}
export class ProjectListItem extends ProjectBase {
    @ApiProperty({ type: OwnerInfo, required: false })
    owner?: OwnerInfo;

    @ApiProperty({ type: CountsInProjectItem, description: 'Numbers of members and tasks' })
    _count: CountsInProjectItem;

    @ApiProperty({ type: TaskInfo, required: false })
    task?: TaskInfo[];
}


export class PaginatedProjectResponse {
    @ApiProperty({ type: [ProjectListItem] })
    projects: ProjectListItem[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    totalPages: number;
}

