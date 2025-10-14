import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule'
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
import { TasksService } from 'src/tasks/tasks.service';
import { handlePrismaError } from 'src/utils/handle-prisma-error';

@Injectable()
export class DueDateNotificationsService {
    constructor(
        private readonly taskService: TasksService,
        private readonly notificationService: NotificationsService,
        private readonly notificationGateway: NotificationsGateway,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async checkDueDatesAndNotify() {
        console.log("Checking: =>>>>>")
        try {
            const dueTasks = await this.taskService.findDueTasks();


            for (const task of dueTasks) {

                try {

                    await this.notificationService.createNotification({
                        message: `Task ${task.title} is due today!`,
                        type: "DUE_SOON",
                        link: `/tasks/${task.id}`,
                        userId: task.assigneeId,
                    });

                    this.notificationGateway.sendNotification({
                        message: `Task ${task.title} is due today!`,
                        type: "DUE_SOON",
                        link: `/tasks/${task.id}`,
                        userId: task.assigneeId,
                    })
                } catch (innerError) {
                    //logger TODO: III
                    // this.logger.error(`Failed to send notification for task "${task.title}": ${innerErr.message}`);
                    handlePrismaError(innerError, `Notification failed for task "${task.title}"`)
                }
            }

        } catch (error) {
            //logger TODO: III
            // this.logger.error('Cron job failed', error.stack);
            handlePrismaError(error, "Failed to notify about due dates")
        }
    }

}
