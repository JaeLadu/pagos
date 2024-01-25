import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

function handler(req: NextApiRequest, res: NextApiResponse) {
   res.status(200).send("test");
}
async function asincrona(req: NextApiRequest, res: NextApiResponse) {
   try {
      await fetch("https://serverles-api.vercel.app/api/search?busqueda=123");

      return handler(req, res);
   } catch (error) {
      res.status(error.status || 500).end(error.message);
   }
}

export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: asincrona,
         middleWares: [checkToken],
      },
   });
