import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

const SESSION_ID = `prabesh-${Math.random().toString(36).slice(2)}`;

type SpeechRecognitionType = {
  lang: string;
  interimResults: boolean;
  onresult:
    | ((e: { results: { [0]: { [0]: { transcript: string } } } }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionType;
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
  }
}

export default function VoiceChat() {
  const { actor } = useActor();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "ai",
      text: "\u3053\u3093\u306b\u3061\u306f\uff01 I'm Airi, your AI language companion. You can speak to me or type below. Try asking me to practice Japanese with you!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"en-US" | "ja-JP">("en-US");
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: bottomRef is a stable ref
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [language],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !actor) return;
      setError("");
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);
      try {
        const result = await actor.sendMessage(SESSION_ID, text);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: result.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        speak(result.response);
      } catch {
        setError("Could not reach AI. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [actor, speak],
  );

  const toggleListening = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setError("Speech recognition error. Please try again.");
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, language, sendMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <h2 className="font-semibold text-white">Airi</h2>
            <p className="text-xs text-slate-400">
              {isListening
                ? "\uD83C\uDF99 Listening..."
                : isSpeaking
                  ? "\uD83D\uDD0A Speaking..."
                  : "AI Voice Assistant"}
            </p>
          </div>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en-US" | "ja-JP")}
          className="bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500"
        >
          <option value="en-US">\uD83C\uDDFA\uD83C\uDDF8 English</option>
          <option value="ja-JP">\uD83C\uDDEF\uD83C\uDDF5 Japanese</option>
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                msg.role === "ai"
                  ? "bg-gradient-to-br from-teal-400 to-teal-600 text-white"
                  : "bg-slate-600 text-slate-200"
              }`}
            >
              {msg.role === "ai" ? "A" : "U"}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === "ai"
                  ? "bg-slate-700/80 text-slate-100 rounded-tl-sm"
                  : "bg-teal-600/80 text-white rounded-tr-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className="text-xs mt-1 opacity-50">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="bg-slate-700/80 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Mic button */}
      <div className="flex justify-center py-4">
        <button
          type="button"
          onClick={toggleListening}
          aria-label={isListening ? "Stop listening" : "Start listening"}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening
              ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] scale-110"
              : "bg-gradient-to-br from-teal-400 to-teal-600 shadow-[0_0_20px_rgba(45,214,198,0.4)] hover:shadow-[0_0_30px_rgba(45,214,198,0.6)] hover:scale-105"
          }`}
        >
          {isListening ? (
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V22H8v2h8v-2h-3v-1.06A9 9 0 0 0 21 12v-2h-2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Input */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Type your message or tap the microphone..."
            className="flex-1 bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading || !actor}
            aria-label="Send message"
            className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-xl px-4 py-3 transition-colors"
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
