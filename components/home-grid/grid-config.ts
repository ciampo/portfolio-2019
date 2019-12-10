import { easeOutQuad, easeInQuart, easeInOutQuad, easeInCubic } from '../utils/easing';
import { GridConfig } from '../../typings';

function getDotCoordinate(tileEdgeEndCoordinate: number, dotSize: number): number {
  return tileEdgeEndCoordinate - dotSize;
}

const gridConfig: GridConfig = {
  // Dot
  dotSize: 1,
  maxDotSize: 32,
  dotSizeEasingFunction: easeInCubic,
  dotSizeResistance: 3.5,
  getDotCoordinate,
  dotPositionResistance: 1 / 20,
  // Tile (grid gap)
  tileSize: 36,
  // Waves
  waveCrestDecay: 200,
  waveCrestVelocity: 6,
  waveCrestEasingFunction: easeOutQuad,
  waveStrengthStrong: 2,
  waveStrengthWeak: 1.5,
  waveMaxOpacity: 0.02,
  waveOpacityEasingFunction: easeInQuart,
  wavePercEasingFunction: easeInOutQuad,
};

export default gridConfig;
