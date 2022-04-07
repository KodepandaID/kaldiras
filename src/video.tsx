import React, {
  createRef, useReducer, useLayoutEffect, useState,
} from 'react';
import { Controls } from './components/Controls';
import { PlayIcon } from './components/icons/Play';
import { TailwindColor } from './components/tailwind/TailwindColor';
import { Subtitle, SubtitleSize } from './components/Subtitle';
import { VideoContext, ContextType } from './context/provider';
import { Reducer } from './reducer/reducer';
import { videoCSS } from './styles/style';

type VideoProps = {
  color?: 'white' | 'black' | 'gray' | 'zinc' | 'slate' | 'stone' | 'neutral' | 'red' | 'yellow' | 'orange' | 'amber' | 'lime' | 'green' | 'blue' | 'sky' | 'indigo' | 'purple' | 'pink' | 'emerald' | 'teal' | 'cyan' | 'fuchsia' | 'violet' | 'rose'
  colorContrast?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  autoPlay?: boolean
  sources: VideoSourceType[]
  subtitles?: VideoSubtitleType[]
  subtitleSize?: SubtitleSize
  previews?: VideoPreviewType[]
  poster?: string
  width?: string
  height?: string
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: (ended: boolean) => void
}

type VideoSourceType = {
  source: string
  type: 'video/mp4' | 'video/webm' | 'video/ogg' | 'video/quicktime'
  resolution: '360' | '480' | '576' | '720' | '1080' | '1440' | '2160'
  default?: boolean
}

export type VideoSubtitleType = {
  label: string
  lang: string
  source: string
  default?: boolean
}

export type VideoPreviewType = {
  source: string
  description?: string
  time: string
}

export const playerRef = createRef<HTMLVideoElement>();

