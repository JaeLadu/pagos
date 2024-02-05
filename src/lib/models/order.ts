import { firestoreDB } from "../firestore";
import { Product } from "./product";

const orderCollectionRef = firestoreDB.collection("orders");

type OrderData = {
   status: "paid" | "pending" | "rejected";
   items: Product[];
};

export class Order {
   id: string;
   data: OrderData;

   constructor(id: string, data?: Product[]) {
      this.id = id;
      if (data) {
         this.data = { items: data, status: "pending" };
      } else {
         this.data = {
            status: "pending",
            items: [],
         };
      }
   }

   static async testCreate() {
      await orderCollectionRef.add({ test: Math.random() });
   }

   static async create(data: [123 | 234]) {
      const fetchedProducts: Product[] = [];

      await Promise.all(
         data.map(async (id) => {
            const prod = await Product.create(id);
            fetchedProducts.push(Object.assign({}, prod)); //Needs to be converted to prod without class so Firestore can store it
         })
      );
      const MPPreference = await orderCollectionRef.add({
         items: fetchedProducts,
         status: "pending",
      });

      return new Order(MPPreference.id, fetchedProducts);
   }

   getData() {
      return { ...this.data, id: this.id };
   }

   setData(newData) {
      this.data = { ...this.data, ...newData };
   }

   async syncDataBase(data?) {
      const response = await orderCollectionRef
         .doc(this.id)
         .update(data || this.data);
      return response;
   }

   async syncLocal() {
      const preference = await orderCollectionRef.doc(this.id).get();
      this.setData(preference.data());
      return this.getData();
   }
}
