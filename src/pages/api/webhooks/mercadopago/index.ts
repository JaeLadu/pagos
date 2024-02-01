import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "src/lib/middlewares";

function handler(req: NextApiRequest, res: NextApiResponse) {
   fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/mercadopago/database-update`,
      {
         method: "POST",
         body: JSON.stringify(req.body),
      }
   );
   res.status(200).end();
}
export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });
