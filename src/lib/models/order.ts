import { firestoreDB } from "../firestore";

const orderCollectionRef = firestoreDB.collection("orders");

export class Order {
   id: string;

   constructor(id: string) {
      this.id = id;
   }

   static async create(data: { productId: string }) {
      const response = await orderCollectionRef.add(data);
      return new Order(response.id);
   }
}
