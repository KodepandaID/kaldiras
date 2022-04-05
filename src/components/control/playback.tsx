import React, { useEffect, useState } from 'react';
import { useVideoContext } from '../../context/provider';
import { CheckmarkIcon } from '../icons/Checkmark';

type Props = {
  show: boolean
  controlRect: number
  onClose: () => void
}

export const PlaybackBox: React.FC<Props> = (props) => {
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
        className={`bg-black/60 absolute ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-50 py-1 antialiased ${ctx.onFullscreen ? 'w-64 text-sm' : 'w-56 text-xs'} font-semibold text-white text-left`}
        style={{
          right: '20px',
          top: `${controlRect - 140}px`,
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center pl-3 py-2 mb-2 border-b border-gray-600">
            Playback Speed
          </div>
          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
            <div
              key={s}
              role="button"
              aria-label={`Playback Speed ${s}`}
              className="flex items-center gap-3 px-3 py-1 hover:bg-gray-600"
              onClick={() => {
                ctx.dispatch({ type: 'speed', speed: s });
                if (props.onClose !== undefined) props.onClose();
              }}
            >
              <div className="w-4">
                {ctx.activeSpeed === s && (
                  <CheckmarkIcon className="h-3 fill-white" />
                )}
              </div>
              <p>{s === 1 ? 'Normal' : s}</p>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );
};
