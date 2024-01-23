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

export function reqVerbsHandler(verbsObj: verbsObj) {
   return async function finalFunction(
      req: NextApiRequest,
      res: NextApiResponse
   ): Promise<Function> {
      const requestMethod = req.method!.toLowerCase();
      const isMethodAllowed = Object.hasOwn(verbsObj, requestMethod);

      if (!isMethodAllowed) {
         res.status(405).send("Method not allowed");
      }

      const callback: Function = verbsObj[requestMethod].callback;
      const middleWares: Function[] | Promise<Function>[] =
         verbsObj[requestMethod].middleWares;

      const corsResponse = cors(req, res);

      req = corsResponse.req;
      res = corsResponse.res;

      if (middleWares?.length) {
         await Promise.all(
            middleWares.map(async (middleWare) => {
               const response = await middleWare(req, res);

               if (response) {
                  req = response.req;
                  res = response.res;
               }
            })
         );
      }
      return callback(req, res);
   };
}

export async function checkToken(req: NextApiRequest, res: NextApiResponse) {
   const token = req.headers.authorization?.split(" ")[1];
   const { email } = req.body;
   try {
      if (!token) {
         throw Error(
            JSON.stringify({
               message: "Token missing",
               status: 401,
            })
         );
      }

      if (!email) {
         throw Error(
            JSON.stringify({
               message: "Email missing",
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
      res.status(401).send(`Wrong token. ${error}`);
   }
}

function cors(
   req: NextApiRequest,
   res: NextApiResponse
): { req: NextApiRequest; res: NextApiResponse } {
   res.setHeader("Access-Control-Allow-Credentials", "true");
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
   );
   res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
   );
   if (req.method === "OPTIONS") {
      res.status(200).end();
   }
   return { req, res };
}
