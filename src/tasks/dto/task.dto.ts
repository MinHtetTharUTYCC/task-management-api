// // tasks/dto/task.dto.ts
// import { ApiProperty } from '@nestjs/swagger';
// import { TaskStatus, TaskPriority } from '@prisma/client';

// export class TaskDto {
//     @ApiProperty()
//     id: string;

//     @ApiProperty()
//     title: string;

//     @ApiProperty({ required: false })
//     description?: string;

//     @ApiProperty({ enum: TaskStatus })
//     status: TaskStatus;

//     @ApiProperty({ enum: TaskPriority })
//     priority: TaskPriority;

//     @ApiProperty({ required: false })
//     dueDate?: string;

//     @ApiProperty()
//     projectId: string;

//     @ApiProperty()
//     creatorId: string;

//     @ApiProperty()
//     assigneeId: string;

//     @ApiProperty()
//     createdAt: string;

//     @ApiProperty()
//     updatedAt: string;
// }
