import { playerRef, VideoPreviewType } from '../video';

type ReducerType = {
  status: string
  volume: number
  duration: number
  buffered: number
  currentTime: number
  percentage: number
  activeSpeed: number
  quality: Array<string>
  activeQuality: string
  activeSubtitle: number | null
  previews: VideoPreviewType[]
  activePreview?: {
    source: string
    description?: string
    time: string
    position: number
  }
  onMouseOver: boolean
  onFullscreen: boolean
}

export function Reducer(state: ReducerType, action: any) {
  switch (action.type) {
    case 'status':
      return { ...state, status: action.status };
    case 'buffered':
      return { ...state, buffered: action.buffered };
    case 'play':
      if (playerRef.current !== null) playerRef.current.play();

      return { ...state, status: 'play' };
    case 'pause':
      if (playerRef.current !== null) playerRef.current.pause();

      return { ...state, status: 'pause' };
    case 'mute':
      if (playerRef.current !== null) playerRef.current.muted = true;

      return { ...state, volume: 0 };
    case 'unmute':
      if (playerRef.current !== null) playerRef.current.muted = false;

      return { ...state, volume: action.volume };
    case 'volume':
      if (playerRef.current !== null) playerRef.current.volume = action.volume;

      return { ...state, volume: action.volume };
    case 'duration':
      return { ...state, duration: action.duration };
    case 'timeUpdate':
      return { ...state, currentTime: action.currentTime, percentage: action.percentage };
    case 'seek':
      if (playerRef.current !== null) playerRef.current.currentTime = action.currentTime;

      return { ...state, currentTime: action.currentTime, percentage: action.percentage };
    case 'finished':
      return { ...state, status: 'finished' };
    case 'error':
      return { ...state, status: 'error' };
    case 'quality':
      return { ...state, quality: action.quality };
    case 'activeQuality':
      if (action.source !== undefined && playerRef.current !== null) {
        playerRef.current.src = action.source;
        playerRef.current.currentTime = action.currentTime;
        playerRef.current.load();
        playerRef.current.play();
        playerRef.current.playbackRate = action.speed;
      }

      return { ...state, activeQuality: action.activeQuality };
    case 'speed':
      if (playerRef.current !== null) playerRef.current.playbackRate = action.speed;

      return { ...state, activeSpeed: action.speed };
    case 'activePreview':
      return {
        ...state,
        activePreview: {
          source: action.source,
          description: action.description,
          time: action.time,
          position: action.position,
        },
      };
    case 'onFullscreen':
      return { ...state, onFullscreen: action.onFullscreen };
    case 'onMouseOver':
      return { ...state, onMouseOver: true };
    case 'onMouseLeave':
      return { ...state, onMouseOver: false };
    case 'activeSubtitle':
      return { ...state, activeSubtitle: action.activeSubtitle };
    default:
      return state;
  }
}
