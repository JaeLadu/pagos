import { NextApiRequest, NextApiResponse } from "next";
import { checkToken, reqVerbsHandler } from "src/lib/middlewares";

// const mockObj = {
//    post: {
//       callback: mockFun,
//    },
// };

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
// function filter(verbsObj, req, res) {
//    const requestMethod = req.method!.toLowerCase();
//    const isMethodAllowed = mockObj[requestMethod];

//    if (!isMethodAllowed) {
//       res.status(405).end("Method not allowed");
//       return;
//    }

//    const callback: Function = verbsObj[requestMethod].callback;

//    callback(req, res);
// }

export default (req, res) =>
   reqVerbsHandler(req, res, {
      post: {
         callback: returnFun,
         middleWares: [checkToken],
      },
   });
