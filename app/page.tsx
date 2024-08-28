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
      <h1 className="text-2xl font-bold">Payment Amount</h1>
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

  // WORK-AROUND: see https://github.com/ulbqb/ksl-splitting-bill-demo/pull/4
  const delegatedFee = 0.001;
  const plusFee = `${+amount + delegatedFee}`;

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
            name: "KSL Demo - Bill Splitter",
          },
          transaction: {
            to: account.address,
            amount: plusFee,
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
        className="w-64 h-14 bg-kaia text-black text-bg leading-6 font-medium py-2 px-3 rounded-lg inline-flex items-center"
        onClick={prepareShareLink}
      >
        <svg
          className="me-2"
          width="30"
          height="30"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M33.2745 33L44.2553 67.2515L45.317 63.943L35.397 33H39.0735L47.156 58.2101L48.2151 54.9015L41.196 33H44.8725L50.0541 49.166L55.2391 33H82L69.1748 73H42.414L42.4188 72.9871L29.598 33H33.2745ZM27.4755 33L40.3007 73H36.6242L23.799 33H27.4755ZM21.6765 33L34.5017 73H30.8252L18 33H21.6765Z"
            fill="black"
          />
        </svg>
        Deposit with Kaia Wallet
      </button>
    </>
  );
};

interface GeneratedProps {
  amount: string;
  privateKey: string;
}

function Generated(props: GeneratedProps) {
  const shareLink = `${window.location.protocol}//${
    window.location.host
  }/receive/?k=${base64url.encode(props.privateKey)}`;
  const sendToKakaoFriend = () => {
    const content = {
      objectType: "text",
      text: `I sent ${props.amount} KAIA.`,
      link: {
        mobileWebUrl: shareLink,
        webUrl: shareLink,
        androidExecutionParams: shareLink,
        iosExecutionParams: shareLink,
      },
      buttonTitle: "Receive KAIA",
    };
    // @ts-ignore
    const _Kakao = Kakao;
    if (!_Kakao.isInitialized()) {
      _Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
    _Kakao.Share.sendDefault(content);
  };
  const sendToLINEFriend = () => {
    const encodedMsg = encodeURIComponent(
      `I sent ${props.amount} KAIA.Please open the following link to receive KAIA.\n\n${shareLink}`
    );
    location.href = `line://share?text=${encodedMsg}`;
  };
  const sendToTelegramFriend = () => {
    const encodedMsg = encodeURIComponent(
      `I sent ${props.amount} KAIA.Please open the following link to receive KAIA.\n\n${shareLink}`
    );
    location.href = `tg://msg?text=${encodedMsg}`;
  };
  return (
    <>
      <div></div>
      <div></div>
      <h1 className="text-2xl font-bold">KAIA Transfer Link</h1>
      <h1 className="w-64 text-base font-medium truncate text-white/75">
        {shareLink}
      </h1>
      <div>
        <button
          type="button"
          className="w-64 h-14 bg-line text-white text-bg leading-6 font-medium py-2 px-3 rounded-lg inline-flex items-center mb-5"
          onClick={sendToLINEFriend}
        >
          <svg
            className="ms-2 me-7"
            width="22"
            height="22"
            viewBox="0 0 512 512"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"
            ></path>
          </svg>
          Send with LINE
        </button>
        <button
          type="button"
          className="w-64 h-14 bg-kakao text-black text-bg leading-6 font-medium py-2 px-3 rounded-lg inline-flex items-center mb-5"
          onClick={sendToKakaoFriend}
        >
          <svg
            className="ms-2 me-7"
            width="22"
            height="22"
            viewBox="0 0 512 512"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#000000"
              d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"
            ></path>
          </svg>
          Send with Kakao
        </button>
        <button
          type="button"
          className="w-64 h-14 bg-tg text-white text-bg leading-6 font-medium py-2 px-3 rounded-lg inline-flex items-center"
          onClick={sendToTelegramFriend}
        >
          <svg
            className="ms-2 me-7"
            width="22"
            height="22"
            viewBox="0 0 512 512"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              d="M255.5 48C299.345 48 339.897 56.5332 377.156 73.5996C414.415 90.666 443.871 113.873 465.522 143.22C487.174 172.566 498 204.577 498 239.252C498 273.926 487.174 305.982 465.522 335.42C443.871 364.857 414.46 388.109 377.291 405.175C340.122 422.241 299.525 430.775 255.5 430.775C241.607 430.775 227.262 429.781 212.467 427.795C148.233 472.402 114.042 494.977 109.892 495.518C107.907 496.241 106.012 496.15 104.208 495.248C103.486 494.706 102.945 493.983 102.584 493.08C102.223 492.177 102.043 491.365 102.043 490.642V489.559C103.126 482.515 111.335 453.169 126.672 401.518C91.8486 384.181 64.1974 361.2 43.7185 332.575C23.2395 303.951 13 272.843 13 239.252C13 204.577 23.8259 172.566 45.4777 143.22C67.1295 113.873 96.5849 90.666 133.844 73.5996C171.103 56.5332 211.655 48 255.5 48Z"
            ></path>
          </svg>
          Send with Telegram
        </button>
      </div>
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
