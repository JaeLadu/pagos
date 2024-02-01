import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "src/lib/middlewares";
import { Order } from "src/lib/models/order";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { resource } = req.body;
   if (resource) {
      const response = await fetch(`${resource}`, {
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MP_TEST_ACCESS_TOKEN}`,
         },
      });
      const data = await response.json();
      const { external_reference, order_status } = data;
      const order = new Order(external_reference);
      await order.syncDataBase({ status: order_status });
   }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });
