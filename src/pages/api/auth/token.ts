import { NextApiRequest, NextApiResponse } from "next";
import { checkCodeAndEmail } from "src/lib/controllers/auth-controller";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { email, code } = req.body;

   try {
      const token = await checkCodeAndEmail({ email, code });
      res.json(token);
   } catch (error) {
      console.error(JSON.stringify(error));
      res.status(401).end(error.message);
   }
}

export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: (req: NextApiRequest, res: NextApiResponse) =>
            handler(req, res),
      },
   });
