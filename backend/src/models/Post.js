import mongoose,{Schema} from "mongoose";

const postSchema = new Schema({
  content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Post  = mongoose.model('Post', postSchema);

export default Post;
