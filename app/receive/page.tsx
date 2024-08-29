"use client";
import { Web3 } from "web3";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, Dispatch, SetStateAction, useState } from "react";
import base64url from "base64url";

interface FromProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const Form = (props: FromProps) => {
  const [actualAddress, setActualAddress] = useState("");
  const searchParams = useSearchParams();
  const encodedTmpPrivateKey = searchParams.get("k") || "";
  const web3 = new Web3("https://public-en-baobab.klaytn.net"); //https://docs.klaytn.foundation/docs/build/tutorials/connecting-metamask/#connect-to-klaytn-baobab-network-testnet-
  const router = useRouter();

  const transferToActualAddress = async () => {
    props.setIsLoading(true);
    try {
      if (encodedTmpPrivateKey == "") {
        throw Error("Can't get temp key from url");
      }
      const tmpPrivateKey = base64url.decode(encodedTmpPrivateKey);
      const tmpAccount = web3.eth.accounts.wallet.add(tmpPrivateKey)[0];
      const tmpAccountBalance = await web3.eth.getBalance(tmpAccount.address);

      // calculate gas cost & max remittance value
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = BigInt(21000); // https://docs.klaytn.foundation/docs/learn/transaction-fees/intrinsic-gas/#txtypedgas-
      const remittanceValue = tmpAccountBalance - BigInt(1000000000000000); // WORK-AROUND: see https://github.com/ulbqb/ksl-splitting-bill-demo/pull/4

      await web3.eth.sendTransaction({
        from: tmpAccount.address,
        to: actualAddress,
        value: remittanceValue,
        gas: gasLimit,
        gasPrice: gasPrice,
      });
      router.push(`/success?address=${actualAddress}`);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setActualAddress(e.target.value);
  };

  return (
    <>
      <form>
        <input
          type="text"
          className="block py-2.5 px-0 w-64 text-bg text-white bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-white"
          name="address"
          placeholder="0x01234..."
          value={actualAddress}
          onChange={handleChange}
        />
      </form>
      <button
        type="button"
        className="w-64 h-14 bg-kaia text-black text-bg leading-6 font-medium py-2 px-3 rounded-lg"
        onClick={transferToActualAddress}
      >
        Receive KAIA
      </button>
    </>
  );
};

export default function Receive() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      {isLoading && (
        <div className="absolute bg-black bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
          <div className="flex items-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-kaia"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
      <main className="flex min-h-screen flex-col items-center justify-between p-12">
        <div></div>
        <div></div>
        <h1 className="text-2xl font-bold">Input Your Address</h1>
        <Suspense>
          <Form setIsLoading={setIsLoading} />
        </Suspense>
        <div></div>
        <div></div>
      </main>
    </>
  );
}
