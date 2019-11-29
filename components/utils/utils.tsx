import { CanvasBCR } from '../../typings';

export const joinUrl = (a: string, b: string): string =>
  a.replace(/\/+$/, '') + '/' + b.replace(/^\/+/, '');

export const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

export const customEaseOut = [0.175, 0.85, 0.42, 0.96];

export function getMouseCoordinates(
  evt: MouseEvent,
  canvasBCR: CanvasBCR,
  devicePxRatio = 1
): { x: number; y: number } {
  const toReturn = { x: -1, y: -1 };

  toReturn.x = Math.round(
    ((evt.clientX * devicePxRatio - canvasBCR.left) / (canvasBCR.right - canvasBCR.left)) *
      canvasBCR.width
  );
  toReturn.y = Math.round(
    ((evt.clientY * devicePxRatio - canvasBCR.top) / (canvasBCR.bottom - canvasBCR.top)) *
      canvasBCR.height
  );

  return toReturn;
}

export function getDistance2d(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

export function absMax(x: number, y: number): number {
  return Math.max(Math.abs(x), Math.abs(y));
}

export function createCanvasFullScreenBCR(canvas: HTMLCanvasElement): CanvasBCR {
  return {
    top: 0,
    right: canvas.width,
    bottom: canvas.height,
    left: 0,
    width: canvas.width,
    height: canvas.height,
  };
}

export function getAngleBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

export function bitwiseRound(n: number): number {
  return (0.5 + n) << 0;
}
