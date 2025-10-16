// import { ApiProperty } from '@nestjs/swagger';
// import { TaskStatus, TaskPriority } from '@prisma/client';

// export class Task {
//     @ApiProperty()
//     id: string;

//     @ApiProperty()
//     title: string;

//     @ApiProperty({ required: false, nullable: true })
//     description: string | null;

//     @ApiProperty({ enum: TaskStatus })
//     status: TaskStatus;

//     @ApiProperty({ enum: TaskPriority })
//     priority: TaskPriority;

//     @ApiProperty({ type: 'string', format: 'date-time', required: false, nullable: true })
//     dueDate: Date | null;

//     @ApiProperty()
//     projectId: string;

//     @ApiProperty()
//     creatorId: string;

//     @ApiProperty()
//     assigneeId: string;

//     @ApiProperty({ type: 'string', format: 'date-time' })
//     createdAt: Date;

//     @ApiProperty({ type: 'string', format: 'date-time' })
//     updatedAt: Date;
// }
