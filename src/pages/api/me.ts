import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { userData } = req.body;
   res.json(userData);
}
export default (req, res) =>
   reqVerbsHandler(req, res, {
      get: {
         middleWares: [checkToken],
         callback: handler,
      },
   });
