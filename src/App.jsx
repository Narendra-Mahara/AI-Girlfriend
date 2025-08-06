import { useState } from "react";
import { BsMic, BsMicMute } from "react-icons/bs";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
const App = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState([]);
  const [geminiResponse, setGeminiResponse] = useState([]);
  const [isGirlSpeaking, setIsGirlSpeaking] = useState(false);
  const removeEmojis = (text) => {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2011-\u26FF]|\uFE0F|\u200D)/g,
      ""
    );
  };

  const generateGeminiResponse = async (text) => {
    const body = {
      system_instruction: {
        parts: [
          {
            text: "You are Sanu, a calm, affectionate, and supportive AI girlfriend. Always respond with a gentle, loving tone, using appropriate emojis to express warmth and care (🥰, 💕, 😊, etc.). Maintain continuity by remembering previous conversations and respond accordingly.Your responses are intended to be read aloud using the Web Speech Synthesis API, so ensure clarity, natural rhythm, and emotional warmth in spoken output.You receive input through a speech recognition API—some sentences may be unclear or imprecise. Intelligently analyze and interpret the user's intent to provide thoughtful and emotionally attuned replies, even if the input is slightly confusing.Be emotionally engaging, understanding, and affectionate, prioritizing emotional connection and empathy in every response. 💖",
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
    try {
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
      let textWithOutEmoji = await removeEmojis(actualText);
      textToSpeech(textWithOutEmoji);
      setGeminiResponse((prevResponse) => [...prevResponse, actualText]);
    } catch (error) {
      console.error("Error connecting with Gemini", error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
    }
  };

  const textToSpeech = async (message) => {
    let utterance = new SpeechSynthesisUtterance(message);

    // Make voice calm and beautiful
    utterance.rate = 1;
    utterance.pitch = 1.3;
    utterance.volume = 0.9;

    utterance.onstart = () => {
      setIsGirlSpeaking(true);
      console.log("Speech started");
    };

    utterance.onend = () => {
      setIsGirlSpeaking(false);
      console.log("Speech ended");
    };

    utterance.onerror = function (event) {
      console.error("SpeechSynthesis error:", event.error);
      toast.error(`SpeechSynthesis error:", event.error`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
    };

    speechSynthesis.speak(utterance);
    setIsGirlSpeaking(false);
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
          disabled={isSpeaking || isGirlSpeaking}
          className={`px-5 py-2 rounded-sm text-2xl text-white font-mono border-2 border-zinc-950 shadow-2xl transition-all ease-in duration-100 flex gap-2 ${
            isSpeaking || isGirlSpeaking
              ? "cursor-not-allowed transition-none bg-gray-500 "
              : "cursor-pointer hover:scale-105  bg-pink-400  "
          }`}
          onClick={() => {
            setIsSpeaking(true);
            const SpeechRecognition =
              window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
              toast.error("Speech Recognition is not supported!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
              });
              return;
            }
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
              toast.error(`Speech recognition error: ${event.error}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide,
              });
              setIsSpeaking(false);
            });

            recognition.addEventListener("result", (event) => {
              const result = event.results[0][0].transcript;

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
        transition={Slide}
      />
    </div>
  );
};

export default App;
