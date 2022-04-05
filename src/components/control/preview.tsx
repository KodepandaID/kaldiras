import React, { useEffect, useState } from 'react';
import { useVideoContext } from '../../context/provider';

type Props = {
  show: boolean
  previewRect: number
}

export const VideoPreview: React.FC<Props> = (props) => {
  const ctx = useVideoContext();

  const [show, setShow] = useState(false);
  const [previewRect, setPreviewRect] = useState<number>(props.previewRect);

  useEffect(() => {
    if (show !== props.show) setShow(props.show);

    if (props.previewRect !== previewRect) setPreviewRect(props.previewRect);
  }, [props.show, props.previewRect]);

  return (
    (ctx !== null && ctx.activePreview !== undefined) ? (
      <div
        className={`flex flex-col items-center ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'} absolute z-50 antialiased`}
        style={{
          left: ctx.activePreview.position > 0 ? `${ctx.activePreview.position}px` : ctx.activePreview.position < 0 ? '5px' : undefined,
          right: ctx.activePreview.position === 0 ? '5px' : undefined,
          top: `${previewRect - 82}px`,
        }}
      >
        <div className="w-24 h-14 border border-white">
          {ctx.activePreview.source !== '' && (
            <img src={ctx.activePreview.source} alt={`Preview ${ctx.activePreview.time}`} className="w-full h-full object-cover object-center" />
          )}
        </div>
        <div className="bg-black p-1 antialiased text-xs text-white">{ctx.activePreview.time}</div>
      </div>
    ) : null
  );
};
