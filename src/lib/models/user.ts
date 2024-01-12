import { firestoreDB } from "../firestore";

const userCollectionRef = firestoreDB.collection("users");

type data = {
   email: string;
   name?: string;
};
export class User {
   id: string;
   data: data;
   constructor(id: string) {
      this.id = id;
   }

   static async findOrCreateFromEmail(email: string) {
      const existingUserResponse = await userCollectionRef
         .where("email", "==", email)
         .get();
      if (!existingUserResponse.empty) {
         return new User(existingUserResponse.docs[0].id);
      }
      const newUserResponse = await userCollectionRef.add({ email });
      return new User(newUserResponse.id);
   }

   async syncWithDataBase() {
      const response = await userCollectionRef.doc(this.id).get();
      this.update(response.data() as data);
   }

   update(data: data) {
      this.data = { ...data };
   }
}
