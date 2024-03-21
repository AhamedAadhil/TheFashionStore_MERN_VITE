import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_ADDRESS,
    to: data.to,
    bcc: "ahamedaathil.5@gmail.com",
    subject: data.subject,
    text: data.text,
    html: data.html,
    headers: {
      "In-Reply-To": null,
      References: null,
    },
  };

  const sendMail = async (transporter, mailOptions) => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email has been sent Successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  sendMail(transporter, mailOptions);
};
