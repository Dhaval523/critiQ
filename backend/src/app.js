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
        origin:  "https://critiq-2.onrender.com",
        credentials: true,
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
    origin:  "https://critiq-2.onrender.com",
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
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});


export { app, httpServer };