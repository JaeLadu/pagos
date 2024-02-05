import { NextApiRequest, NextApiResponse } from "next";
import {
   saveTestData,
   updateBDSatus,
   updateDBOrderStatusFromPayment,
} from "src/lib/controllers/order-controller";
import { reqVerbsHandler } from "src/lib/middlewares";
import { Order } from "src/lib/models/order";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { query } = req;
   const { id, topic } = query;

   await saveTestData(req);

   if (topic == "merchant_order" && id) {
      updateBDSatus(id as string);
   }
   if (topic == "payment" && id) {
      updateDBOrderStatusFromPayment(id as string);
   }

   res.status(200).end();
}
// export default (req, res) =>
//    reqVerbsHandler(req, res, {
//       post: {
//          callback: handler,
//       },
//    });

export default async function testHandler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   Order.testCreate();
   res.status(200).end();
}
