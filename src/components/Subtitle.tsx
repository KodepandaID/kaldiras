import React, { useEffect, useState } from 'react';
import { useVideoContext } from '../context/provider';
import { playerRef } from '../video';
import { TailwindColor } from './tailwind/TailwindColor';

export type SubtitleSize = 'xs' | 'sm' | 'normal' | 'lg' | 'xl'

type SubtitleProps = {
  color?: 'white' | 'black' | 'gray' | 'zinc' | 'slate' | 'stone' | 'neutral' | 'red' | 'yellow' | 'orange' | 'amber' | 'lime' | 'green' | 'blue' | 'sky' | 'indigo' | 'purple' | 'pink' | 'emerald' | 'teal' | 'cyan' | 'fuchsia' | 'violet' | 'rose'
  colorContrast?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  size: SubtitleSize
  fullscreen?: boolean
}

const textSize = {
  xs: 'text-xs',
  sm: 'text-sm',
  normal: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export const Subtitle: React.FC<SubtitleProps> = (props) => {
  const ctx = useVideoContext();

  const [subtitle, setSubtitle] = useState<Array<TextTrackCue>>([]);
  const [size, setSize] = useState(textSize[props.size]);

  useEffect(() => {
    if (ctx !== null && playerRef.current !== null) {
      if (ctx.activeSubtitle !== null) {
        if (playerRef.current !== undefined) {
          const tracks = playerRef.current.textTracks;
          if (tracks.length > 0 && ctx.activeSubtitle !== undefined) {
            const track = tracks[ctx.activeSubtitle];
            track.mode = 'showing';

            if (track.activeCues !== null) {
              const activeCues = [...track.activeCues];
              const cues = activeCues;
              if (cues.length > 0) setSubtitle(cues);
              else setSubtitle([]);
            }
          }
        }

        if (!ctx.onFullscreen) setSize(textSize[props.size]);
        else setSize(textSize['3xl']);
      }
    }
  }, [ctx]);

  return (
    <div className={`w-full absolute left-0 bottom-14 z-50 pointer-events-none transition ease-in-out delay-150 ${subtitle.length > 0 ? 'visible' : 'hidden'} px-5`}>
      <div className="w-full flex flex-col gap-0.5 items-center justify-center">
        {subtitle.map((s: any, idx) => (
          <div key={idx} className="w-max bg-black/50 px-5 py-1 select-none">
            <p className={`${size} font-semibold`} style={{ color: TailwindColor(props.color, props.colorContrast) }}>{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
