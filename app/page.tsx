"use client";
import { Web3 } from "web3";
import { useSearchParams } from "next/navigation";
import { Suspense, Dispatch, SetStateAction, useState } from "react";
import base64url from "base64url";

interface PrepareProps {
  setPageState: Dispatch<SetStateAction<string>>;
  setAmount: Dispatch<SetStateAction<string>>;
  setPrivateKey: Dispatch<SetStateAction<string>>;
}

function Prepare(props: PrepareProps) {
  return (
    <>
      <div></div>
      <div></div>
      <h1 className="text-2xl font-bold">Transfer Amount</h1>
      <Suspense>
        <Form
          setPageState={props.setPageState}
          setAmount={props.setAmount}
          setPrivateKey={props.setPrivateKey}
        />
      </Suspense>
      <div></div>
      <div></div>
    </>
  );
}

const Form = (props: PrepareProps) => {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "0";
  props.setAmount(amount);
  const web3 = new Web3();
  const prepareShareLink = async () => {
    try {
      const account = web3.eth.accounts.create();
      props.setPrivateKey(account.privateKey);
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
      props.setPageState("generated");
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

interface GeneratedProps {
  amount: string;
  privateKey: string;
}

function Generated(props: GeneratedProps) {
  const sendToFriend = () => {
    const shareLink = `${window.location.protocol}//${
      window.location.host
    }/receive/?k=${base64url.encode(props.privateKey)}`;
    const content = {
      objectType: "text",
      text: `I transfered ${props.amount}KAIA.`,
      link: {
        mobileWebUrl: shareLink,
        webUrl: shareLink,
        androidExecutionParams: shareLink,
        iosExecutionParams: shareLink,
      },
      buttonTitle: "Receive token",
    };
    // @ts-ignore
    const _Kakao = Kakao;
    if (!_Kakao.isInitialized()) {
      _Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
    _Kakao.Share.sendDefault(content);
  };
  return (
    <>
      <div></div>
      <div></div>
      <h1 className="text-2xl font-bold">Generated share link</h1>
      <div></div>
      <button
        type="button"
        className="bg-yellow-400 text-black text-bg leading-6 font-medium py-2 px-3 rounded-lg"
        onClick={sendToFriend}
      >
        Send to friend
      </button>
      <div></div>
      <div></div>
    </>
  );
}

export default function Home() {
  const [pageState, setPageState] = useState("prepare"); // parepare, generated
  const [amount, setAmount] = useState("0");
  const [privateKey, setPrivateKey] = useState("");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {pageState === "prepare" && (
        <Prepare
          setPageState={setPageState}
          setAmount={setAmount}
          setPrivateKey={setPrivateKey}
        />
      )}
      {pageState === "generated" && (
        <Generated amount={amount} privateKey={privateKey} />
      )}
    </main>
  );
}
