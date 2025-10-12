import { io } from "socket.io-client";

const socket = io("http://localhost:3000")

socket.on('connect', () => {
    console.log("Connected: ", socket.id)

    // socket.emit("joinRoom", 'cmgjfpw7d0000w24888o25jaj')//adminId
    socket.emit("joinRoom", 'cmgktquu40000w23wephohxn0')//alice memberId
    socket.emit("joinRoom", 'f0cbb89e-5d73-429a-a3a0-e8dc8312f46f')//bob memberId

});

socket.on('notification', (data) => {
    console.log("New Notification received: ", data)
});


socket.on('disconnect', () => {
    console.log("Disconnected from server!")
})
