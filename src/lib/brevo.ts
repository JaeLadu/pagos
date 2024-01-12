import { SendSmtpEmail, TransactionalEmailsApi } from "@getbrevo/brevo";

let apiInstance = new TransactionalEmailsApi();

let apiKey = apiInstance["authentications"]["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const emailToSend = new SendSmtpEmail();

emailToSend.sender = { name: "Jae dev", email: "jaeladu1@gmail.com" };
emailToSend.replyTo = { email: "jaeladu1@gmail.com", name: "Jae recibe" };

type mailProps = {
   subject: string;
   text: string;
   recipientMail: string;
   recipientName: string;
};

export async function sendEmail(mailData: mailProps) {
   emailToSend.subject = mailData.subject;
   emailToSend.textContent = mailData.text;
   emailToSend.to = [
      { email: mailData.recipientMail, name: mailData.recipientName },
   ];

   const response = await apiInstance.sendTransacEmail(emailToSend);

   return response;
}
