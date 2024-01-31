import { firestoreDB } from "../firestore";

const productCollectionRef = firestoreDB.collection("products");

export class Product {
   id: string;
   title: string;
   quantity: number;
   unit_price: number;
   description?: string;
   pictureUrl?: string;

   constructor(id: string) {
      this.id = id;
   }

   update(data: { [key: string]: any }) {
      for (const key in data) {
         this[key] = data[key];
      }
   }

   static async create(id: 123 | 234) {
      const DBProduct = await productCollectionRef.doc(id.toString()).get();
      const product = new Product(DBProduct.id);
      product.update(DBProduct.data()!);
      return product;
   }
}
