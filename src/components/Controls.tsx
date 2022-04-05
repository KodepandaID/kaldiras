import React, { useState, createRef } from 'react';
import { CloseCaptionIcon } from './icons/CloseCaption';
import { FullscreenIcon } from './icons/Fullscreen';
import { PauseIcon } from './icons/Pause';
import { PlayIcon } from './icons/Play';
import { SettingIcon } from './icons/Setting';
import { VolumeHighIcon } from './icons/VolumeHigh';
import { VolumeMuteIcon } from './icons/VolumeMute';
import { secondToTime, timeToSecond } from '../utils/formatTime';
import { ExitFullscreenIcon } from './icons/ExitFullscreen';
import { VideoSubtitleType } from '../video';
import { RotateRightIcon } from './icons/RotateRight';
import { useVideoContext } from '../context/provider';
import { rangeSliderCSS } from '../styles/style';
import { TailwindColor } from './tailwind/TailwindColor';
import { SubtitleBox } from './control/subtitle';
import { SettingBox } from './control/setting';
import { QualityBox } from './control/quality';
import { PlaybackBox } from './control/playback';
import { VideoPreview } from './control/preview';

type ControlsProps = {
  color?: 'white' | 'black' | 'gray' | 'zinc' | 'slate' | 'stone' | 'neutral' | 'red' | 'yellow' | 'orange' | 'amber' | 'lime' | 'green' | 'blue' | 'sky' | 'indigo' | 'purple' | 'pink' | 'emerald' | 'teal' | 'cyan' | 'fuchsia' | 'violet' | 'rose'
  colorContrast?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  videoHover?: boolean
  subtitle?: Array<VideoSubtitleType>
}

