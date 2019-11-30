import gridConfig from './grid-config';
import { getAngleBetweenPoints, getDistance2d } from './grid-utils';
import { GridPoint, GridPointWavesInfo, GridWave, GridWaveConstructorOptions } from '../../typings';

// Waves
export function growWave(wave: GridWave): GridWave {
  return {
    ...wave,
    crestRadius: wave.crestRadius + gridConfig.waveCrestVelocity,
  };
}

export function isWaveExpired(wave: GridWave): boolean {
  return wave.crestRadius >= wave.maxRadius;
}

export function createGridWave(opts: GridWaveConstructorOptions): GridWave {
  return {
    x: opts.x,
    y: opts.y,
    maxRadius: opts.furthestCornerDistance + gridConfig.waveCrestDecay * 1.5,
    easingRadius: opts.sketchDiagonal + gridConfig.waveCrestDecay,
    crestAOE: opts.isWeak ? gridConfig.waveCrestDecay / 6 : gridConfig.waveCrestDecay,
    strength: opts.isWeak ? gridConfig.waveStrengthWeak : gridConfig.waveStrengthStrong,
    showPulseHalo: !opts.isWeak,
    crestRadius: 0,
  };
}

export function getWaveEasedCrestValue(wave: GridWave): number {
  // Ease against easingRadius, it makes all waves grow with the same speed.
  return gridConfig.waveCrestEasingFunction(wave.crestRadius / wave.easingRadius) * wave.maxRadius;
}

// Points
function computePointToWaveInfo(p: GridPoint, w: GridWave): GridPointWavesInfo {
  return {
    distance: getDistance2d(p.originX, p.originY, w.x, w.y),
    angle: getAngleBetweenPoints(p.originX, p.originY, w.x, w.y),
  };
}

export function computePointsToWavesInfo(
  gridPoints: GridPoint[],
  waves: GridWave[]
): GridPointWavesInfo[][] {
  return gridPoints.map((p) => waves.map((w) => computePointToWaveInfo(p, w)));
}

export function addWaveToPointsToWavesInfo(
  gridPointsToWavesInfo: GridPointWavesInfo[][],
  gridPoints: GridPoint[],
  wave: GridWave
): GridPointWavesInfo[][] {
  return gridPointsToWavesInfo.map((gpwi, pIndex) => {
    return [...gpwi, computePointToWaveInfo(gridPoints[pIndex], wave)];
  });
}

export function removeWaveFromPointsToWavesInfo(
  gridPointsToWavesInfo: GridPointWavesInfo[][],
  gridPoints: GridPoint[],
  waveIndex: number
): GridPointWavesInfo[][] {
  return gridPointsToWavesInfo.map((gpwi) => {
    return [...gpwi.slice(0, waveIndex), ...gpwi.slice(waveIndex + 1)];
  });
}

export function createGridPoints(
  dimensions: { width: number; height: number },
  waves: GridWave[]
): GridPoint[] {
  const toReturn = [];

  const numCols = Math.floor(dimensions.width / gridConfig.tileSize);
  const numRows = Math.floor(dimensions.height / gridConfig.tileSize);

  for (let colI = 0; colI < numCols; colI += 1) {
    for (let rowI = 0; rowI < numRows; rowI += 1) {
      const x = gridConfig.getDotCoordinate((colI + 1) * gridConfig.tileSize, gridConfig.dotSize);
      const y = gridConfig.getDotCoordinate((rowI + 1) * gridConfig.tileSize, gridConfig.dotSize);
      toReturn.push({
        originX: x,
        originY: y,
        displayX: x,
        displayY: y,
        size: gridConfig.dotSize,
        wavesInfo: Array(waves.length).fill(null),
      });
    }
  }

  return toReturn;
}

export function updateGridPoints(
  points: GridPoint[],
  waves: GridWave[],
  pointToWavesInfo: GridPointWavesInfo[][]
): GridPoint[] {
  let distFromCrest, displayDiffFactor;

  return points.map((p, pIndex) => {
    p.displayX = p.originX;
    p.displayY = p.originY;
    p.size = gridConfig.dotSize;

    waves.forEach((wave, wIndex) => {
      const { distance: distFromWave, angle: angleFromWave } = pointToWavesInfo[pIndex][wIndex];

      distFromCrest = Math.abs(distFromWave - getWaveEasedCrestValue(wave));

      if (distFromCrest <= wave.crestAOE) {
        displayDiffFactor =
          gridConfig.dotPositionResistance *
          gridConfig.wavePercEasingFunction((wave.crestAOE - distFromCrest) / wave.crestAOE) *
          wave.crestAOE *
          wave.strength;

        p.displayX -= displayDiffFactor * Math.cos(angleFromWave);
        p.displayY -= displayDiffFactor * Math.sin(angleFromWave);

        p.size +=
          gridConfig.dotSizeResistance *
          gridConfig.dotSizeEasingFunction(1 - distFromCrest / wave.crestAOE) *
          wave.strength;
      }
    });

    p.size = Math.min(p.size, gridConfig.maxDotSize);

    p.displayX -= p.size / 2;
    p.displayY -= p.size / 2;

    return p;
  });
}
