import React, { useEffect, useState, forwardRef } from 'react';
import { useVideoContext } from '../../context/provider';
import { TailwindColor } from '../tailwind/TailwindColor';

type Props = {
  color?: string
  colorContrast?: number
  show: boolean
  controlRect: number
  showPlayback: () => void
  showQuality: () => void
}

type Ref = HTMLDivElement

export const SettingBox = forwardRef<Ref, Props>((props, ref) => {
  const ctx = useVideoContext();

  const [show, setShow] = useState(false);
  const [controlRect, setControlRect] = useState<number>(0);

  useEffect(() => {
    if (show !== props.show) setShow(props.show);

    if (props.controlRect !== controlRect) setControlRect(props.controlRect);
  }, [props.show, props.controlRect]);

  return (
    ctx !== null ? (
      <div
        ref={ref}
        className={`w-56 bg-gray-800 absolute ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-50 py-1 antialiased ${ctx.onFullscreen ? 'w-64 text-sm' : 'w-56 text-xs'} font-semibold text-white`}
        style={{
          right: '20px',
          top: `${controlRect}px`,
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center px-5 py-2 mb-2 border-b border-gray-600">
            Settings
          </div>
          <div
            className="flex items-center justify-between gap-3 hover:bg-gray-600 px-5 py-1"
            role="button"
            aria-label="Playback Speed"
            onClick={() => {
              if (props.showPlayback !== undefined) props.showPlayback();
            }}
          >
            <p>Playback Speed</p>
            <div className="px-3 py-0.5" style={{ backgroundColor: `${TailwindColor(props.color, props.colorContrast)}` }}>{ctx.activeSpeed === 1 ? 'Normal' : `${ctx.activeSpeed}x`}</div>
          </div>
          <div
            className="flex items-center justify-between gap-3 hover:bg-gray-600 px-5 py-1"
            role="button"
            aria-label="Quality"
            onClick={() => {
              if (props.showQuality !== undefined) props.showQuality();
            }}
          >
            <p>Quality</p>
            <div className="px-3 py-0.5" style={{ backgroundColor: `${TailwindColor(props.color, props.colorContrast)}` }}>
              {ctx.activeQuality}
              p
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
});
