import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import  express from 'express';
const app = express();

import http from 'http';
import { Server } from 'socket.io';
const server = http.createServer(app);
const io = new Server(server,{
    pingTimeout : 60000,
    cors : {
        origin : 'http://localhost:5173'
    }
});

import Users from './routes/User.js'
import Chats from './routes/Chat.js'
import Messages from './routes/Message.js'
import Files from './routes/File.js'
import Poll from './routes/Poll.js'

app.use(express.json())
dotenv.config();
const PORT = 8000 || process.env.PORT

//CORS
// app.use(cors())
app.use(cors({
    origin: ['http://localhost:5173','https://snkr-street-frontend.vercel.app'],
    credentials: true,
}));

//MongoDB CONNECTION
const connect = async () => {
    try {
        await mongoose.connect(process.env.mongoDB);
        console.log("CONNECTED --- MongoDB");
    } catch (error) {
        console.log(error);
    }
}
mongoose.connection.on("disconnected", () => {
  console.log("DISCONNECTED --- MongoDB");
  connect();
});

//SOCKET.IO

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('setup', (userData)=>{
        socket.join(userData)
        console.log(userData);
        socket.emit('connected')
    })

    socket.on('join chat', (room)=>{
        socket.join(room);
        console.log("USER JOINED ROOM " + room);
    })

    socket.on('new message', (msgRecieved, chatDetail, type)=>{
        var senderId = msgRecieved.senderId     
        // if(senderId === member) return;
        let msg = {chatDetail,msgRecieved,type}
        socket.in(chatDetail._id).emit("message received", msg )
    })

    socket.on('typing', (room)=>socket.in(room).emit('typing'))
    socket.on('stop typing', (room)=>socket.in(room).emit('stop typing'))

});

//ROUTES
app.use("/api/users", Users)
app.use("/api/chats", Chats)
app.use("/api/messages", Messages)
app.use("/api/files", Files)
app.use("/api/polls", Poll)

//BACKEND START
server.listen(PORT, ()=>{
    connect();
    console.log("CONNECTED --- BACKEND");
})
app.get('/', (req,res)=>{
    res.send("CONNECTED TO BACKEND")
})