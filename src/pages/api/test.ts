import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

export default function (res: NextApiResponse) {
   res.status(200).send("test");
}
