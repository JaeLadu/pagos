"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Front() {
   const mockReqData = {
      title: "Mock product",
      quantity: 2,
      unit_price: 1250,
   };
   const [redirectURL, setRedurectURL] = useState("");

   async function handleSubmit() {
      const response = await fetch(
         `${process.env.BACKEND_URL}/api/orders?productId=1234`,
         {
            method: "POST",
            headers: {
               Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphZWxhZHUxQGdtYWlsLmNvbSIsInVzZXJJZCI6IkpMbEZ1UzVuYnVZZDJ0NXFHR3BnIiwiaWF0IjoxNzA0OTI2OTkyfQ._k7_ciEXX_e9haQ89kOTe2d6eAr4qNFYqI-J8J6Fi-o",
            },
            body: JSON.stringify({
               ...mockReqData,
               email: "jaeladu1@gmail.com",
            }),
         }
      );

      const url = await response.json();
      setRedurectURL(url);
   }

   return (
      <div>
         <form
            onSubmit={async (e) => {
               e.preventDefault();
               await handleSubmit();
            }}
         >
            <button>Pagar con mercado</button>
         </form>
         {redirectURL && (
            <Link target="blank" href={redirectURL}>
               <button>Link para pagar</button>
            </Link>
         )}
      </div>
   );
}
