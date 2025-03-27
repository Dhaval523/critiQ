import mongoose,{Schema} from "mongoose";

// Define the Playlist Schema
const PlaylistSchema = new Schema({
  name: { type: String, required: true },
  movies: [
    {
      imdbID: String,
      Title: String,
      Year: String,
      Poster: String,
    },
  ],
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
},{
    timestamps: true
});

// Create Model
const Playlist = mongoose.model("Playlist", PlaylistSchema);

export default Playlist;
