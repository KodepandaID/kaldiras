import React, { useContext, createContext } from 'react';
import { VideoPreviewType } from '../video';

export type ContextType = {
  status: string
  volume: number
  duration: number
  buffered: number
  currentTime: number
  percentage: number
  dispatch: React.Dispatch<any>
  activeSpeed: number
  quality: Array<string>
  activeQuality: string
  activeSubtitle?: number | null
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

export const VideoContext = createContext<ContextType | null>(null);

export const useVideoContext = () => useContext(VideoContext);
