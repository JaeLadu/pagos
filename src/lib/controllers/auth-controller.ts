import { sendEmail } from "../brevo";
import { createToken } from "../jwt";
import { Auth } from "../models/auth";
import { User } from "../models/user";

export async function findOrCreateFromEmail(email: string) {
   const auth = await Auth.findFromEmail(email);
   try {
      if (auth) {
         await auth.generateCode();
         await sendEmail({
            recipientMail: email,
            recipientName: "User Name",
            subject: "Login code",
            text: `Your code is ${
               auth.getData().code
            } and its available until ${auth.getData().expires.toTimeString()}`,
         });
         return auth;
      }
      const newUser = await User.findOrCreateFromEmail(email);
      const newAuth = await Auth.createFromEmail({ email, userId: newUser.id });
      if (newAuth) {
         await sendEmail({
            recipientMail: email,
            recipientName: "User Name",
            subject: "Login code",
            text: `Your code is ${
               newAuth.getData().code
            } and its available until ${newAuth
               .getData()
               .expires.toDateString()}`,
         });
      }
      return newAuth;
   } catch (error) {
      console.error(JSON.stringify(error));
      return false;
   }
}

export async function checkCodeAndEmail(data: { email: string; code: number }) {
   try {
      const auth = await Auth.findFromEmail(data.email);
      let userId: string = "";
      let codesMatch = false;
      let expired = true;

      if (auth && auth.getData().code) {
         expired = new Date() > auth.getData().expires;
         codesMatch = auth.getData().code == data.code;
         userId = auth.getData().userId;
      }
      if (!codesMatch) {
         throw new Error("Los códigos no coinciden");
      }

      if (expired) {
         throw new Error(`Código vencido`);
      }

      if (!userId) {
         throw new Error(`No hay user id`);
      }

      const token = createToken({ email: data.email, userId });

      return { token };
   } catch (error) {
      console.error(error);
      throw new Error(`Algo salió mail en checkCodeAndEmail. ${error.message}`);
   }
}
