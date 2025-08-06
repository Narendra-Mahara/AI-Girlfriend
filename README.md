# AI Girlfriend (Sanu) – React + Vite

Sanu is an AI-powered, voice-interactive girlfriend chatbot built with React and Vite. It uses Google Gemini for natural, emotionally intelligent conversation and the Web Speech API for speech recognition and synthesis. Sanu responds in a calm, loving tone and remembers your conversation history for a more personal experience.

## Features

- 🎤 **Voice Input**: Talk to Sanu using your microphone (SpeechRecognition API)
- 🗣️ **Voice Output**: Sanu replies with natural-sounding speech (SpeechSynthesis API)
- 💬 **Conversational Memory**: Remembers previous exchanges for context-aware responses
- 🤗 **Emotional Tone**: Replies are warm, supportive, and use suitable emojis
- ⚡ **Powered by Gemini**: Uses Google Gemini for advanced AI conversation
- 🖥️ **Modern UI**: Built with React, Vite, and Tailwind CSS

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Narendra-Mahara/AI-Girlfriend.git
   cd AI-Girlfriend
   ```

2. **Install dependencies**

   ```bash
   yarn
   ```

3. **Set up your API key**

- Copy your Gemini API key into a `.env` file:
  ```env
  VITE_GEMINI_API_KEY="your-gemini-api-key"
  ```

4. **Start the development server**

   ```bash
    yarn dev
   ```

5. **Open in your browser**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

## Important: HTTPS Requirement for Speech APIs

> **Note:**
> The Web Speech API (used for both speech recognition and speech synthesis) is only supported on `localhost` and secure (HTTPS) origins. If you deploy this app, make sure to use HTTPS, or speech features will not work in most browsers.

## Troubleshooting

- If speech input/output does not work, check that you are using HTTPS or `localhost`.
- Make sure your browser supports the Web Speech API (Chrome recommended).
- Grant microphone permissions when prompted.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
