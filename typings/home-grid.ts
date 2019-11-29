export type GridPoint = {
  displayX: number;
  displayY: number;
  size: number;
};

export type CanvasBCR = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

export type GridConfig = {
  dotSize: number;
  maxDotSize: number;
  dpr: number;
  tileSize: number;
  getDotCoordinate: (tileEdgeEndCoordinate: number, dotSize: number) => number;
  waveCrestDecay: number;
  waveCrestVelocity: number;
  waveCrestEasingFunction: (x: number) => number;
  waveStrengthStrong: number;
  waveStrengthWeak: number;
  waveMaxOpacity: number;
  waveOpacityEasingFunction: (x: number) => number;
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
