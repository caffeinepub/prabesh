import { useCallback, useState } from "react";
import {
  grammarLessons,
  hiraganaRows,
  jlptLevels,
  kanjiList,
  katakanaRows,
  quizCategories,
  vocabulary,
} from "../data/japaneseData";

type Tab =
  | "hiragana"
  | "katakana"
  | "vocabulary"
  | "grammar"
  | "kanji"
  | "quiz"
  | "jlpt";

function speak(text: string, lang = "ja-JP") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function CharChart({
  rows,
  title,
}: {
  rows: { row: string; chars: { char: string; romaji: string }[] }[];
  title: string;
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.row}>
            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
              {row.row}
            </p>
            <div className="flex flex-wrap gap-2">
              {row.chars.map((c) => (
                <button
                  type="button"
                  key={c.char}
                  onClick={() => speak(c.romaji)}
                  className="w-16 h-16 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-teal-500 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all group"
                >
                  <span className="text-2xl text-white group-hover:text-teal-300 transition-colors">
                    {c.char}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-teal-400">
                    {c.romaji}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        Click any character to hear its pronunciation.
      </p>
    </div>
  );
}

function VocabularyTab() {
  const categories = Object.keys(vocabulary);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-teal-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid gap-2">
        {vocabulary[activeCategory].map((item) => (
          <div
            key={`${item.japanese}-${item.romaji}`}
            className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl text-white font-medium w-16">
                {item.japanese}
              </span>
              <div>
                <p className="text-sm text-slate-300">{item.romaji}</p>
                <p className="text-xs text-slate-500">{item.english}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speak(item.kana)}
              aria-label={`Pronounce ${item.english}`}
              className="w-8 h-8 rounded-full bg-slate-700 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition-all"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrammarTab() {
  const [openId, setOpenId] = useState<number | null>(1);
  const levels = ["N5", "N4", "N3"];
  return (
    <div className="space-y-4">
      {levels.map((level) => (
        <div key={level}>
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                level === "N5"
                  ? "bg-green-900 text-green-300"
                  : level === "N4"
                    ? "bg-blue-900 text-blue-300"
                    : "bg-purple-900 text-purple-300"
              }`}
            >
              {level}
            </span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>
          {grammarLessons
            .filter((l) => l.level === level)
            .map((lesson) => (
              <div key={lesson.id} className="mb-2">
                <button
                  type="button"
                  onClick={() =>
                    setOpenId(openId === lesson.id ? null : lesson.id)
                  }
                  className="w-full flex items-center justify-between bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 rounded-xl px-4 py-3 text-left transition-all"
                >
                  <span className="font-medium text-slate-200">
                    {lesson.title}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openId === lesson.id ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openId === lesson.id && (
                  <div className="mt-1 bg-slate-800/40 border border-slate-700/30 rounded-xl px-4 py-4">
                    <p className="text-slate-300 text-sm mb-3">
                      {lesson.explanation}
                    </p>
                    <div className="space-y-2">
                      {lesson.examples.map((ex) => (
                        <div
                          key={ex.japanese}
                          className="bg-slate-900/60 rounded-lg px-3 py-2"
                        >
                          <p className="text-white text-base">{ex.japanese}</p>
                          <p className="text-slate-400 text-sm">{ex.romaji}</p>
                          <p className="text-teal-400 text-sm">{ex.english}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

function KanjiTab() {
  const [selected, setSelected] = useState<(typeof kanjiList)[0] | null>(null);
  return (
    <div className="flex gap-6">
      <div className="flex flex-wrap gap-3 flex-1">
        {kanjiList.map((k) => (
          <button
            type="button"
            key={k.kanji}
            onClick={() => setSelected(k === selected ? null : k)}
            className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all ${
              selected?.kanji === k.kanji
                ? "bg-teal-600/20 border-teal-500 text-teal-300"
                : "bg-slate-800 border-slate-700 text-white hover:border-slate-500"
            }`}
          >
            <span className="text-2xl">{k.kanji}</span>
            <span className="text-xs text-slate-400">{k.level}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div className="w-64 bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex-shrink-0">
          <div className="text-center mb-4">
            <button
              type="button"
              onClick={() => speak(selected.kunyomi.split("\u30fb")[0])}
              className="text-7xl text-white hover:text-teal-300 transition-colors cursor-pointer bg-transparent border-none"
            >
              {selected.kanji}
            </button>
            <p className="text-teal-400 font-semibold mt-1">
              {selected.meaning}
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">On-yomi:</span>
              <span className="text-slate-200">{selected.onyomi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kun-yomi:</span>
              <span className="text-slate-200">{selected.kunyomi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Strokes:</span>
              <span className="text-slate-200">{selected.strokes}</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
              Examples
            </p>
            {selected.examples.map((ex) => (
              <div
                key={ex.word}
                className="bg-slate-900/60 rounded-lg px-2 py-1.5 mb-1"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white">{ex.word}</span>
                  <button
                    type="button"
                    onClick={() => speak(ex.reading)}
                    aria-label={`Pronounce ${ex.word}`}
                    className="text-teal-400 hover:text-teal-300 text-xs"
                  >
                    \uD83D\uDD0A
                  </button>
                </div>
                <p className="text-slate-400 text-xs">
                  {ex.reading} \u2013 {ex.meaning}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Click the kanji to hear it
          </p>
        </div>
      )}
    </div>
  );
}

function QuizTab() {
  const [categoryId, setCategoryId] = useState(quizCategories[0].id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [finished, setFinished] = useState(false);

  const category = quizCategories.find((c) => c.id === categoryId)!;
  const items = category.items;
  const current = items[currentIndex];
  const total = items.length;

  const startQuiz = useCallback((id: string) => {
    setCategoryId(id);
    setCurrentIndex(0);
    setFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
    setFinished(false);
  }, []);

  const answer = (correct: boolean) => {
    setScore((s) => ({
      ...s,
      [correct ? "correct" : "incorrect"]:
        s[correct ? "correct" : "incorrect"] + 1,
    }));
    if (currentIndex + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  const progress = ((score.correct + score.incorrect) / total) * 100;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {quizCategories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => startQuiz(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              categoryId === cat.id
                ? "bg-teal-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {finished ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            {score.correct >= total * 0.8
              ? "\uD83C\uDF89"
              : score.correct >= total * 0.5
                ? "\uD83D\uDC4D"
                : "\uD83D\uDCAA"}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
          <p className="text-slate-400 mb-4">
            {score.correct} / {total} correct (
            {Math.round((score.correct / total) * 100)}%)
          </p>
          <button
            type="button"
            onClick={() => startQuiz(categoryId)}
            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>
                {currentIndex + 1} / {total}
              </span>
              <span>
                \u2705 {score.correct} \u274C {score.incorrect}
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            className="cursor-pointer mx-auto max-w-sm w-full h-48 rounded-2xl border border-slate-600 bg-slate-800 hover:border-teal-500 flex flex-col items-center justify-center transition-all"
            onClick={() => setFlipped((f) => !f)}
          >
            {!flipped ? (
              <div className="text-center">
                <p className="text-6xl text-white mb-2">{current.question}</p>
                <p className="text-slate-500 text-sm">Click to reveal answer</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-3xl text-teal-300 font-semibold mb-1">
                  {current.answer}
                </p>
                <p className="text-slate-400 text-sm">{current.hint}</p>
              </div>
            )}
          </button>

          {flipped && (
            <div className="flex gap-4 justify-center mt-6">
              <button
                type="button"
                onClick={() => answer(false)}
                className="px-8 py-2.5 bg-red-900/50 hover:bg-red-800/60 border border-red-700 text-red-300 rounded-xl font-medium transition-all"
              >
                \u274C Incorrect
              </button>
              <button
                type="button"
                onClick={() => answer(true)}
                className="px-8 py-2.5 bg-green-900/50 hover:bg-green-800/60 border border-green-700 text-green-300 rounded-xl font-medium transition-all"
              >
                \u2705 Correct
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function JLPTTab() {
  const [selected, setSelected] = useState("N5");
  const level = jlptLevels.find((l) => l.level === selected)!;
  const colors: Record<string, string> = {
    N5: "teal",
    N4: "blue",
    N3: "purple",
    N2: "orange",
    N1: "red",
  };
  const colorMap: Record<string, string> = {
    teal: "bg-teal-600 border-teal-500",
    blue: "bg-blue-600 border-blue-500",
    purple: "bg-purple-600 border-purple-500",
    orange: "bg-orange-600 border-orange-500",
    red: "bg-red-600 border-red-500",
  };
  return (
    <div>
      <div className="flex gap-2 mb-6">
        {jlptLevels.map((l) => (
          <button
            type="button"
            key={l.level}
            onClick={() => setSelected(l.level)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
              selected === l.level
                ? `${colorMap[colors[l.level]]} text-white`
                : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            {l.level}
          </button>
        ))}
      </div>
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-2xl font-black px-3 py-1 rounded-lg ${
              colorMap[colors[level.level]]
            } text-white`}
          >
            {level.level}
          </span>
          <p className="text-slate-300">{level.description}</p>
        </div>
        <p className="text-teal-300 text-sm mb-4">{level.ability}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            ["Vocabulary", `${level.vocab} words`],
            ["Kanji", `${level.kanji} characters`],
            ["Grammar", `${level.grammar} points`],
            ["Study Hours", level.hours],
          ].map(([label, val]) => (
            <div
              key={label}
              className="bg-slate-900/60 rounded-xl p-3 text-center"
            >
              <p className="text-white font-bold text-lg">{val}</p>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
            Key Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {level.topics.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-slate-700/60 text-slate-300 rounded-full text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: "hiragana", label: "\u3072\u3089\u304C\u306A" },
  { id: "katakana", label: "\u30AB\u30BF\u30AB\u30CA" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "grammar", label: "Grammar" },
  { id: "kanji", label: "Kanji" },
  { id: "quiz", label: "Quizzes" },
  { id: "jlpt", label: "JLPT Guide" },
];

export default function JapaneseLearning() {
  const [activeTab, setActiveTab] = useState<Tab>("hiragana");
  return (
    <div className="flex flex-col h-full">
      <div className="flex overflow-x-auto border-b border-slate-700/50 px-6 gap-1 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === "hiragana" && (
          <CharChart
            rows={hiraganaRows}
            title="Hiragana \u3072\u3089\u304C\u306A"
          />
        )}
        {activeTab === "katakana" && (
          <CharChart
            rows={katakanaRows}
            title="Katakana \u30AB\u30BF\u30AB\u30CA"
          />
        )}
        {activeTab === "vocabulary" && <VocabularyTab />}
        {activeTab === "grammar" && <GrammarTab />}
        {activeTab === "kanji" && <KanjiTab />}
        {activeTab === "quiz" && <QuizTab />}
        {activeTab === "jlpt" && <JLPTTab />}
      </div>
    </div>
  );
}
