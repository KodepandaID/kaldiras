import { css } from '@emotion/css';
import { TailwindColor } from '../components/tailwind/TailwindColor';

export function rangeSliderCSS(color: string | undefined, colorContrast: number | undefined, progress: number, progressBuffer?: number) {
  return css`
    -webkit-appearance: none;
    -moz-apperance: none;
    cursor: pointer;
    border-radius: 6px;
    width: ${progressBuffer !== undefined ? `${progressBuffer}%` : 'auto'};
    height: 0.25rem;

    ${(progressBuffer === undefined || progress >= progressBuffer) ? `
      background-image: -webkit-gradient(linear,
      left top,
      right top,
      color-stop(${progress}%, ${TailwindColor(color, colorContrast)}),
      color-stop(${progress}%, ${TailwindColor("gray", 400)}));

      background-image: -moz-linear-gradient(left center,
        ${TailwindColor(color, colorContrast)} 0%, ${TailwindColor(color, colorContrast)} ${progress}%,
        ${TailwindColor("gray", 400)} ${progress}%, ${TailwindColor("gray", 400)} 100%);`
    : `
    background-image: -webkit-gradient(linear,
      left top,
      right top,
      color-stop(${progress}%, ${TailwindColor(color, colorContrast)}),
      color-stop(${progressBuffer}%, ${TailwindColor("gray", 400)}));

      background-image: -moz-linear-gradient(left center,
        ${TailwindColor(color, colorContrast)} 0%, ${TailwindColor(color, colorContrast)} ${progress}%,
        ${TailwindColor("gray", 300)} ${progressBuffer}%, ${TailwindColor("gray", 400)} 100%);
    `}

    &::-moz-range-track {
      border: none;
      background: none;
      outline: none;
    }
    &:focus {
      outline: none;
      border: none;
    }
    &::-webkit-slider-thumb {
      position: relative;
      appearance: none;
      height: 10px;
      width: 10px;
      background: transparent;
      border-radius: 100%;
      border: 0;
      top: 50%;
      transition: background-color 150ms;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none !important;
    }
    &::-moz-range-thumb {
      -moz-appearance: none !important;
    }`;
}

export const videoCSS = css`
width: 100%;
height: 100%;
::-webkit-media-text-track-container {
  display: none;
}
::-webkit-media-controls {
  display: none;
}`;
