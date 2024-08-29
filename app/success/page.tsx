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

  const thanksToKakaoFriend = async () => {
    try {
      // @ts-ignore
      const _Kakao = Kakao;
      if (!_Kakao.isInitialized()) {
        _Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }
      _Kakao.Share.sendCustom({
        templateId: 111545,
        templateArgs: {},
      });
    } catch (e) {
      console.error(e);
    }
  };
  const thanksToLINEFriend = () => {
    location.href = `line://share?text=KAIA+has+been+received.+Thank+you+%3A%29`;
  };
  const thanksToTelegramFriend = () => {
    location.href = `tg://msg?text=KAIA+has+been+received.+Thank+you+%3A%29`;
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Your Balance is</h1>
        <br></br>
        <h1 className="text-3xl font-bold">{amount} KAIA</h1>
      </div>
      <div className="flex flex-col justify-between">
        <button
          type="button"
          className="w-64 h-14 bg-line text-white text-bg leading-6 font-medium py-2 px-3 rounded-lg inline-flex items-center mb-5"
          onClick={thanksToLINEFriend}
        >
          <svg
            className="ms-2 me-7"
            width="22"
            height="22"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ffffff"
              d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992zm-18.988-2.595c.129 0 .234.105.234.234v4.153h2.287c.129 0 .233.104.233.233v.842c0 .129-.104.234-.233.234h-3.363c-.063 0-.119-.025-.161-.065l-.001-.001-.002-.002-.001-.001-.003-.003c-.04-.042-.065-.099-.065-.161v-5.229c0-.129.104-.234.233-.234h.842zm14.992 0c.129 0 .233.105.233.234v.842c0 .129-.104.234-.233.234h-2.287v.883h2.287c.129 0 .233.105.233.234v.842c0 .129-.104.234-.233.234h-2.287v.884h2.287c.129 0 .233.105.233.233v.842c0 .129-.104.234-.233.234h-3.363c-.063 0-.12-.025-.162-.065l-.003-.004-.003-.003c-.04-.042-.066-.099-.066-.161v-5.229c0-.062.025-.119.065-.161l.004-.004.003-.003c.042-.04.099-.066.162-.066h3.363zm-10.442.001c.129 0 .234.104.234.233v5.229c0 .128-.105.233-.234.233h-.842c-.129 0-.234-.105-.234-.233v-5.229c0-.129.105-.233.234-.233h.842zm2.127 0h.008l.012.001.013.001.01.001.013.003.008.003.014.004.008.003.013.006.007.003.013.007.007.004.012.009.006.004.013.011.004.004.014.014.002.002.018.023 2.396 3.236v-3.106c0-.129.105-.233.234-.233h.841c.13 0 .234.104.234.233v5.229c0 .128-.104.233-.234.233h-.841l-.06-.008-.004-.001-.015-.005-.007-.003-.012-.004-.011-.006-.007-.003-.014-.009-.002-.002-.06-.058-2.399-3.24v3.106c0 .128-.104.233-.234.233h-.841c-.129 0-.234-.105-.234-.233v-5.229c0-.129.105-.233.234-.233h.841z"
            />
          </svg>
          Thanks with LINE
        </button>
        <button
          type="button"
          className="w-64 h-14 bg-kakao text-black text-bg leading-6 font-medium py-2 px-3 rounded-lg inline-flex items-center mb-5"
          onClick={thanksToKakaoFriend}
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
        <button
          type="button"
          className="w-64 h-14 bg-tg text-white text-bg leading-6 font-medium py-2 px-3 rounded-lg inline-flex items-center"
          onClick={thanksToTelegramFriend}
        >
          <svg
            className="ms-2 me-7"
            width="22"
            height="22"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlSpace="preserve"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="1.41421"
          >
            <path
              fill="#ffffff"
              d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z"
            />
          </svg>
          Thanks with Telegram
        </button>
      </div>
    </>
  );
};

export default function Success() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
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
