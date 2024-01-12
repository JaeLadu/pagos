import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
   accessToken: process.env.MP_TEST_ACCESS_TOKEN!,
   options: { idempotencyKey: "dp;OWQEUIFB;oe4uifh23498" },
});

const preferencia = new Preference(client);

type product = {
   id: string;
   title: string;
   quantity: number;
   unit_price: number;
   description?: string;
   picture_url?: string;
};

export async function createMPPreference(data: {
   orderId: string;
   productos: product[];
}) {
   const response = await preferencia.create({
      body: {
         external_reference: data.orderId,
         items: data.productos,
         notification_url: process.env.MP_RESPONSE_HOOK,
      },
   });

   return response.init_point;
}
