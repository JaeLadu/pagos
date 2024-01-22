import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./jwt";
import { User } from "./models/user";
import cors from "cors";

type verbsObj = {
   get?: {
      callback: Function;
      middleWares?: Function[];
   };
   post?: {
      callback: Function;
      middleWares?: Function[];
   };
};

export function reqVerbsHandler(verbsObj: verbsObj) {
   return async function finalFunction(
      req: NextApiRequest,
      res: NextApiResponse
   ): Promise<Function> {
      const requestMethod = req.method!.toLowerCase();
      const isMethodAllowed = verbsObj[requestMethod];

      console.log(requestMethod);
      console.log(isMethodAllowed);

      if (!isMethodAllowed) {
         res.status(405).send("Method not allowed");
      }

      const callback: Function = verbsObj[requestMethod].callback;
      const middleWares: Function[] | Promise<Function>[] =
         verbsObj[requestMethod].middleWares;

      if (middleWares?.length) {
         await Promise.all(
            middleWares.map(async (middleWare) => {
               const response = await middleWare(req, res);
               req = response.req;
               res = response.res;
            })
         );
      }
      return callback(req, res);
   };
}

export async function checkToken(req: NextApiRequest, res: NextApiResponse) {
   const token = req.headers.authorization?.split(" ")[1];
   req.body = JSON.parse(req.body);
   const { email } = req.body;

   if (!token) res.status(401).send("Token missing");
   if (!email) res.status(401).send("Email missing");

   try {
      if (token) {
         const tokenData = verifyToken(token);

         const user = new User(tokenData["userId"]);
         await user.syncWithDataBase();

         req.body.userData = user.data;

         return { req, res };
      }
   } catch (error) {
      console.error(error);
      res.status(401).send(`Wrong token. ${error}`);
   }
}
