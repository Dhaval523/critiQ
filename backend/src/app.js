import express from  'express'
import cors from 'cors'
import dotenv from  'dotenv'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import { createServer } from 'http'


dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
        methods : ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json({limit :'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser());

import userRoutes from './routes/User.route.js'
import reviewRouter from './routes/Review.route.js';
import playlistRouter from './routes/Playlist.route.js'
import NotificationRouter  from './routes/Notification.route.js';
import CommentRouter from './routes/Comment.route.js'
app.use("/api/v1/users",userRoutes)
app.use("/api/v1/reviews",reviewRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/notification",NotificationRouter)
app.use("/api/v1/comment", CommentRouter)   

export { app, httpServer };