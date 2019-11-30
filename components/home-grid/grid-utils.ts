export function getDistance2d(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

export function absMax(x: number, y: number): number {
  return Math.max(Math.abs(x), Math.abs(y));
}

export function getAngleBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

export function bitwiseRound(n: number): number {
  return (0.5 + n) << 0;
}
