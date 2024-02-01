import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "src/lib/middlewares";

function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      const response = fetch(
         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/webhooks/mercadopago/database-update`,
         {
            method: "POST",
            body: JSON.stringify(req.body),
         }
      );
      console.log(response);
   } catch (error) {
      throw Error(`Falló index de mercado pago con el error: ${error.message}`);
   }
   res.status(200).end();
}
export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });
