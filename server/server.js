const express = require('express');
const path = require ('path'); //buil-in NodeJs --> rut gon duong dan
const http = require ('http'); //buil-in NodeJS
const socketIO = require('socket.io');
const {generateMessage, generateLocation} = require ('./messageTemplates')
const Room = require('./model/Room')
const newRoom = new Room();

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket)=> {
    
    socket.on("joinRoom", msg =>{
        const {name, room} = msg;
        newRoom.addUser(socket.id, name, room)
        socket.join(room);

        //send Wellcome to signin user
        socket.emit("serverMsg", generateMessage(
            "Admin",
            `Wellcome ${name} join our room`
        ))
        //send noti to all members
        socket.broadcast.to(room).emit("serverMsg", generateMessage(
            "Admin",
            `${name} has join the room`
        ))
        //add user list on sidebar
        io.to(room).emit("userList", {
            userList: newRoom.findUsersInRoom(room)
        })
        //receive and send msg to client
        socket.on("sendMsg", msg =>{
            console.log(msg);
            io.to(room).emit("serverMsg", msg )
        })
       
        socket.on("clientLocation", msg =>{
            console.log(msg);
            io.emit("serverLocation", generateLocation(
                msg.from,
                msg.lat, msg.lng
            ))
        })
       
        socket.on("disconnect", ()=> {
            const user = newRoom.removeUserById(socket.id)
            io.to(room).emit("userList", {
                userList: newRoom.findUsersInRoom(room)
            })
            io.to(room).emit("serverMsg", generateMessage(
                "Admin",
                `${user.name} has left the room`
            ))
        })
    })
})

app.use( express.static(publicPath));

server.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})