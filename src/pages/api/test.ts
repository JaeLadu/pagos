import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "src/lib/middlewares";

export default reqVerbsHandler({
   post: {
      callback: (req: NextApiRequest, res: NextApiResponse) =>
         res.send("Hola test"),
   },
});
