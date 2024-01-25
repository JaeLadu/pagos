import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
   const { method, query, body } = req;
   res.status(200).send(
      `test. method: ${method}, query: ${JSON.stringify(
         query
      )}, body: ${JSON.stringify(body)}`
   );
}
