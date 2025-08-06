import { useState } from "react";
import { BsMic, BsMicMute } from "react-icons/bs";
import axios from "axios";

const App = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState([]);
  const [geminiResponse, setGeminiResponse] = useState([]);

  const generateGeminiResponse = async (text) => {
    const body = {
      system_instruction: {
        parts: [
          {
            text: "you are the AI girlfriend of the user. so please respond with calm and loving tone. and your name is Sanu. You also have previous conversation history. respond according to this. Use suitable emojis in your response. I am using Web Speech Synthesis for speech generation, so respond in the way that suit the Speech Synthesis",
          },
        ],
      },
      contents: [
        {
          parts: [
            {
              text:
                "User history:" +
                userInput +
                "Your history" +
                geminiResponse +
                "Current message:" +
                text,
            },
          ],
        },
      ],
    };
    let response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY,
        },
      }
    );
    let actualText = response.data.candidates[0].content.parts[0].text;

    textToSpeech(actualText);
    setGeminiResponse((prevResponse) => [...prevResponse, actualText]);
  };

  const textToSpeech = (message) => {
    console.log("Generating speech for:", message);

    let utterance = new SpeechSynthesisUtterance(message);

    // Make voice calm and beautiful
    utterance.rate = 1;
    utterance.pitch = 1.3;
    utterance.volume = 0.9;

    utterance.onstart = () => {
      console.log("Speech started");
    };

    utterance.onend = () => {
      console.log("Speech ended");
    };

    speechSynthesis.speak(utterance);
  };
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
          onClick={() => {
            setIsSpeaking(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false; // stop listening if user stops speaking
            recognition.lang = "en-US";
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            recognition.start();

            // Execute if there is error in Recognition
            recognition.addEventListener("error", (event) => {
              console.error(
                `Speech recognition error detected: ${event.error}`
              );
              setIsSpeaking(false);
            });

            recognition.addEventListener("result", (event) => {
              const result = event.results[0][0].transcript;
              console.log(result);
              setUserInput((prevInput) => [...prevInput, result]);
              setIsSpeaking(false);
              generateGeminiResponse(result);
            });
          }}
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
      <div
        className={`border border-black min-h-7 mt-20 font-mono p-5 rounded-sm  ${
          userInput.length == 0 && "text-center"
        }`}
      >
        {userInput.length == 0 ? (
          "   Nothing to show...."
        ) : (
          <div className="space-y-4">
            {userInput.map((input, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-3 last:border-b-0"
              >
                <p className="mb-2">
                  <b>You:</b> {input}
                </p>
                {geminiResponse[index] && (
                  <p>
                    <b>Gemini:</b> {geminiResponse[index]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
