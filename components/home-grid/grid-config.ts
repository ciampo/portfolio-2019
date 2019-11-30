import { easeOutQuad, easeInQuart, easeInOutQuad, easeInCubic } from '../utils/easing';
import { GridConfig } from '../../typings';

function getDotCoordinate(tileEdgeEndCoordinate: number, dotSize: number): number {
  return tileEdgeEndCoordinate - dotSize;
}

const gridConfig: GridConfig = {
  // Dot
  dotSize: 2,
  maxDotSize: 16,
  dotSizeEasingFunction: easeInCubic,
  dotSizeResistance: 3.5,
  getDotCoordinate,
  dotPositionResistance: 1 / 20,
  // Tile (grid gap)
  tileSize: 32,
  // Waves
  waveCrestDecay: 200,
  waveCrestVelocity: 8,
  waveCrestEasingFunction: easeOutQuad,
  waveStrengthStrong: 2.5,
  waveStrengthWeak: 0.9,
  waveMaxOpacity: 0.02,
  waveOpacityEasingFunction: easeInQuart,
  wavePercEasingFunction: easeInOutQuad,
};

export default gridConfig;
