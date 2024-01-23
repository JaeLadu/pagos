import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

export default reqVerbsHandler({
   post: {
      callback: (req: NextApiRequest, res: NextApiResponse) =>
         res.send("Hola test"),
   },
});
