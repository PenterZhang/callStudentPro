import { useRef } from "react";

export const useAudio = () => {
    const audioCtx = useRef<AudioContext | null>(null);

    const initAudio = () => {
        if (!audioCtx.current) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx.current = new AudioContextClass();
        }
    };

    const playTick = () => {
        initAudio();
        const ctx = audioCtx.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    };

    const playBoom = () => {
        initAudio();
        const ctx = audioCtx.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    };

    const speak = (content: string) => {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(content);
        msg.rate = 1.1;
        window.speechSynthesis.speak(msg);
    };

    return { playTick, playBoom, speak };
};