export const Controls: React.FC<ControlsProps> = (props) => {
  const controlRef = createRef<HTMLDivElement>();
  const seekRef = createRef<HTMLDivElement>();
  const subtitleBoxRef = createRef<HTMLDivElement>();
  const settingBoxRef = createRef<HTMLDivElement>();

  const ctx = useVideoContext();

  const [controlRect, setControlRect] = useState<number>(0);
  const [previewRect, setPreviewRect] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);

  const handleSeek = (e: React.MouseEvent) => {
    if (ctx !== null && seekRef.current !== null) {
      setShowSetting(false);
      setShowSubtitle(false);
      setShowQuality(false);
      setShowSpeed(false);

      if (ctx.status !== 'error') {
        const wMax = seekRef.current.offsetWidth + 16;
        const wSeek = e.clientX - seekRef.current.offsetLeft;

        const seekPercentage = (wSeek / wMax) * 100;
        const ct = (ctx.duration * seekPercentage) / 100;
        ctx.dispatch({
          type: 'seek',
          currentTime: ct.toFixed(0),
          percentage: seekPercentage.toFixed(0),
        });
      }
    }
  };

  const handlePreview = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ctx !== null && controlRef.current !== null && seekRef.current !== null) {
      const rect = controlRef.current.getBoundingClientRect();

      const wMax = seekRef.current.offsetWidth + 16;
      const wSeek = e.clientX;
      const seekPercentage = (wSeek / wMax) * 100;
      const ct = (seekPercentage / 100) * ctx.duration;
      const time = secondToTime(ct);

      let position = e.clientX - (ctx.onFullscreen ? 50 : 60);
      position = position > (wMax - 116) ? 0 : position;

      const preview = ctx.previews.filter((c, idx) => {
        if (ct >= timeToSecond(c.time) && (idx + 1) <= (ctx.previews.length - 1)) {
          if (ct < timeToSecond(ctx.previews[idx + 1].time)) {
            return c;
          }
        }
      });

      ctx.dispatch({
        type: 'activePreview',
        time,
        source: preview.length > 0 ? preview[0].source : '',
        description: preview.length > 0 ? preview[0].description : '',
        position,
      });

      setPreviewRect(ctx.onFullscreen ? (rect.y - 10) : (rect.y - 20));
      setShowPreview(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (ctx !== null) {
      ctx.dispatch({ type: 'volume', volume: parseFloat(e.target.value) });
    }
  };

  const handleSubtitle = () => {
    if (ctx !== null && controlRef.current !== null && subtitleBoxRef.current !== null) {
      const rect = controlRef.current.getBoundingClientRect();
      const boxRect = subtitleBoxRef.current.getBoundingClientRect();

      setControlRect(ctx.onFullscreen ? (rect.y - boxRect.height - 10) : (rect.y - boxRect.height - 20));

      setShowSetting(false);
      setShowSpeed(false);
      setShowSubtitle(!showSubtitle);
    }
  };

  const handleSetting = () => {
    if (ctx !== null && controlRef.current !== null && settingBoxRef.current !== null) {
      const rect = controlRef.current.getBoundingClientRect();
      const boxRect = settingBoxRef.current.getBoundingClientRect();

      setControlRect(ctx.onFullscreen ? (rect.y - boxRect.height - 10) : (rect.y - boxRect.height - 20));
      setShowSubtitle(false);
      setShowQuality(false);
      setShowSpeed(false);
      setShowSetting(!showSetting);
    }
  };

  const handleFullscreen = (full: boolean) => {
    const container = document.getElementById('kaldiras-container');
    if (ctx !== null && container !== null) {
      setShowSetting(false);
      setShowSubtitle(false);
      setShowQuality(false);
      setShowSpeed(false);

      if (full) {
        container.requestFullscreen();
        ctx.dispatch({ type: 'onFullscreen', onFullscreen: true });
      } else {
        document.exitFullscreen();
        ctx.dispatch({ type: 'onFullscreen', onFullscreen: false });
      }
    }
  };

  return (
    ctx !== null ? (
      <div className="w-full">
        {props.subtitle !== undefined && (
          <SubtitleBox ref={subtitleBoxRef} subtitle={props.subtitle} show={showSubtitle} controlRect={controlRect} />
        )}

        <SettingBox
          ref={settingBoxRef}
          color={props.color}
          colorContrast={props.colorContrast}
          controlRect={controlRect}
          show={showSetting}
          showPlayback={() => {
            setShowSetting(false);
            setShowSpeed(true);
          }}
          showQuality={() => {
            setShowSetting(false);
            setShowQuality(true);
          }}
        />

        <QualityBox
          show={showQuality}
          controlRect={controlRect}
          onClose={() => setShowQuality(!showQuality)}
        />

        <PlaybackBox
          show={showSpeed}
          controlRect={controlRect}
          onClose={() => setShowSpeed(!showSpeed)}
        />

        {ctx.activePreview !== undefined && (
          <VideoPreview show={showPreview} previewRect={previewRect} />
        )}

        <div
          ref={controlRef}
          className={`w-full bg-black/20 ${(ctx.status === 'play' && !ctx.onMouseOver) || ctx.status === '' ? 'opacity-100' : 'opacity-100'} flex flex-col gap-2 absolute bottom-0 left-0 right-0 text-center z-30`}
          style={{
            transition: 'opacity .4s ease-in-out,transform .4s ease-in-out',
            transform: (ctx.status === 'play' && !ctx.onMouseOver) ? 'translateY(100%)' : (ctx.status === 'play' && ctx.onMouseOver) ? 'translateY(0)' : '',
          }}
        >
          <div ref={seekRef} className="flex-1 min-w-0 z-30">
            <div
              className="relative w-full h-1 bg-gray-500 cursor-pointer"
              role="slider"
              aria-label="seek"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={ctx.percentage}
              aria-valuetext={`${ctx.percentage}%`}
              onClick={handleSeek}
              onMouseMove={handlePreview}
              onMouseLeave={() => setShowPreview(false)}
            >
              <div className="relative block h-1 bg-gray-400" style={{ width: `${ctx.buffered}%` }} />
              <div
                role="progressbar"
                aria-label="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={ctx.percentage}
                aria-valuetext={`${ctx.percentage}%`}
                className="relative block h-1"
                style={{ width: `${ctx.percentage}%`, top: '-4.5px', backgroundColor: `${TailwindColor(props.color,props.colorContrast)}` }}
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-start gap-3 py-2 px-5">
            {ctx.status === 'play' ? (
              <button
                aria-label="Pause"
                style={{ transition: 'all .3s ease' }}
                onClick={() => ctx.dispatch({ type: 'pause' })}
              >
                <PauseIcon className="h-4 fill-white hover:fill-gray-300" />
              </button>
            ) : (ctx.status === 'pause' || ctx.status === '' || ctx.status === 'error') ? (
              <button
                aria-label="Play"
                style={{ transition: 'all .3s ease' }}
                onClick={() => {
                  if (ctx.status !== 'error') ctx.dispatch({ type: 'play' });
                }}
              >
                <PlayIcon className="h-4 fill-white hover:fill-gray-300" />
              </button>
            ) : ctx.status === 'finished' && (
              <button
                aria-label="Replay"
                style={{ transition: 'all .3s ease' }}
                onClick={() => ctx.dispatch({ type: 'play' })}
              >
                <RotateRightIcon className="h-4 fill-white hover:fill-gray-300" />
              </button>
            )}

            <div className="flex items-center gap-1 text-xs font-semibold text-white">
              <span aria-label="Current Time">{secondToTime(ctx.currentTime)}</span>
              <span aria-hidden="true">/</span>
              <span aria-label="Duration">{secondToTime(ctx.duration)}</span>
            </div>

            <div className="w-full flex items-center justify-end">
              {ctx.volume > 0 ? (
                <button
                  aria-label="Mute"
                  style={{ transition: 'all .3s ease' }}
                  onClick={() => ctx.dispatch({ type: 'mute', volume: 0 })}
                >
                  <VolumeHighIcon className="h-4 fill-white hover:fill-gray-300" />
                </button>
              ) : (
                <button
                  aria-label="Unmute"
                  style={{ transition: 'all .3s ease' }}
                  onClick={() => ctx.dispatch({ type: 'unmute', volume: 1 })}
                >
                  <VolumeMuteIcon className="h-4 fill-white hover:fill-gray-300" />
                </button>
              )}

              <input
                className={`${rangeSliderCSS(props.color, props.colorContrast, ctx.volume * 100)} ml-2`}
                value={ctx.volume}
                type="range"
                min="0"
                max="1"
                step={0.05}
                autoComplete="off"
                role="slider"
                aria-label="volume"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={ctx.volume * 100}
                aria-valuetext={`${ctx.volume * 100}%`}
                onChange={handleVolumeChange}
              />

              <button
                className="ml-4"
                aria-label="Subtitles"
                disabled={(props.subtitle === undefined || ctx.status === 'error')}
                aria-disabled={(props.subtitle === undefined || ctx.status === 'error')}
                style={{ transition: 'all .3s ease' }}
                onClick={handleSubtitle}
              >
                <CloseCaptionIcon className={`h-4 ${(props.subtitle === undefined || ctx.status === 'error') ? 'fill-gray-100/70 pointer-events-none' : 'fill-white'} hover:fill-gray-300`} />
              </button>
              <button
                className="ml-4"
                aria-label="Settings"
                disabled={ctx.status === 'error'}
                aria-disabled={ctx.status === 'error'}
                style={{ transition: 'all .3s ease' }}
                onClick={handleSetting}
              >
                <SettingIcon className={`h-4 ${ctx.status === 'error' ? 'fill-gray-100/70 pointer-events-none' : 'fill-white'} hover:fill-gray-300`} />
              </button>

              {!ctx.onFullscreen ? (
                <button
                  aria-label="Fullscreen"
                  className="ml-4"
                  style={{ transition: 'all .3s ease' }}
                  onClick={() => handleFullscreen(true)}
                >
                  <FullscreenIcon className="h-4 fill-white hover:fill-gray-300" />
                </button>
              ) : (
                <button
                  aria-label="Exit Fullscreen"
                  className="ml-4"
                  style={{ transition: 'all .3s ease' }}
                  onClick={() => handleFullscreen(false)}
                >
                  <ExitFullscreenIcon className="h-4 fill-white hover:fill-gray-300" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
};
