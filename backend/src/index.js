import connectDB from './db/db.js'
import dotenv from 'dotenv'
import {app, httpServer} from './app.js'



dotenv.config({
    path:'backend/.env'
})

const port = process.env.PORT || 3000
connectDB()
.then(()=>{
    httpServer.listen( port ,()=>{
        console.log("server is running on port" ,port )
    })
})
.catch((error)=>{
    console.log("connection failed",error)
})
