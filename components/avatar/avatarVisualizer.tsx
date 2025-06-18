// components/AvatarVisualizer.tsx
'use client';
import { RemoteAudioTrack } from "livekit-client";
import { useTrackVolume } from "@/hooks/useTrackVolume";

export function AvatarVisualizer({ track }: { track?: RemoteAudioTrack }) {
  const volume = useTrackVolume(track);
  const mouthOpen = Math.min(Math.max((volume - 20) / 60, 0), 1); // Normalize to 0–1

  return (
    <div className="flex flex-col items-center">
      <div className="w-48 h-48 bg-gray-200 rounded-full relative flex items-center justify-center shadow-lg">
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-black rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-black rounded-full" />
        
        {/* Mouth */}
        <div
          className="absolute bottom-[30%] bg-black rounded-full transition-all duration-100"
          style={{
            width: `${mouthOpen * 50 + 20}px`,
            height: `${mouthOpen * 40 + 20}px`,
          }}
        />
      </div>
    </div>
  );
}