export const Video: React.FC<VideoProps> = (props) => {
  const [showSpinner, setShowSpinner] = useState(false);

  const [data, dispatch] = useReducer(Reducer, {
    status: props.autoPlay ? 'play' : '',
    volume: 1,
    buffered: 0,
    duration: 0,
    currentTime: 0,
    percentage: 0,
    activeSpeed: 1,
    quality: [],
    activeQuality: '',
    activeSubtitle: null,
    previews: props.previews === undefined ? [] : props.previews,
    onFullscreen: false,
    onMouseOver: false,
  });

  const context: ContextType = { ...data, dispatch };

  useLayoutEffect(() => {
    if (props.subtitles !== undefined) {
      props.subtitles.map((s, idx) => {
        if (s.default) dispatch({ type: 'activeSubtitle', activeSubtitle: idx });
      });
    }
    dispatch({ type: 'quality', quality: props.sources });

    if (playerRef.current !== null) {
      const sources = props.sources.filter((c) => c.default === true);
      if (sources.length > 0) {
        playerRef.current.src = sources[0].source;
        dispatch({ type: 'activeQuality', activeQuality: sources[0].resolution });
      } else {
        playerRef.current.src = `${props.sources[0].source}`;
        playerRef.current.load();
        dispatch({ type: 'activeQuality', activeQuality: props.sources[0].resolution });
      }
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let volume: number;
    let ct: number;
    let percentage: number;

    switch (e.keyCode) {
      case 32:
        if (data.status === 'play') dispatch({ type: 'pause' });
        else dispatch({ type: 'play' });
        return;
      case 38:
        volume = data.volume + 0.05;
        dispatch({ type: 'volume', volume: volume >= 1 ? 1 : volume });
        return;
      case 40:
        volume = data.volume - 0.05;
        dispatch({ type: 'volume', volume: volume >= 0 ? volume : 0 });
        return;
      case 39:
        ct = data.currentTime + 5;
        percentage = data.percentage + 5;

        if (percentage < 100) {
          dispatch({
            type: 'seek',
            currentTime: ct,
            percentage,
          });
        }
        return;
      case 37:
        ct = data.currentTime - 5;
        percentage = data.percentage - 5;

        if (percentage >= 0) {
          dispatch({
            type: 'seek',
            currentTime: ct,
            percentage,
          });
        }

      default:
    }
  };

  return (
    <VideoContext.Provider value={context}>
      <div
        id="kaldiras-container"
        dir="ltr"
        tabIndex={0}
        className={`relative bg-black overflow-hidden box-border flex flex-col items-center antialiased z-0 font-normal leading-relaxed`}
        style={{
          width: props.width,
          height: props.height,
          transition: 'all .3s ease'
        }}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => dispatch({ type: 'onMouseOver' })}
        onMouseLeave={() => dispatch({ type: 'onMouseLeave' })}
      >

        {data.status !== 'error' && (<Subtitle color="white" size={props.subtitleSize} />)}

        <Controls
          color={props.color}
          colorContrast={props.colorContrast}
          subtitle={props.subtitles}
        />

        <div
          id="player"
          className="relative w-[100%] h-[100%] m-auto overflow-hidden"
          onClick={() => {
            if (data.status === 'play') dispatch({ type: 'pause' });
            else if (data.status === 'pause') dispatch({ type: 'play' });
          }}
        >
          <video
            preload="true"
            autoPlay={props.autoPlay}
            ref={playerRef}
            id="kaldiras-player"
            className={videoCSS}
            crossOrigin=""
            playsInline
            data-poster={props.poster}
            onError={() => dispatch({ type: 'error' })}
            onProgress={(e) => {
              const buf = e.currentTarget.buffered;
              const { duration } = e.currentTarget;

              if (buf.length > 0) {
                const bufEnd = buf.end(buf.length - 1);
                const buffered = ((bufEnd / duration) * 100);
                dispatch({ type: 'buffered', buffered });
              }
            }}
            onTimeUpdate={(e) => {
              const ct = e.currentTarget.currentTime;

              if (ct === data.currentTime && ct > 0) setShowSpinner(true);
              else setShowSpinner(false);

              dispatch({ type: 'timeUpdate', currentTime: ct, percentage: ct === 0 ? 0 : (ct / data.duration) * 100 });
              if (props.onTimeUpdate !== undefined) props.onTimeUpdate(ct);
            }}
            onEnded={() => {
              dispatch({ type: 'finished' });
              if (props.onEnded !== undefined) props.onEnded(true);
            }}
            onLoadedMetadata={(e) => dispatch({ type: 'duration', duration: e.currentTarget.duration })}
          >
            {props.sources.map((s, idx) => (
              <source key={idx} src={s.source} type={s.type} sizes={s.resolution} />
            ))}

            {props.subtitles !== undefined && (
              props.subtitles.map((s, idx) => (
                <track key={idx} kind="captions" label={s.label} srcLang={s.lang} src={s.source} default={s.default} />
              ))
            )}
          </video>
          {props.poster !== undefined && (
            <img
              src={props.poster}
              onError={(e) => {
                e.currentTarget.hidden = true;
              }}
              className={`w-[100%] h-[100%] absolute top-0 left-0 ${(data.status === '' || data.status === 'error') ? 'opacity-100' : 'opacity-0'} z-10 bg-black bg-center bg-contain bg-no-repeat`}
              style={{ transition: 'opacity .2s ease' }}
            />
          )}
        </div>

        <button
          className={`w-12 h-12 ${(data.status === '' || data.status === 'error') ? 'opacity-100' : 'opacity-0'} shrink-0 flex items-center justify-center rounded-full absolute left-[50%] top-[50%] z-30`}
          style={{ transform: 'translate(-50%,-50%)', transition: '.3s', backgroundColor: TailwindColor(props.color, props.colorContrast) }}
          onClick={() => {
            if (data.status !== 'error') dispatch({ type: 'play' });
          }}
        >
          <PlayIcon className="h-5 fill-white" />
        </button>

        {showSpinner && (
          <div className="flex items-center justify-center absolute left-[50%] top-[50%] z-50">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {data.status === 'error' && (
          <div className="w-max bg-black absolute top-1 z-50" style={{ transition: 'all .3s ease-in' }}>
            <p className="text-xs text-white antialiased px-5 py-0.5">An error occurred. The player cannot load the source video</p>
          </div>
        )}
      </div>
    </VideoContext.Provider>
  );
};

Video.defaultProps = {
  width: "852px",
  height: "480px",
  color: 'blue',
  colorContrast: 600,
  subtitleSize: 'normal'
};
