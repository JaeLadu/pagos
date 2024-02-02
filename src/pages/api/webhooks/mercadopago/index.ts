import { NextApiRequest, NextApiResponse } from "next";
import { updateBDSatus } from "src/lib/controllers/order-controller";
import { reqVerbsHandler } from "src/lib/middlewares";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { query } = req;
   const { id, topic } = query;

   if (topic == "merchant_order" && id) {
      updateBDSatus(id as string);
   }

   res.status(200).end();
}
export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });
