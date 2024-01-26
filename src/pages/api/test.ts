import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, filter, reqVerbsHandler } from "src/lib/middlewares";

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

export default (req, res) => filter(req, res, mockObj);
