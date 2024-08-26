"use client";
import { Web3 } from "web3";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Form = () => {
  const [amount, setAmount] = useState("0");
  const searchParams = useSearchParams();
  const address = searchParams.get("address") || "";
  const web3 = new Web3("https://public-en-baobab.klaytn.net"); //https://docs.klaytn.foundation/docs/build/tutorials/connecting-metamask/#connect-to-klaytn-baobab-network-testnet-
  
  useEffect(() => {
    const init = async () => {
      if (address == "") {
        alert("An address is required in the query string.")
      }
      const accountBalance = await web3.eth.getBalance(address)
      const formatBalance = await web3.utils.fromWei(accountBalance, "ether");
      setAmount(formatBalance)
    }
    init()
  }, [])

  const shareThanksMessage = async () => {
    try {
      const content = {
        objectType: "text",
        text: "The asset has been received. Thank you :)",
        link: {}
      };
      // @ts-ignore
      const _Kakao = Kakao;
      if (!_Kakao.isInitialized()) {
        _Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }
      _Kakao.Share.sendDefault(content);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Your balance is {amount} KAIA</h1>
      <button
        type="button"
        className="bg-indigo-600 text-white text-bg leading-6 font-medium py-2 px-3 rounded-lg"
        onClick={shareThanksMessage}
      >
        Send thanks
      </button>
    </>
  );
};

export default function Success() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div></div>
        <div></div>
        <h1 className="text-2xl font-bold">Success</h1>
        <Suspense>
          <Form />
        </Suspense>
        <div></div>
        <div></div>
      </main>
    );
  }
