import express from "express";
import multer from "multer";

const router = express.Router();
console.log("🔥 posts.route.js is loaded");

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { addPost, commentPost, likePost } from '../controller/posts.controller.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});


const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});
// Route definition

router.post("/addpost/:id" , upload.single('filmimage') , addPost)
router.post("/likepost/:postid/:userid"  , likePost)
router.post("/commentpost/:postid/:userid"  , commentPost)

export default router;