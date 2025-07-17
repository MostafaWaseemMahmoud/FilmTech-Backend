import express from "express";
import multer from "multer";
import { acceptReq, addUser, FindUserAccount, FriendReq, getAllUsers, getIdUser, RejectReq } from "../controller/user.controller.js";

const router = express.Router();
console.log("🔥 user.route.js is loaded");

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

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

router.post('/add', upload.single("avatar"), addUser);
router.get("/all" , getAllUsers);
router.get("/getuser/:id" , getIdUser);
router.post("/finduser" , FindUserAccount);
router.post("/friendreq/:userId/:friendId" , FriendReq);
router.post("/acceptreq/:userId/:friendId" , acceptReq);
router.post("/rejectreq/:userId/:friendId" , RejectReq);

export default router;