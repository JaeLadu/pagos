import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./jwt";
import { User } from "./models/user";

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

export function reqVerbsHandler(
   req: NextApiRequest,
   res: NextApiResponse,
   verbsObj: verbsObj
) {
   const requestMethod = req.method!.toLowerCase();
   const isMethodAllowed = verbsObj[requestMethod];

   if (!isMethodAllowed) {
      res.status(405).end("Method not allowed");
      return;
   }

   const callback: Function = verbsObj[requestMethod].callback;
   const middleWares: Function[] | Promise<Function>[] =
      verbsObj[requestMethod].middleWares;

   if (middleWares) {
      middleWares.forEach(async (m) => {
         try {
            const response = await m(req, res);
            req = response.req;
            res = response.res;
         } catch (error) {
            console.log(error.message);
            return;
         }
      });
   }

   callback(req, res);
}

export async function checkToken(req: NextApiRequest, res: NextApiResponse) {
   const token = req.headers.authorization?.split(" ")[1];
   const { email } = req.body;
   try {
      if (!token) {
         throw Error(
            JSON.stringify({
               error: "Token missing",
               status: 401,
            })
         );
      }

      if (!email) {
         throw Error(
            JSON.stringify({
               error: "Email missing",
               status: 401,
            })
         );
      }

      if (token) {
         const tokenData = verifyToken(token);

         const user = new User(tokenData["userId"]);
         await user.syncWithDataBase();

         req.body.userData = user.data;

         return { req, res };
      }
   } catch (error) {
      console.error(error);
      return error;
   }
}
