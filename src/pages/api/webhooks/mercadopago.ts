import { NextApiRequest, NextApiResponse } from "next";
import { syncPreference } from "src/lib/mercadopago";
import { reqVerbsHandler } from "src/lib/middlewares";

function handler(req: NextApiRequest, res: NextApiResponse) {
   syncPreference(req, res);
   res.status(200).end();
}
export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });
