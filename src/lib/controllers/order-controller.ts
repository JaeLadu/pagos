import { getMerchantOrder } from "../mercadopago";
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
