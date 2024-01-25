import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_KEY: any = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY: any = process.env.AWS_SECRET_ACCESS_KEY;

console.log("ACCESS_KEY", ACCESS_KEY);
console.log("SECRET_KEY", SECRET_KEY);

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "eu-north-1",
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

type mailoptionsType = {
  to: string;
  subject: string;
  body: string;
};

const sendEmail = async (options: mailoptionsType) => {

  const mailOptions = {
    from: `Morbytes <hello@whoosh.com.ng>`,
    to: options.to,
    subject: options.subject,
    html: options.body,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("send Email Error", err);
    } else {
      console.log(info);
    }
  });
};

export default sendEmail;