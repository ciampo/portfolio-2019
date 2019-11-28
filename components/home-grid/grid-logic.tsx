import gridConfig from './grid-config';
import { GridPoint } from '../../typings';

export function getGridPoints(dimensions: { width: number; height: number }): GridPoint[] {
  const toReturn = [];

  const numCols = Math.floor(dimensions.width / gridConfig.tileSize);
  const numRows = Math.floor(dimensions.height / gridConfig.tileSize);

  for (let colI = 0; colI < numCols; colI += 1) {
    for (let rowI = 0; rowI < numRows; rowI += 1) {
      toReturn.push({
        displayX: gridConfig.getDotCoordinate((colI + 1) * gridConfig.tileSize, gridConfig.dotSize),
        displayY: gridConfig.getDotCoordinate((rowI + 1) * gridConfig.tileSize, gridConfig.dotSize),
        size: gridConfig.dotSize,
      });
    }
  }

  return toReturn;
}
