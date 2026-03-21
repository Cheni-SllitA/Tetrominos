import { useState, useEffect } from "react";
import { fetchJoke } from "../services/Jokeservice";
import { fetchHeartPuzzle } from "../services/heartService";

const HeartModal = ({ onSubmit }) => {
  const [answer, setAnswer] = useState("");
  const [joke, setJoke] = useState(null);
  const [showDelivery, setShowDelivery] = useState(false);
  const [jokeLoading, setJokeLoading] = useState(true);
  const [shakeError, setShakeError] = useState(false);

  // Puzzle state now lives here — the modal fetches it directly
  // so every mount (and every ↻ tap) hits the API fresh.
  const [puzzle, setPuzzle] = useState(null);
  const [puzzleLoading, setPuzzleLoading] = useState(true);
  const [puzzleError, setPuzzleError] = useState(false);

  // Fire both APIs in parallel — neither blocks the other
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

    // ── Puzzle ──────────────────────────────────────────────────
    if (
      puzzleResult.status === "fulfilled" &&
      puzzleResult.value?.question
    ) {
      setPuzzle(puzzleResult.value);
      setPuzzleError(false);
    } else {
      setPuzzle(null);
      setPuzzleError(true);
    }
    setPuzzleLoading(false);

    // ── Joke ────────────────────────────────────────────────────
    if (jokeResult.status === "fulfilled" && jokeResult.value) {
      setJoke(jokeResult.value);
      if (jokeResult.value.type === "single") setShowDelivery(true);
    }
    setJokeLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []); // runs once on mount; call loadAll() manually to refresh

  const handleSubmit = () => {
    if (!answer.trim()) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }
    // Pass the full puzzle object so the caller can validate
    // against puzzle.solution if needed
    onSubmit(answer, puzzle);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const busy = puzzleLoading || puzzleError;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <style>{css}</style>

        {/* Scanline texture */}
        <div style={styles.scanlines} />

        {/* ── Header ──────────────────────────────────────────── */}
        <div style={styles.header}>
          <span style={styles.heartIcon}>♥</span>
          <span style={styles.title}>SOLVE TO CONTINUE</span>
          <span style={styles.heartIcon}>♥</span>
        </div>

        {/* ── Puzzle image ─────────────────────────────────────── */}
        <div style={styles.puzzleWrap}>
          <div style={styles.puzzleCornerTL} />
          <div style={styles.puzzleCornerTR} />
          <div style={styles.puzzleCornerBL} />
          <div style={styles.puzzleCornerBR} />

          {/* Loading state */}
          {puzzleLoading && (
            <div style={styles.puzzlePlaceholder}>
              <div style={styles.loadingRow}>
                <span style={styles.dotPink} />
                <span style={{ ...styles.dotPink, animationDelay: "0.2s" }} />
                <span style={{ ...styles.dotPink, animationDelay: "0.4s" }} />
              </div>
              <span style={styles.loadingLabel}>fetching puzzle...</span>
            </div>
          )}

          {/* Error state */}
          {!puzzleLoading && puzzleError && (
            <div style={styles.puzzlePlaceholder}>
              <span style={styles.errorText}>⚠ Could not reach Heart API</span>
              <button style={styles.retryBtn} onClick={loadAll}>
                ↻ retry
              </button>
            </div>
          )}

          {/* Puzzle ready */}
          {!puzzleLoading && !puzzleError && puzzle?.question && (
            <img
              src={puzzle.question}
              alt="Heart Puzzle"
              style={styles.puzzleImg}
            />
          )}
        </div>

        {/* "Different puzzle" link — only when a puzzle is showing */}
        {!puzzleLoading && !puzzleError && (
          <button style={styles.refreshBtn} onClick={loadAll}>
            ↻ different puzzle
          </button>
        )}

        {/* ── Answer input ─────────────────────────────────────── */}
        <div style={styles.inputRow}>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="_ _ _"
            autoFocus
            disabled={busy}
            style={{
              ...styles.input,
              ...(shakeError ? styles.inputError : {}),
              ...(busy ? styles.inputDisabled : {}),
              animation: shakeError ? "shake 0.4s ease" : "none",
            }}
          />
          <button
            style={{
              ...styles.submitBtn,
              ...(busy ? styles.submitDisabled : {}),
            }}
            onClick={handleSubmit}
            disabled={busy}
          >
            OK
          </button>
        </div>

        {/* ── Joke section ─────────────────────────────────────── */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerLabel}>meanwhile...</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.jokeBox}>
          {jokeLoading ? (
            <div style={styles.loadingRow}>
              <span style={styles.dot} />
              <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
              <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
            </div>
          ) : (
            <>
              <p style={styles.jokeSetup}>{joke?.setup}</p>

              {joke?.type === "twopart" && !showDelivery && (
                <button
                  style={styles.punchlineBtn}
                  onClick={() => setShowDelivery(true)}
                >
                  ▶ reveal punchline
                </button>
              )}

              {showDelivery && joke?.delivery && (
                <p style={styles.jokeDelivery}>
                  <span style={styles.arrow}>▶ </span>
                  {joke.delivery}
                </p>
              )}

              {joke?.isFallback && (
                <span style={styles.offlineNote}>offline fallback</span>
              )}
            </>
          )}
        </div>

        {/* ── Attribution ──────────────────────────────────────── */}
        <p style={styles.attribution}>
          puzzles by{" "}
          <a
            href="https://marcconrad.com/uob/heart"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            marcconrad.com
          </a>
          {" · "}
          jokes by{" "}
          <a
            href="https://jokeapi.dev"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            jokeapi.dev
          </a>
        </p>
      </div>
    </div>
  );
};

