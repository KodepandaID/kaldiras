import React, {
  forwardRef, useEffect, useState,
} from 'react';
import { useVideoContext } from '../../context/provider';
import { VideoSubtitleType } from '../../video';
import { CheckmarkIcon } from '../icons/Checkmark';

type Props = {
  show: boolean
  subtitle: VideoSubtitleType[]
  controlRect: number
}

type Ref = HTMLDivElement

export const SubtitleBox = forwardRef<Ref, Props>((props, ref) => {
  const ctx = useVideoContext();

  const [show, setShow] = useState(props.show);
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
          right: '50px',
          top: `${controlRect}px`,
        }}
      >
        {props.subtitle.length > 0 && (
          <div className="flex flex-col">
            <div className="flex items-center px-3 py-2 mb-2 border-b border-gray-600">
              Subtitles
            </div>
            <div
              role="button"
              aria-label="Turn Off Subtitle"
              className={`flex items-center gap-3 px-5 py-1 ${ctx.activeSubtitle === null ? 'bg-gray-600' : ''} hover:bg-gray-600`}
              onClick={() => {
                ctx.dispatch({ type: 'activeSubtitle', activeSubtitle: null });
                setShow(false);
              }}
            >
              <div className="w-4">
                {ctx.activeSubtitle === null && (
                  <CheckmarkIcon className="h-3 fill-white" />
                )}
              </div>
              <p>Turn Off</p>
            </div>

            {props.subtitle.map((s, idx) => (
              <div
                key={idx}
                role="button"
                aria-label={`Subtitle ${s.label}`}
                className={`flex items-center gap-3 px-5 py-1 ${idx === ctx.activeSubtitle ? 'bg-gray-600' : ''} hover:bg-gray-600`}
                onClick={() => {
                  ctx.dispatch({ type: 'activeSubtitle', activeSubtitle: idx });
                  setShow(false);
                }}
              >
                <div className="w-4">
                  {ctx.activeSubtitle === idx && (
                  <CheckmarkIcon className="h-3 fill-white" />
                  )}
                </div>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : null
  );
});
