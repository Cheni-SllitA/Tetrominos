import { useEffect } from "react";
import { soundManager } from "../services/soundManager";

export default function AudioProvider() {
  useEffect(() => {
    const unlockAudio = async () => {
      await soundManager.unlock();
      soundManager.startBackground(); // 🔊 start once only!
      window.removeEventListener("click", unlockAudio);
    };

    // On first user interaction, unlock & start BGM
    window.addEventListener("click", unlockAudio);

    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  return null; // No UI needed
}