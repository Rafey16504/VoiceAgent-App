import React, { useEffect, useRef } from "react";
const Spline = React.lazy(() => import("@splinetool/react-spline"));

import type { Application, SPEObject } from "@splinetool/runtime";
import { RemoteAudioTrack } from "livekit-client";

interface SplineAvatarProps {
  audioTrack?: RemoteAudioTrack; // Agent's audio (NOT mic input)
}

export function SplineAvatar({ audioTrack }: SplineAvatarProps) {
  const splineRef = useRef<Application | null>(null);
  const mouthRef = useRef<SPEObject | null>(null);
  const eyebrowLeftRef = useRef<SPEObject | null>(null);
  const eyebrowRightRef = useRef<SPEObject | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioTrack || !audioTrack.mediaStreamTrack) return;

    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 64;
    analyserRef.current = analyser;

    const stream = new MediaStream([audioTrack.mediaStreamTrack]);
    const source = context.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let lastEmit = 0;
    const emitInterval = 150; // 150ms between events

    let toggle = false;

    const loop = () => {
      requestAnimationFrame(loop);

      if (!splineRef.current || !mouthRef.current) return;

      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const volume = avg / 255;

      const now = performance.now();
      const isSpeaking = volume > 0.05;

      if (isSpeaking && now - lastEmit > emitInterval) {
        if (toggle) {
          splineRef.current.emitEvent("mouseHover", mouthRef.current.uuid);
          if (eyebrowLeftRef.current) {
            splineRef.current.emitEvent("mouseHover", eyebrowLeftRef.current.uuid);
          }
          if (eyebrowRightRef.current) {
            splineRef.current.emitEvent("mouseHover", eyebrowRightRef.current.uuid);
          }
        } else {
          const dummy = splineRef.current.findObjectByName("resetDummy") as SPEObject;
          if (dummy) {
            splineRef.current.emitEvent("mouseHover", dummy.uuid);
          }
        }
        toggle = !toggle;
        lastEmit = now;
      }
    };

    loop();

    return () => {
      source.disconnect();
      analyser.disconnect();
      context.close();
    };
  }, [audioTrack]);

  const onLoad = (spline: Application) => {
    splineRef.current = spline;
    mouthRef.current = spline.findObjectByName("mouth") as SPEObject;
    eyebrowLeftRef.current = spline.findObjectByName("eyebrow_left") as SPEObject;
    eyebrowRightRef.current = spline.findObjectByName("eyebrow_right") as SPEObject;
  };

  return (
    <div className="h-[700px] w-[700px] relative ">
      <Spline
        scene="https://prod.spline.design/MbMuwIa5qpEjjWOd/scene.splinecode" 
        onLoad={onLoad}
      />
      <p className="absolute bottom-3 left-[60%] bg-[var(--lk-bg)] w-56 h-12"></p>
    </div>
  );
}
