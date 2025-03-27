import mongoose ,{Schema} from 'mongoose'

const notificationSchema = new Schema({

    recipient :{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
         required:true 
    },
    sender :{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
         required:true 
    },
    type: {
        type:String,
        enum:['like','post','playlist','follow'],
        required: true 
    },
    relatedId : {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    message : String,

    read : {
        type : Boolean,
        default : false
    }
},{timestamps: true})

notificationSchema.index({ createdAt: -1 });
const Notifications = mongoose.model('Notifications',notificationSchema)

export default Notifications



