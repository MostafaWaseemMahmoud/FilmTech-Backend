import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mostafawaseem22@gmail.com",
    pass: "twap hqpb rbrj bcdp",
  },
    tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = (fromEmail, toEmail, subject, message,req,res) => {
  const mailOptions = {
    from: "filmtech@gmail.com",
    to: toEmail,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
    return res.status(500).send(`Email error Sending ${err}`)
  } else {
    return  res.status(200).send("Email has been Sent")
    }
  });
};

export default  sendEmail;
