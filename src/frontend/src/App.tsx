import { useState } from "react";
import JapaneseLearning from "./components/JapaneseLearning";
import VoiceChat from "./components/VoiceChat";

type Section = "chat" | "learn";

export default function App() {
  const [section, setSection] = useState<Section>("chat");

  return (
    <div className="min-h-screen bg-[#0E1114] text-white flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0E1114]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">\u3053</span>
            <span className="text-xl font-bold tracking-tight text-white">
              PRABESH
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSection("chat")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                section === "chat"
                  ? "bg-teal-600/20 text-teal-400 border border-teal-600/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              \uD83C\uDF99 Voice Chat
            </button>
            <button
              type="button"
              onClick={() => setSection("learn")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                section === "learn"
                  ? "bg-teal-600/20 text-teal-400 border border-teal-600/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              \uD83C\uDF93 Japanese Learning
            </button>
          </div>
        </div>
      </nav>

      {section === "chat" && (
        <div className="text-center py-10 px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-300 to-teal-500 bg-clip-text text-transparent mb-3">
            Master Japanese. Converse with AI.
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Speak, listen, and practice Japanese through AI voice chat and
            interactive lessons.
          </p>
        </div>
      )}

      {section === "learn" && (
        <div className="text-center py-8 px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-teal-300 to-teal-500 bg-clip-text text-transparent mb-2">
            Japanese Learning Hub
          </h1>
          <p className="text-slate-400">
            From N5 beginner to N1 advanced \u2014 all in one place.
          </p>
        </div>
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pb-8">
        {section === "chat" ? (
          <div
            className="bg-[#171D22] border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col"
            style={{ minHeight: "600px" }}
          >
            <VoiceChat />
          </div>
        ) : (
          <div
            className="bg-[#171D22] border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col"
            style={{ minHeight: "600px" }}
          >
            <JapaneseLearning />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-600">
        Prabesh &mdash; AI Voice Chat &amp; Japanese Learning &copy; 2026
      </footer>
    </div>
  );
}
