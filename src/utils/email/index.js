import nodemailer from "nodemailer";
export async function sendMail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: "'sara7a_app'<youssefnasserabdeltwaab20@gmail.com>",
    to,
    html,
    subject,
  });
}

