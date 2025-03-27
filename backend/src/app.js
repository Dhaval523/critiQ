import express from  'express'
import cors from 'cors'
import dotenv from  'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true ,
}))

app.use(express.json({limit :'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser());

import userRoutes from './routes/User.route.js'
import reviewRouter from './routes/Review.route.js';
import playlistRouter from './routes/Playlist.route.js'
import NotificationRouter  from './routes/Notification.route.js';
app.use("/api/v1/users",userRoutes)
app.use("/api/v1/reviews",reviewRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/notifiaction",NotificationRouter)


export default app ;