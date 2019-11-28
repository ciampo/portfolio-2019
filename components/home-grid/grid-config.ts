import { GridConfig } from '../../typings';

function getDotCoordinate(tileEdgeEndCoordinate: number, dotSize: number): number {
  return tileEdgeEndCoordinate - dotSize;
}

const gridConfig: GridConfig = {
  dotSize: 1,
  dpr: 1,
  tileSize: 32,
  getDotCoordinate,
};

export default gridConfig;
