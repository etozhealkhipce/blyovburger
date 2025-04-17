import { FC, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";

import { AppScene } from "@/widgets/scene";

export const Renderer: FC = () => {
  // const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <AppScene />
      <div className="absolute top-4 left-4 bg-white bg-opacity-20 p-4 rounded text-black">
        {/* <p>Кликни на слова для эффектов!</p> */}
      </div>
      {/* <button
        onClick={handlePlayPause}
        className="absolute top-8 right-8 flex items-center gap-3 bg-orange-300 px-4 py-2 rounded-full text-white"
      >
        <div className="relative w-12 h-3 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/assets/Waves.png')] bg-cover bg-repeat animate-wave-right" />
        </div>
        <span className="text-[10px] font-mono tracking-wider opacity-90 ml-1">
          {isPlaying ? "ON" : "OFF"}
        </span>
      </button>
      <audio ref={audioRef} src="/path/to/your/audio.mp3" /> */}
    </>
  );
};
