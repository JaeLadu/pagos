import { Timestamp } from "firebase-admin/firestore";
import { firestoreDB } from "../firestore";

const authCollectionRef = firestoreDB.collection("auths");

type data = {
   userId: string;
   code: number;
   expires: Date;
   email: string;
};
export class Auth {
   id: string;
   data: data;

   constructor(id: string) {
      this.id = id;
   }

   getData() {
      return this.data;
   }

   static async findFromEmail(email: string) {
      try {
         const response = await authCollectionRef
            .where("email", "==", email)
            .get();
         if (response.docs[0].exists) {
            const auth = new Auth(response.docs[0].id);
            auth.update({
               ...response.docs[0].data(),
               //Firestore returns a Timestamp object, so it needs to be transformed to a Date object before saving it
               //and, to do that without error popping up it needs to be converted to unknown before that
               expires: (
                  response.docs[0].data().expires as unknown as Timestamp
               ).toDate(),
            } as data);

            return auth;
         }
         return false;
      } catch (error) {
         console.error(error);
         return false;
      }
   }

   static async createFromEmail(data: { email: string; userId?: string }) {
      try {
         const response = await authCollectionRef.add(data);
         const auth = new Auth(response.id);
         await auth.generateCode();

         return auth;
      } catch (error) {
         console.error(error);
         return false;
      }
   }

   update(data: data) {
      this.data = { ...data };
   }

   async push() {
      try {
         await authCollectionRef.doc(this.id).update(this.getData());
         return true;
      } catch (error) {
         console.error(error);
         return false;
      }
   }

   async generateCode() {
      try {
         const date = new Date();
         const code = Math.ceil(Math.random() * 10000);
         date.setMinutes(date.getMinutes() + 10);
         this.update({
            ...this.getData(),
            code,
            expires: date,
         });
         await this.push();
         return this.getData();
      } catch (error) {
         console.error(error);
         return false;
      }
   }
}
