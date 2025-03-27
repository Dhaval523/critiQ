import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";

const createNotification = async (recipientId , senderId ,type, relatedId, message)=>{
    try {
        const notification = new Notification({
            recipient : recipientId ,
            sender : senderId,
            type,
            relatedId ,
            message
        });
        await notification.save();
        return  notification ;
        
    } catch (error) {
         throw ApiError(500,"error creatingnotification",error);
    }
}
export {
    createNotification
}