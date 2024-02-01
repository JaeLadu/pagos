import MercadoPagoConfig, { Preference } from "mercadopago";
import { Product } from "./models/product";
import { Order } from "./models/order";
import { NextApiRequest, NextApiResponse } from "next";

const client = new MercadoPagoConfig({
   accessToken: process.env.MP_TEST_ACCESS_TOKEN!,
   options: { idempotencyKey: "dp;OWQEUIFB;oe4uifh23498" },
});

const preferencia = new Preference(client);

export async function createMPPreference(data: {
   orderId: string;
   productos: Product[];
}) {
   const response = await preferencia.create({
      body: {
         external_reference: data.orderId,
         items: data.productos,
         notification_url: process.env.NEXT_PUBLIC_MP_RESPONSE_HOOK,
      },
   });

   return response.init_point;
}
