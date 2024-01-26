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
function handler(req, res) {
   const { query, body } = req;
   return res
      .status(200)
      .send(
         `test. method: ${req.method}, query: ${JSON.stringify(
            query
         )}, body: ${JSON.stringify(body)}`
      );
}

export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: handler,
         middleWares: middlewares,
      },
   });
