import { NextApiRequest, NextApiResponse } from "next";
import { findOrCreateFromEmail } from "src/lib/controllers/auth-controller";
import { reqVerbsHandler } from "src/lib/middlewares";

export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
      },
   });

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { email } = req.body;
   const response = await findOrCreateFromEmail(email);
   res.send(response);
}
