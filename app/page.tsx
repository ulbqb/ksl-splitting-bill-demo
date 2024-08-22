"use client";
import { Web3 } from "web3";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Form = () => {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "0";
  const web3 = new Web3();
  const prepareShareLink = async () => {
    try {
      const account = web3.eth.accounts.create();
      const resPromise = await fetch("/api/kaiawallet/api/v1/k/prepare", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          type: "send_klay",
          chain_id: "1001",
          bapp: {
            name: "KSL Splitting Bill Demo",
          },
          transaction: {
            to: account.address,
            amount: amount,
          },
        }),
      });
      const res = await resPromise.json();
      location.href = `kaikas://wallet/api?request_key=${res.request_key}`;
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <h1 className="text-3xl font-bold">{amount} KAIA</h1>
      <button
        type="button"
        className="bg-indigo-600 text-white text-bg leading-6 font-medium py-2 px-3 rounded-lg"
        onClick={prepareShareLink}
      >
        Generate Share Link
      </button>
    </>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div></div>
      <div></div>
      <h1 className="text-2xl font-bold">Transfer Amount</h1>
      <Suspense>
        <Form />
      </Suspense>
      <div></div>
      <div></div>
    </main>
  );
}
