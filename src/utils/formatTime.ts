function padTo2Digits(num: string): string {
  return num.toString().padStart(2, '0');
}

export function timeToSecond(d: string): number {
  const time = d.split(':');
  const seconds = parseInt(time[0]) * 60 + parseInt(time[1]);

  return seconds;
}

export function secondToTime(d: number): string {
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 3600 % 60);

  return `${m}:${padTo2Digits(`${s}`)}`;
}
