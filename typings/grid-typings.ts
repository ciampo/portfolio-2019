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
  dpr: number;
  tileSize: number;
  getDotCoordinate: (tileEdgeEndCoordinate: number, dotSize: number) => number;
};
