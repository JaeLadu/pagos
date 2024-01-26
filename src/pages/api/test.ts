import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

const mockObj = {
   post: {
      callback: filter,
   },
};

function filter(req, res) {
   const { query, body } = req;

   const requestMethod = req.method!.toLowerCase();
   const isMethodAllowed = mockObj[requestMethod];

   if (!isMethodAllowed) {
      res.status(405).end("Method not allowed");
      return;
   }
   return res
      .status(200)
      .send(
         `test. method: ${req.method}, query: ${JSON.stringify(
            query
         )}, body: ${JSON.stringify(body)}`
      );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
   return filter(req, res);
}
