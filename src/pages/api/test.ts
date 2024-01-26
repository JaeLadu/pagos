import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

const middlewares = [
   (req, res) => {
      req.body = { ...req.body, middleOne: true };
      return { req, res };
   },
   (req, res) => {
      req.body = { ...req.body, middleTwo: true };
      return { req, res };
   },
   (req, res) => {
      req.body = { ...req.body, middleThree: true };
      return { req, res };
   },
];
const mockObj = {
   post: {
      callback: returnFun,
      middleWares: middlewares,
   },
};

function returnFun(req, res) {
   const { query, body } = req;
   return res
      .status(200)
      .send(
         `test. method: ${req.method}, query: ${JSON.stringify(
            query
         )}, body: ${JSON.stringify(body)}`
      );
}

function mockFun(req, res) {
   res.status(200).end("Mock");
}
function filter(req, res, verbsObj) {
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

export default (req, res) => filter(req, res, mockObj);
