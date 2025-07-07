import * as Tone from 'tone';

class Alarm {
  constructor() {
    // Effects chain remains the same
    this.filter = new Tone.Filter(800, "lowpass");
    this.distortion = new Tone.Distortion(0.2);
    this.reverb = new Tone.Reverb({ decay: 5, preDelay: 0.5 });
    this.outputChain = this.filter.chain(this.distortion, this.reverb, Tone.Destination);
    
    const effectsInput = this.filter;

    // Switched from an array of synths to a single synth for a clearer, simpler alarm tone.
    this.synth = new Tone.Synth({ oscillator: { type: 'sine' } }).connect(effectsInput);
    
    // The loop is initialized to null and will be created on demand.
    this.loop = null;
    this.isPrepared = false;
  }

  async prepare() {
    if (this.isPrepared && Tone.context.state === 'running') return;
    await Tone.start();
    if (!this.isPrepared) {
        await this.reverb.generate();
        this.isPrepared = true;
    }
  }

  // The start method now creates a new loop every time it's called.
  async start() {
    await this.prepare();
    
    // If a loop doesn't exist, create it.
    if (!this.loop) {
        // --- CHANGED ---
        // The loop now triggers a single high-pitched note ('A6') for a short duration ('16n').
        // The interval is now '4n' (a quarter note), making the beeps quicker and more insistent.
        this.loop = new Tone.Loop((time) => {
          this.synth.triggerAttackRelease('A6', '16n', time);
        }, '4n');
    }

    // Start the transport and the loop if it's not already running.
    if (Tone.Transport.state !== 'started') {
        this.loop.start(0);
        Tone.Transport.start();
    }
  }

  // The stop method now disposes of the loop, ensuring a clean state for the next run.
  stop() {
    if (this.loop) {
        // Stop and dispose of the loop to clean it up completely.
        this.loop.stop(0);
        this.loop.dispose();
        this.loop = null; // Set to null so a new one is created next time.
    }
    
    // Stop and cancel the main transport.
    if (Tone.Transport.state !== 'stopped') {
        Tone.Transport.stop();
        Tone.Transport.cancel(0);
        // Trigger release on the single synth instance.
        this.synth.triggerRelease();
    }
  }
}

export default Alarm;
