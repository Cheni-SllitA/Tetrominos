// src/utils/soundManager.js

// Import your local audio files
import clickSfx from "../utils/Sound/Mouse Click Sound Effect.mp3";
import errorSfx from "../utils/Sound/Wrong Buzzer - Sound Effect.mp3";
import bgMusic from "../utils/Sound/background.mp3";
// import correctSfx from "./Sound/correct.m4a";
// import loginSfx from "./Sound/login.m4a";

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.buffers = {};
    this.globalVolume = 1;
    this.isUnlocked = false;

    // Map names → local file paths
    this.soundFiles = {
      click: clickSfx,
      error: errorSfx,
      // correct: correctSfx,
      // login: loginSfx,
      background: bgMusic,
    };
  }

  // Unlock audio context on first user gesture
  async unlock() {
    if (this.isUnlocked) return;

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }

    await this.loadAll();

    this.isUnlocked = true;
    console.log("%c🔊 Audio Unlocked (Local Files Loaded)", "color:lime");
  }

  // Load all local audio files
  async loadAll() {
    const entries = Object.entries(this.soundFiles);

    for (const [name, url] of entries) {
      const buffer = await this.loadBuffer(url);
      this.buffers[name] = buffer;
    }
  }

  // Convert local file → audio buffer
  async loadBuffer(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioCtx.decodeAudioData(arrayBuffer);
  }

  // Play any one-shot sound
  play(name) {
    if (!this.isUnlocked || !this.buffers[name]) return;

    const source = this.audioCtx.createBufferSource();
    source.buffer = this.buffers[name];

    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = this.globalVolume;

    source.connect(gainNode).connect(this.audioCtx.destination);
    source.start(0);
  }

  // Background music (if added later)
  startBackground() {
    if (!this.isUnlocked || !this.buffers.background) return;

    if (this.bgSource) this.bgSource.stop();

    const source = this.audioCtx.createBufferSource();
    source.buffer = this.buffers.background;
    source.loop = true;

    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = 0.25;

    source.connect(gainNode).connect(this.audioCtx.destination);
    source.start(0);

    this.bgSource = source;
  }

  stopBackground() {
    if (this.bgSource) {
      this.bgSource.stop();
      this.bgSource = null;
    }
  }

  setVolume(v) {
    this.globalVolume = v;
  }
}

export const soundManager = new SoundManager();
