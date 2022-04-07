import React, { useEffect, useState } from 'react';
import { useVideoContext } from '../../context/provider';
import { CheckmarkIcon } from '../icons/Checkmark';

type Props = {
  show: boolean
  controlRect: number
  onClose: () => void
}

export const QualityBox: React.FC<Props> = (props) => {
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
        className={`bg-gray-800 absolute ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-50 py-1 antialiased ${ctx.onFullscreen ? 'w-64 text-sm' : 'w-56 text-xs'} font-semibold text-white text-left`}
        style={{
          right: '20px',
          top: `${controlRect - 20}px`,
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center pl-3 py-2 mb-2 border-b border-gray-600">
            Quality
          </div>
          {ctx.quality.map((s: any, idx) => (
            <div
              key={idx}
              role="button"
              aria-label={`Quality ${s.resolution}`}
              className="flex items-center gap-2 px-3 py-1 hover:bg-gray-600"
              onClick={() => {
                ctx.dispatch({
                  type: 'activeQuality',
                  activeQuality: s.resolution,
                  source: s.source,
                  currentTime: ctx.currentTime,
                  speed: ctx.activeSpeed,
                });
                if (props.onClose !== undefined) props.onClose();
              }}
            >
              <div className="w-4">
                {ctx.activeQuality === s.resolution && (
                  <CheckmarkIcon className="h-3 fill-white" />
                )}
              </div>
              {s.resolution}
              p
              {parseInt(s.resolution) >= 720 ? (
                <p className="text-[8px] text-red-700 absolute right-5">
                  {parseInt(s.resolution) < 2160 ? 'HD' : '4K'}
                </p>
              ) : ''}
            </div>
          ))}
        </div>
      </div>
    ) : null
  );
};
