export type GridPointWavesInfo = {
  distance: number;
  angle: number;
};

export type GridPoint = {
  originX: number;
  originY: number;
  displayX: number;
  displayY: number;
  size: number;
  wavesInfo: (GridPointWavesInfo | null)[];
};

export type GridConfig = {
  dotSize: number;
  maxDotSize: number;
  tileSize: number;
  getDotCoordinate: (tileEdgeEndCoordinate: number, dotSize: number) => number;
  waveCrestDecay: number;
  waveCrestVelocity: number;
  waveCrestEasingFunction: (x: number) => number;
  waveStrengthStrong: number;
  waveStrengthWeak: number;
  waveMaxOpacity: number;
  waveOpacityEasingFunction: (x: number) => number;
  wavePercEasingFunction: (x: number) => number;
  dotSizeEasingFunction: (x: number) => number;
  dotPositionResistance: number;
  dotSizeResistance: number;
};

export type GridWaveConstructorOptions = {
  x: number;
  y: number;
  furthestCornerDistance: number;
  sketchDiagonal: number;
  isWeak: boolean;
};

export type GridWave = {
  x: number;
  y: number;
  maxRadius: number;
  easingRadius: number;
  crestAOE: number;
  strength: number;
  showPulseHalo: boolean;
  crestRadius: number;
};
