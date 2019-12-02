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

export function createGridPoints(dimensions: { width: number; height: number }): GridPoint[] {
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
      });
    }
  }

  return toReturn;
}

export function updateGridPoints(points: GridPoint[], waves: GridWave[]): GridPoint[] {
  let distFromCrest, displayDiffFactor;

  return points.map((point) => {
    point.displayX = point.originX;
    point.displayY = point.originY;
    point.size = gridConfig.dotSize;

    waves.forEach((wave) => {
      const { distance: distFromWave, angle: angleFromWave } = computePointToWaveInfo(point, wave);

      distFromCrest = Math.abs(distFromWave - getWaveEasedCrestValue(wave));

      if (distFromCrest <= wave.crestAOE) {
        displayDiffFactor =
          gridConfig.dotPositionResistance *
          gridConfig.wavePercEasingFunction((wave.crestAOE - distFromCrest) / wave.crestAOE) *
          wave.crestAOE *
          wave.strength;

        point.displayX -= displayDiffFactor * Math.cos(angleFromWave);
        point.displayY -= displayDiffFactor * Math.sin(angleFromWave);

        point.size +=
          gridConfig.dotSizeResistance *
          gridConfig.dotSizeEasingFunction(1 - distFromCrest / wave.crestAOE) *
          wave.strength;
      }
    });

    point.size = Math.min(point.size, gridConfig.maxDotSize);

    point.displayX -= point.size / 2;
    point.displayY -= point.size / 2;

    return point;
  });
}
