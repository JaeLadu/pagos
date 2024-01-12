import { NextApiRequest, NextApiResponse } from "next";
import { reqVerbsHandler } from "src/lib/middlewares";

export default reqVerbsHandler({
   get: {
      callback: (req: NextApiRequest, res: NextApiResponse) =>
         res.send("Hola test"),
   },
});