/* ── Styles ──────────────────────────────────────────────────── */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.82)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  modal: {
    position: "relative",
    background: "#0a0a0f",
    border: "1px solid #1a1a2e",
    borderTop: "2px solid #ff6b9d",
    borderRadius: "4px",
    padding: "24px 22px 16px",
    width: "min(360px, 92vw)",
    overflow: "hidden",
    fontFamily: "'Share Tech Mono', monospace",
    animation: "fadeSlideUp 0.25s ease both",
  },
  scanlines: {
    position: "absolute",
    inset: 0,
    background:
      "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,107,157,0.018) 2px,rgba(255,107,157,0.018) 4px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "18px",
  },
  heartIcon: {
    color: "#ff6b9d",
    fontSize: "16px",
    animation: "heartbeat 1.2s ease-in-out infinite",
    display: "inline-block",
    textShadow: "0 0 10px #ff6b9d88",
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: "13px",
    fontWeight: 700,
    color: "#ff6b9d",
    letterSpacing: "3px",
    textShadow: "0 0 14px #ff6b9d55",
  },
  puzzleWrap: {
    position: "relative",
    marginBottom: "8px",
    padding: "10px",
    background: "#0f0f1a",
    border: "1px solid #1a1a2e",
    minHeight: "90px",
  },
  puzzleCornerTL: { position: "absolute", top: -1, left: -1, width: 10, height: 10, borderTop: "2px solid #ff6b9d", borderLeft: "2px solid #ff6b9d" },
  puzzleCornerTR: { position: "absolute", top: -1, right: -1, width: 10, height: 10, borderTop: "2px solid #ff6b9d", borderRight: "2px solid #ff6b9d" },
  puzzleCornerBL: { position: "absolute", bottom: -1, left: -1, width: 10, height: 10, borderBottom: "2px solid #ff6b9d", borderLeft: "2px solid #ff6b9d" },
  puzzleCornerBR: { position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderBottom: "2px solid #ff6b9d", borderRight: "2px solid #ff6b9d" },
  puzzleImg: {
    display: "block",
    width: "100%",
    borderRadius: "2px",
  },
  puzzlePlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    minHeight: "80px",
  },
  loadingLabel: {
    fontSize: "10px",
    color: "#444",
    letterSpacing: "2px",
  },
  errorText: {
    fontSize: "11px",
    color: "#ff4444",
    letterSpacing: "1px",
  },
  retryBtn: {
    background: "transparent",
    border: "1px solid #ff444466",
    color: "#ff4444",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "10px",
    padding: "4px 10px",
    borderRadius: "2px",
    cursor: "pointer",
    letterSpacing: "1px",
  },
  refreshBtn: {
    display: "block",
    background: "transparent",
    border: "none",
    color: "#2e2e44",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9px",
    letterSpacing: "1px",
    cursor: "pointer",
    marginBottom: "12px",
    padding: 0,
    transition: "color 0.15s",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "18px",
  },
  input: {
    flex: 1,
    background: "#0f0f1a",
    border: "1px solid #2a2a3e",
    borderRadius: "3px",
    color: "#e8e8f0",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "18px",
    padding: "10px 14px",
    outline: "none",
    letterSpacing: "4px",
    textAlign: "center",
    transition: "border-color 0.2s",
  },
  inputError: {
    borderColor: "#ff4444",
    boxShadow: "0 0 8px #ff444444",
  },
  inputDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
  submitBtn: {
    background: "#ff6b9d",
    border: "none",
    borderRadius: "3px",
    color: "#000",
    fontFamily: "'Orbitron', monospace",
    fontSize: "12px",
    fontWeight: 700,
    padding: "10px 16px",
    cursor: "pointer",
    letterSpacing: "1px",
  },
  submitDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#1a1a2e",
  },
  dividerLabel: {
    fontSize: "9px",
    color: "#444",
    letterSpacing: "2px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  jokeBox: {
    background: "#0f0f1a",
    border: "1px solid #1a1a2e",
    borderLeft: "3px solid #ffd93d",
    borderRadius: "0 3px 3px 0",
    padding: "12px 14px",
    minHeight: "64px",
    marginBottom: "12px",
  },
  loadingRow: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "8px",
  },
  dot: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#ffd93d",
    animation: "pulseDot 1.2s ease-in-out infinite",
  },
  dotPink: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#ff6b9d",
    animation: "pulseDot 1.2s ease-in-out infinite",
  },
  jokeSetup: {
    margin: "0 0 10px",
    fontSize: "12px",
    color: "#b0b0c0",
    lineHeight: 1.6,
  },
  punchlineBtn: {
    background: "transparent",
    border: "1px solid #ffd93d44",
    color: "#ffd93d",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "10px",
    letterSpacing: "1px",
    padding: "5px 10px",
    borderRadius: "2px",
    cursor: "pointer",
    animation: "blink 1.4s step-end infinite",
  },
  jokeDelivery: {
    margin: 0,
    fontSize: "12px",
    color: "#ffd93d",
    lineHeight: 1.6,
    animation: "deliveryAppear 0.35s ease both",
  },
  arrow: {
    fontSize: "9px",
    opacity: 0.7,
  },
  offlineNote: {
    display: "block",
    marginTop: "6px",
    fontSize: "9px",
    color: "#333",
    fontStyle: "italic",
  },
  attribution: {
    margin: 0,
    textAlign: "center",
    fontSize: "9px",
    color: "#2a2a3e",
    letterSpacing: "1px",
  },
  link: {
    color: "#383850",
    textDecoration: "none",
  },
};

/* ── Keyframes ───────────────────────────────────────────────── */
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
