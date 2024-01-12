import { NextApiRequest, NextApiResponse } from "next";
import { findOrCreateFromEmail } from "src/lib/controllers/auth-controller";
import { reqVerbsHandler } from "src/lib/middlewares";

export default reqVerbsHandler({
   post: {
      callback: (req: NextApiRequest, res: NextApiResponse) =>
         handler(req, res),
   },
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { email } = req.body;
   const response = await findOrCreateFromEmail(email);
   res.send(response);
}
