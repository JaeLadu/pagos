import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

function handler(req: NextApiRequest, res: NextApiResponse) {
   res.status(200).send("test");
}

export default function middle(req: NextApiRequest, res: NextApiResponse) {
   return handler(req, res);
}
