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
        alert("An address is required in the query string.");
      }
      const accountBalance = await web3.eth.getBalance(address);
      const formatBalance = await web3.utils.fromWei(accountBalance, "ether");
      setAmount(formatBalance);
    };
    init();
  }, []);

  const shareThanksMessage = async () => {
    try {
      const content = {
        objectType: "text",
        text: "KAIA has been received. Thank you :)",
        link: {
          webUrl: "https://developers.kakao.com",
          mobileWebUrl: "https://ksl-splitting-bill-demo.vercel.app",
        },
        buttons: [
          {
            title: "Check Transaction",
            link: {
              webUrl: "https://developers.kakao.com",
              mobileWebUrl: "https://ksl-splitting-bill-demo.vercel.app",
            },
          },
        ],
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
      <div>
        <h1 className="text-2xl font-bold">Your Balance is</h1>
        <br></br>
        <h1 className="text-3xl font-bold">{amount} KAIA</h1>
      </div>
      <button
        type="button"
        className="w-64 h-14 bg-kakao text-black text-bg leading-6 font-medium py-2 px-3 rounded-lg inline-flex items-center"
        onClick={shareThanksMessage}
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
        Thanks with Kakao
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
