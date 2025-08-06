import { useState } from "react";
import { BsMic, BsMicMute } from "react-icons/bs";

const App = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <div className="min-h-svh p-5 flex flex-col gap-5">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      <header className="text-center  sm:text-left">
        <h1 className="font-mono text-3xl sm:text-4xl font-semibold">
          Your AI Girlfriend..
        </h1>
      </header>

      <div className="flex justify-center mt-32 sm:mt-20">
        <button
          className={`px-5 py-2 bg-pink-400 rounded-sm text-2xl text-white font-mono border-2 border-zinc-950 shadow-2xl transition-all ease-in duration-100 flex gap-2 ${
            isSpeaking
              ? "cursor-not-allowed transition-none hover:bg-gray-500 "
              : "cursor-pointer hover:scale-105 "
          }`}
        >
          {isSpeaking ? (
            <>
              <BsMicMute />
              Listening..
            </>
          ) : (
            <>
              <BsMic /> Talk..
            </>
          )}
        </button>
      </div>

      <div className="border border-black min-h-7 mt-20 font-mono p-5 rounded-sm text-center">
        Nothing to show..
      </div>
    </div>
  );
};

export default App;
