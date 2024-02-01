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

export async function syncPreference(
   req: NextApiRequest,
   res: NextApiResponse
) {
   const { id, topic } = req.query;
   if (topic == "merchant_order") {
      const response = await fetch(
         `https://api.mercadolibre.com/merchant_orders/${id}`,
         {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${process.env.MP_TEST_ACCESS_TOKEN}`,
            },
         }
      );
      const data = await response.json();
      const { external_reference, order_status } = data;
      const order = new Order(external_reference);
      await order.syncDataBase({ status: order_status });
   }
}
