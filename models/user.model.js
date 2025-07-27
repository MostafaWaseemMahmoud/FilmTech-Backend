import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  id: Number,
  filmtitle: String,
  filmrate: String,
  myopinion: String,
  category: String,
  filmimage: String,
  comments: [/* comments structure */],
  likes: [String], // مهم جدًا تكون Array of user IDs
});



const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  waitingFriends : [],
  friendRequests:[],
  friends: [],
  posts: [postSchema],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export default User;
