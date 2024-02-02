import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "src/lib/middlewares";
import { Order } from "src/lib/models/order";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { resource } = JSON.parse(req.body);
   try {
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
      } else {
         throw new Error("Falló database-update");
      }
      return res.status(200).end("Ok");
   } catch (error) {
      console.log(error.message);

      throw new Error(error.message);
   }
}

export default (req: NextApiRequest, res: NextApiResponse) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });
