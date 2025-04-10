import connectDB from './db/db.js'
import dotenv from 'dotenv'
import app  from "./app.js";

dotenv.config({
    path:'backend\.env'
})
connectDB()
.then(()=>{
    app.listen(5300,()=>{
        console.log("server is running on port 5300")
    })
})
.catch((error)=>{
    console.log("connection failed",error)
})
