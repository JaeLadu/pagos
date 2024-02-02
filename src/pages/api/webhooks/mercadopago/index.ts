import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "src/lib/middlewares";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { body } = req;
   const { resource } = body;
   if (resource) {
      await fetch(
         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/mercadopago/database-update`,
         {
            method: "POST",
            body: JSON.stringify(body),
         }
      );
   }
   res.status(200).end();
}
export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });
