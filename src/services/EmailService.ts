import nodeMailer from "nodemailer";

type mailoptionsType = {
  to: string,
  subject: string,
  body: string,
}

const sendEmail = (options: any) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailoptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.body,
  };


  transporter.sendMail(mailoptions, function (err, info) {
    if (err) {
      console.log("send Email Error", err);
    } else {
      console.log(info);
    }
  });
};

export default sendEmail;
