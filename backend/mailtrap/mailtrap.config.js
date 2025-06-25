import dotenv from "dotenv";
dotenv.config();
import { MailtrapClient } from "mailtrap";

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mouhssine KINANI",
};

// const recipients = [
//   {
//     email: "kinanimouhssine@gmail.com",
//   },
// ];

// mailtrapClient
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     html: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
