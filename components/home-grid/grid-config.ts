import { GridConfig } from '../../typings';

function getDotCoordinate(tileEdgeEndCoordinate: number, dotSize: number): number {
  return tileEdgeEndCoordinate - dotSize;
}

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

function easeInQuart(t: number): number {
  return t * t * t * t;
}

const gridConfig: GridConfig = {
  dotSize: 2,
  maxDotSize: 16,
  dpr: 1,
  tileSize: 32,
  getDotCoordinate,
  // Waves
  waveCrestDecay: 200,
  waveCrestVelocity: 8,
  waveCrestEasingFunction: easeOutQuad,
  waveStrengthStrong: 2.5,
  waveStrengthWeak: 0.7,
  waveMaxOpacity: 0.02,
  waveOpacityEasingFunction: easeInQuart,
};

export default gridConfig;
