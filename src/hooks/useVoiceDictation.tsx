import { useState, useRef, useCallback, useEffect } from "react";

const SpeechRecognition =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export type VoiceState = "idle" | "listening" | "processing" | "error";

export const useVoiceDictation = (onResult: (text: string) => void) => {
  const [state, setState] = useState<VoiceState>("idle");
  const [isSupported] = useState(() => !!SpeechRecognition);
  const recognitionRef = useRef<any>(null);
  const processingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearProcessingTimer = () => {
    if (processingTimerRef.current) {
      clearTimeout(processingTimerRef.current);
      processingTimerRef.current = null;
    }
  };

  const start = useCallback(() => {
    if (!SpeechRecognition || state === "listening") return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      clearProcessingTimer();
      if (event.error === "no-speech" || event.error === "audio-capture") {
        setState("error");
        setTimeout(() => setState("idle"), 3000);
      } else {
        setState("idle");
      }
    };

    recognition.onend = () => {
      // Brief processing state before returning to idle
      setState("processing");
      processingTimerRef.current = setTimeout(() => {
        setState("idle");
      }, 800);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setState("listening");
  }, [state, onResult]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      setState("processing");
      recognitionRef.current.stop();
      processingTimerRef.current = setTimeout(() => {
        setState("idle");
      }, 800);
    }
  }, []);

  const toggle = useCallback(() => {
    if (state === "listening") {
      stop();
    } else if (state === "idle" || state === "error") {
      start();
    }
  }, [state, start, stop]);

  useEffect(() => {
    return () => {
      clearProcessingTimer();
      recognitionRef.current?.stop();
    };
  }, []);

  // Backward compat
  const isListening = state === "listening";

  return { state, isListening, isSupported, start, stop, toggle };
};
