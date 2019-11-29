import gridConfig from './grid-config';
import { getAngleBetweenPoints, getDistance2d } from './grid-utils';
import { GridPoint, GridPointWavesInfo, GridWave, GridWaveConstructorOptions } from '../../typings';

// Waves
function growWave(wave: GridWave): GridWave {
  return {
    ...wave,
    crestRadius: wave.crestRadius + gridConfig.waveCrestVelocity,
  };
}

function isWaveExpired(wave: GridWave): boolean {
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

export function evolveWaves(waves: GridWave[]): GridWave[] {
  return [...waves.map(growWave).filter((w) => !isWaveExpired(w))];
}

export function getWaveEasedCrestValue(wave: GridWave): number {
  // Ease against easingRadius, it makes all waves grow with the same speed.
  return gridConfig.waveCrestEasingFunction(wave.crestRadius / wave.easingRadius) * wave.maxRadius;
}

// Points
function getWaveInfo(gridPoint: GridPoint, waveIndex: number, wave: GridWave): GridPointWavesInfo {
  // if (gridPoint.wavesInfo[waveIndex] === null) {
  //   gridPoint.wavesInfo[waveIndex] = {
  //     distance: getDistance2d(gridPoint.originX, gridPoint.originY, wave.x, wave.y),
  //     angle: getAngleBetweenPoints(gridPoint.originX, gridPoint.originY, wave.x, wave.y),
  //   };
  // }

  //   return gridPoint.wavesInfo[waveIndex] as GridPointWavesInfo;

  return {
    distance: getDistance2d(gridPoint.originX, gridPoint.originY, wave.x, wave.y),
    angle: getAngleBetweenPoints(gridPoint.originX, gridPoint.originY, wave.x, wave.y),
  };
}

// function addWaveInfo() {

// }

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

export function updateGridPoints(points: GridPoint[], waves: GridWave[]): GridPoint[] {
  let distFromCrest, displayDiffFactor;

  return points.map((p) => {
    p.displayX = p.originX;
    p.displayY = p.originY;
    p.size = gridConfig.dotSize;

    waves.forEach((wave, wIndex) => {
      const { distance: distFromWave, angle: angleFromWave } = getWaveInfo(p, wIndex, wave);

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
