import {
   getMerchantOrder,
   getPayment,
   searchMerchantOrder,
} from "../mercadopago";
import { Order } from "../models/order";

export async function updateBDSatus(id: string) {
   try {
      const MPOrder = await getMerchantOrder({ merchantOrderId: id });
      const { external_reference, order_status } = MPOrder;
      const order = new Order(external_reference!);
      await order.syncDataBase({ status: order_status });
   } catch (error) {
      console.log(error.message);

      throw new Error(error.message);
   }
}

export async function updateDBOrderStatusFromPayment(id: string) {
   try {
      const orders = await pullOrderDataFromPayment(id);
      if (orders) {
         const { order_status, external_reference } = orders[0];
         const order = new Order(external_reference!);
         return await order.syncDataBase({ status: order_status });
      }
   } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
   }
}

async function pullOrderDataFromPayment(id: string) {
   const payment = await getPayment({ id });
   const { external_reference } = payment;
   const orders = await searchMerchantOrder({
      external_reference,
   });
   return orders.elements;
}

export async function saveTestData(req) {
   const order = await Order.create([123]);
   order.syncDataBase({ body: req.body, query: req.query });
}
