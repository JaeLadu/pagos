import { NextApiRequest, NextApiResponse } from "next";
import { createMPPreference } from "src/lib/mercadopago";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";
import { Order } from "src/lib/models/order";

async function handler(req, res) {
   const { query, body } = req;
   const { productIds } = query;
   const parsedProductIds = JSON.parse(productIds);

   if (Array.isArray(parsedProductIds)) {
      const order = await Order.create(JSON.parse(productIds)); //typescript problem, need to parse the productIds in here for it to not complain
      order.getData().items.forEach((item) => {
         item.quantity = body[item.id].quantity;
      });
      const redirectURL = await createMPPreference({
         orderId: order.id,
         productos: order.getData().items,
      });

      res.json(redirectURL);
   }
}

export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         middleWares: [checkToken],
         callback: handler,
      },
   });
