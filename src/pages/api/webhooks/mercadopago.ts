import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "src/lib/middlewares";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { id, topic } = req.query;
   if (topic == "merchant_order") {
      const response = await fetch(
         `https://api.mercadopago.com/checkout/preferences/${id}`,
         {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${process.env.MP_TEST_ACCESS_TOKEN}`,
            },
         }
      );
      const data = await response.json();
      console.log(data);
   }
}
export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });
