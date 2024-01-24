import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

function handler(req: NextApiRequest, res: NextApiResponse) {
   res.status(200).send("test");
}

export default function middle(req: NextApiRequest, res: NextApiResponse) {
   return async function asincrona(req: NextApiRequest, res: NextApiResponse) {
      await fetch("https://serverles-api.vercel.app/api/search?busqueda=123");

      return handler(req, res);
   };
}
