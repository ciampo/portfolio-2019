import gridConfig from './grid-config';
import { GridPoint, GridWave, GridWaveConstructorOptions } from '../../typings';

export function getGridPoints(
  dimensions: { width: number; height: number },
  waves: GridWave[]
): GridPoint[] {
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

export function createGridWave(opts: GridWaveConstructorOptions): GridWave {
  return {
    x: opts.x,
    y: opts.y,
    maxRadius: opts.furthestCornerDistance + gridConfig.waveCrestDecay,
    easingRadius: opts.sketchDiagonal + gridConfig.waveCrestDecay,
    crestAOE: opts.isWeak ? gridConfig.waveCrestDecay / 6 : gridConfig.waveCrestDecay,
    strength: opts.isWeak ? gridConfig.waveStrengthWeak : gridConfig.waveStrengthStrong,
    showPulseHalo: !opts.isWeak,
    crestRadius: 0,
  };
}

export function growWave(wave: GridWave): GridWave {
  return {
    ...wave,
    crestRadius: wave.crestRadius + gridConfig.waveCrestVelocity,
  };
}

export function isWaveExpired(wave: GridWave): boolean {
  return wave.crestRadius >= wave.maxRadius;
}

export function getWaveEasedCrestValue(wave: GridWave): number {
  // Ease against easingRadius, it makes all waves grow with the same speed.
  return gridConfig.waveCrestEasingFunction(wave.crestRadius / wave.easingRadius) * wave.maxRadius;
}
