import { useState, useEffect } from "react";
import { fetchJoke } from "../services/Jokeservice";
import { fetchHeartPuzzle } from "../services/heartService";

const HeartModal = ({ onSubmit }) => {
  const [answer, setAnswer] = useState("");
  const [joke, setJoke] = useState(null);
  const [showDelivery, setShowDelivery] = useState(false);
  const [jokeLoading, setJokeLoading] = useState(true);
  const [shakeError, setShakeError] = useState(false);
  const [puzzle, setPuzzle] = useState(null);
  const [puzzleLoading, setPuzzleLoading] = useState(true);
  const [puzzleError, setPuzzleError] = useState(false);

  const loadAll = async () => {
    setPuzzleLoading(true);
    setPuzzleError(false);
    setJokeLoading(true);
    setShowDelivery(false);
    setAnswer("");

    const [puzzleResult, jokeResult] = await Promise.allSettled([
      fetchHeartPuzzle(),
      fetchJoke(),
    ]);

    if (puzzleResult.status === "fulfilled" && puzzleResult.value?.question) {
      setPuzzle(puzzleResult.value);
      setPuzzleError(false);
    } else {
      setPuzzle(null);
      setPuzzleError(true);
    }
    setPuzzleLoading(false);

    if (jokeResult.status === "fulfilled" && jokeResult.value) {
      setJoke(jokeResult.value);
      if (jokeResult.value.type === "single") setShowDelivery(true);
    }
    setJokeLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSubmit = () => {
    if (!answer.trim()) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }
    onSubmit(answer, puzzle);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const busy = puzzleLoading || puzzleError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <style>{css}</style>
      <div className="relative w-full max-w-sm rounded-sm border border-slate-700/60 bg-slate-900 p-6 shadow-2xl"
        style={{ borderTop: "2px solid #ec4899", animation: "fadeSlideUp 0.25s ease both" }}>

        {/* Scanlines */}
        <div className="pointer-events-none absolute inset-0 z-0"
          style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(236,72,153,0.015) 2px,rgba(236,72,153,0.015) 4px)" }} />

        {/* Header */}
        <div className="relative z-10 mb-5 flex items-center justify-center gap-3">
          <span className="text-pink-400" style={{ animation: "heartbeat 1.2s ease-in-out infinite", textShadow: "0 0 10px #ec489988" }}>♥</span>
          <h2 className="text-xs font-bold tracking-[3px] text-pink-400" style={{ fontFamily: "'Orbitron', monospace", textShadow: "0 0 14px #ec489955" }}>
            SOLVE TO CONTINUE
          </h2>
          <span className="text-pink-400" style={{ animation: "heartbeat 1.2s ease-in-out infinite", textShadow: "0 0 10px #ec489988" }}>♥</span>
        </div>

        {/* Puzzle Image */}
        <div className="relative z-10 mb-2 min-h-[90px] border border-slate-700/50 bg-slate-950 p-3">
          {/* Corner accents */}
          <span className="absolute -left-px -top-px h-2.5 w-2.5 border-l-2 border-t-2 border-pink-500" />
          <span className="absolute -right-px -top-px h-2.5 w-2.5 border-r-2 border-t-2 border-pink-500" />
          <span className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 border-pink-500" />
          <span className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-pink-500" />

          {puzzleLoading && (
            <div className="flex min-h-[80px] flex-col items-center justify-center gap-3">
              <div className="flex gap-1.5">
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} className="inline-block h-2 w-2 rounded-full bg-pink-500"
                    style={{ animation: `pulseDot 1.2s ease-in-out ${d}s infinite` }} />
                ))}
              </div>
              <span className="text-[10px] tracking-[2px] text-slate-600">fetching puzzle...</span>
            </div>
          )}

          {!puzzleLoading && puzzleError && (
            <div className="flex min-h-[80px] flex-col items-center justify-center gap-2.5">
              <span className="text-[11px] tracking-wide text-red-500">⚠ Could not reach Heart API</span>
              <button onClick={loadAll}
                className="rounded-sm border border-red-500/40 px-3 py-1 text-[10px] tracking-widest text-red-500 transition hover:border-red-500/80"
                style={{ fontFamily: "'Share Tech Mono', monospace", background: "transparent" }}>
                ↻ retry
              </button>
            </div>
          )}

          {!puzzleLoading && !puzzleError && puzzle?.question && (
            <img src={puzzle.question} alt="Heart Puzzle" className="block w-full rounded-sm" />
          )}
        </div>

        {/* Refresh link */}
        {!puzzleLoading && !puzzleError && (
          <button onClick={loadAll}
            className="relative z-10 mb-3 block bg-transparent p-0 text-[9px] tracking-widest text-slate-700 transition hover:text-slate-500"
            style={{ fontFamily: "'Share Tech Mono', monospace", border: "none" }}>
            ↻ different puzzle
          </button>
        )}

        {/* Answer Input */}
        <div className="relative z-10 mb-5 flex gap-2">
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="_ _ _"
            autoFocus
            disabled={busy}
            className="flex-1 rounded-sm border bg-slate-950 text-center text-lg tracking-[4px] text-slate-100 outline-none transition-colors"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              padding: "10px 14px",
              borderColor: shakeError ? "#ef4444" : "#334155",
              boxShadow: shakeError ? "0 0 8px #ef444444" : "none",
              opacity: busy ? 0.35 : 1,
              cursor: busy ? "not-allowed" : "text",
              animation: shakeError ? "shake 0.4s ease" : "none",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={busy}
            className="rounded-sm px-4 py-2 text-xs font-bold tracking-widest text-black transition hover:opacity-90"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: "#ec4899",
              opacity: busy ? 0.35 : 1,
              cursor: busy ? "not-allowed" : "pointer",
              border: "none",
            }}>
            OK
          </button>
        </div>

        {/* Divider */}
        <div className="relative z-10 mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-[9px] uppercase tracking-[2px] text-slate-600">meanwhile...</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Joke Box */}
        <div className="relative z-10 mb-3 min-h-[64px] rounded-r-sm border border-slate-800 bg-slate-950 p-3"
          style={{ borderLeft: "3px solid #fbbf24" }}>
          {jokeLoading ? (
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {[0, 0.2, 0.4].map((d, i) => (
                <span key={i} className="inline-block h-2 w-2 rounded-full bg-yellow-400"
                  style={{ animation: `pulseDot 1.2s ease-in-out ${d}s infinite` }} />
              ))}
            </div>
          ) : (
            <>
              <p className="mb-2.5 text-xs leading-relaxed text-slate-400"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                {joke?.setup}
              </p>

              {joke?.type === "twopart" && !showDelivery && (
                <button onClick={() => setShowDelivery(true)}
                  className="rounded-sm border border-yellow-400/30 px-2.5 py-1 text-[10px] tracking-widest text-yellow-400"
                  style={{ fontFamily: "'Share Tech Mono', monospace", background: "transparent", animation: "blink 1.4s step-end infinite" }}>
                  ▶ reveal punchline
                </button>
              )}

              {showDelivery && joke?.delivery && (
                <p className="text-xs leading-relaxed text-yellow-400"
                  style={{ fontFamily: "'Share Tech Mono', monospace", animation: "deliveryAppear 0.35s ease both" }}>
                  <span className="text-[9px] opacity-70">▶ </span>
                  {joke.delivery}
                </p>
              )}

              {joke?.isFallback && (
                <span className="mt-1.5 block text-[9px] italic text-slate-700">offline fallback</span>
              )}
            </>
          )}
        </div>

        {/* Attribution */}
        <p className="relative z-10 text-center text-[9px] tracking-widest text-slate-800">
          puzzles by{" "}
          <a href="https://marcconrad.com/uob/heart" target="_blank" rel="noopener noreferrer"
            className="text-slate-700 no-underline hover:text-slate-500">
            marcconrad.com
          </a>
          {" · "}
          jokes by{" "}
          <a href="https://jokeapi.dev" target="_blank" rel="noopener noreferrer"
            className="text-slate-700 no-underline hover:text-slate-500">
            jokeapi.dev
          </a>
        </p>
      </div>
    </div>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14%       { transform: scale(1.25); }
    28%       { transform: scale(1); }
    42%       { transform: scale(1.15); }
    56%       { transform: scale(1); }
  }
  @keyframes pulseDot {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1);   opacity: 1;   }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0; }
  }
  @keyframes deliveryAppear {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
`;

export default HeartModal;