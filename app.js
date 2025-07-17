import dotenv from "dotenv";
dotenv.config();

// Core dependencies
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// Cloudinary & Multer
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Routers
import postsRoute from "./routers/posts.route.js";
import userRoute from "./routers/user.route.js";
import verification from "./routers/verification.route.js";

const app = express();
app.use(cors());
app.use(express.json()); // هذا مهم جداً


app.get('/',(req,res)=>{
  return res.send("Server Is Working (-|-)")
})

app.use('/users' , userRoute)
app.use('/posts' , postsRoute)

app.use('/send',verification)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});


export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});



const PORT = process.env.PORT || 9000;


mongoose.connect(process.env.DB_PASSWORD).then(()=> {
  console.log("dataBase Connected Succ !");
  app.listen(PORT , ()=> {
    console.log("Server Is Running On Port" , PORT);
  })
}).catch((e)=> {
  console.log(`Error While Connecting DataBase ${e}`);
})