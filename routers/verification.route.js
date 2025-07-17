import express from "express";
import mailer from "../Services/mail.service.js";
const router = express.Router();

router.post('/:email' , async (req,res)=> {
  const {subject,message} = req.body;
  const email = req.params.email;
  mailer('filmtech@gmail.com',email,subject,message,req,res);
})

export default  router;
