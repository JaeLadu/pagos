import { NextApiRequest, NextApiResponse } from "next";
import { createMPPreference } from "src/lib/mercadopago";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";
import { Order } from "src/lib/models/order";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { productId } = req.query;
   if (typeof productId == "string") {
      const order = await Order.create({ productId });
      const redirectURL = await createMPPreference({
         orderId: order.id,
         productos: [{ ...req.body, id: productId }],
      });

      res.json(redirectURL);
   }
}

export default reqVerbsHandler({
   post: {
      middleWares: [checkToken],
      callback: handler,
   },
});
