// Non-invasive, whisper-soft acoustic chime & calm harp note sequence
// Zero droning oscillators, zero ear strain, zero high-frequency pierce
export type SoundPreset = 'lounge' | 'zen' | 'hearth';

class PeacefulAcousticSoundscape {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private volumeGain: GainNode | null = null;
  private noteTimer: number | null = null;
  private currentPreset: SoundPreset = 'lounge';
  private currentVolume: number = 0.5; // gentle default volume
  private stepIndex: number = 0;

  // Gentle, harmonic pentatonic peaceful scales (in pleasant mid-registers, warm and soothing)
  private readonly loungeNotes = [261.63, 329.63, 392.0, 440.0, 523.25, 392.0, 329.63]; // C4, E4, G4, A4, C5
  private readonly zenNotes = [293.66, 349.23, 440.0, 523.25, 587.33, 440.0]; // D4, F4, A4, C5, D5
  private readonly hearthNotes = [220.0, 261.63, 329.63, 392.0, 440.0, 329.63]; // A3, C4, E4, G4, A4

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.volumeGain && this.ctx) {
      this.volumeGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public setPreset(preset: SoundPreset) {
    this.currentPreset = preset;
    this.stepIndex = 0;
  }

  public getPreset(): SoundPreset {
    return this.currentPreset;
  }

  public play() {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Master output node: set to whisper-quiet gain (no sudden blast)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.linearRampToValueAtTime(0.04, now + 1.0); // very soft level

      this.volumeGain = this.ctx.createGain();
      this.volumeGain.gain.setValueAtTime(this.currentVolume, now);

      this.masterGain.connect(this.volumeGain);
      this.volumeGain.connect(this.ctx.destination);

      this.isPlaying = true;
      this.stepIndex = 0;

      // Trigger first note softly after 400ms, then schedule subsequent spaced gentle notes
      setTimeout(() => {
        if (this.isPlaying) {
          this.playNextGentleNote();
        }
      }, 400);
    } catch (e) {
      console.warn('AudioContext playback error:', e);
      this.isPlaying = false;
    }
  }

  // Plays a single, beautifully damped acoustic harp/bell tone with natural decay
  private playNextGentleNote() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    try {
      const notes =
        this.currentPreset === 'zen'
          ? this.zenNotes
          : this.currentPreset === 'hearth'
          ? this.hearthNotes
          : this.loungeNotes;

      const freq = notes[this.stepIndex % notes.length];
      this.stepIndex++;

      const now = this.ctx.currentTime;

      // 1. Soft fundamental tone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Warm triangle/sine blend: gentle and rounded, never piercing
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Lowpass warmth filter: eliminates any sharp edge completely
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now); // soft warm acoustic cut

      // Natural acoustic envelope: very soft attack (0.04s), long peaceful natural decay (3.0s)
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(0.02, now + 0.04); // peak is only 0.02 (whisper quiet!)
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.3);

      // Clean cleanup
      setTimeout(() => {
        try {
          osc.disconnect();
          filter.disconnect();
          oscGain.disconnect();
        } catch {
          // ignore
        }
      }, 3400);

      // Schedule the next note with peaceful 3.5 to 5.5 second spacing
      // This ensures there is plenty of calm silence between notes, completely eliminating ear fatigue
      const interval = 3500 + Math.random() * 2000;
      this.noteTimer = window.setTimeout(() => {
        this.playNextGentleNote();
      }, interval);
    } catch {
      // ignore
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.noteTimer) {
      clearTimeout(this.noteTimer);
      this.noteTimer = null;
    }
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.3);
      setTimeout(() => {
        try {
          this.masterGain?.disconnect();
        } catch {
          // ignore
        }
      }, 500);
    } catch {
      // ignore
    }
  }

  public stop() {
    this.pause();
  }
}

export const luxuryAudio = new PeacefulAcousticSoundscape();
