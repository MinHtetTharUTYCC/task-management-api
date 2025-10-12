import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNotificationDto } from './dto/create-noti.dto';


@WebSocketGateway({ cors: true })
export class NotificationsGateway {

  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId)
    console.log(`Client ${client.id} joined room ${userId}`)
  }

  sendNotification(notification: CreateNotificationDto) {
    console.log("Sent NOTI:", notification)
    this.server.to(notification.userId).emit('notification', notification)
  }
}
