"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Front() {
   const [redirectURL, setRedurectURL] = useState("");
   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

   async function handleSubmit() {
      const response = await fetch(
         `${backendUrl}/api/orders?productIds=[123, 234]`,
         {
            method: "POST",
            headers: {
               Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphZWxhZHUxQGdtYWlsLmNvbSIsInVzZXJJZCI6IkpMbEZ1UzVuYnVZZDJ0NXFHR3BnIiwiaWF0IjoxNzA0OTI2OTkyfQ._k7_ciEXX_e9haQ89kOTe2d6eAr4qNFYqI-J8J6Fi-o",
            },
            body: JSON.stringify({
               email: "jaeladu1@gmail.com",
               123: {
                  quantity: 1,
               },
               234: {
                  quantity: 2,
               },
            }),
         }
      );

      const url = await response.json();
      setRedurectURL(url);
   }
   async function handleTest() {
      const response = await fetch(`${backendUrl}/api/test`, {
         method: "POST",
      });

      const data = await response.json();
      console.log(data);
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
         <form
            onSubmit={async (e) => {
               e.preventDefault();
               await handleTest();
            }}
         >
            <button>Test</button>
         </form>
         {redirectURL && (
            <Link target="blank" href={redirectURL}>
               <button>Link para pagar</button>
            </Link>
         )}
      </div>
   );
}
