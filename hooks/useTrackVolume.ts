// hooks/useTrackVolume.ts
import { useEffect, useState } from "react";
import { RemoteAudioTrack } from "livekit-client";

export function useTrackVolume(track?: RemoteAudioTrack) {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!track) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const sourceNode = audioContext.createMediaStreamSource(
      new MediaStream([track.mediaStreamTrack])
    );
    sourceNode.connect(analyser);

    let rafId: number;
    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolume(avg);
      rafId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(rafId);
      sourceNode.disconnect();
      analyser.disconnect();
      audioContext.close();
    };
  }, [track]);

  return volume;
}
