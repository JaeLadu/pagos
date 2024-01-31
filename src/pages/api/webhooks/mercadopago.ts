import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "src/lib/middlewares";
import { Order } from "src/lib/models/order";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { id, topic } = req.query;
   if (topic == "merchant_order") {
      const response = await fetch(
         `https://api.mercadolibre.com/merchant_orders/${id}`,
         {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${process.env.MP_TEST_ACCESS_TOKEN}`,
            },
         }
      );
      const data = await response.json();
      const { external_reference, order_status } = data;
      const order = new Order(external_reference);
      await order.syncLocal();
      order.setData({ status: order_status });
      await order.syncDataBase();
      res.status(200).end();
   }
}
export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });
