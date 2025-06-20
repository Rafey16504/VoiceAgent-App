// components/SplineAvatar.tsx or inline in the same file
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
    } else {
      // Replace with the actual name of your dummy reset object
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
    const mouth = spline.findObjectByName("mouth") as SPEObject;
    if (mouth) {
      mouthRef.current = mouth;
    }
  };

  return (
    <div className="h-[300px] w-[300px]">
      <Spline
        scene="https://prod.spline.design/wiqpRSMufu7cBUOc/scene.splinecode"
        onLoad={onLoad}
      />
    </div>
  );
}