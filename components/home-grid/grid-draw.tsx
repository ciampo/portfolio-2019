import gridConfig from './grid-config';
import { getWaveEasedCrestValue } from './grid-logic';
import { bitwiseRound } from './grid-utils';
import { GridPoint, GridWave } from '../../typings';

const DPR = 1;

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  dimensions: { width: number; height: number },
  gridState: { points: GridPoint[]; waves: GridWave[] }
): void {
  // Clear the canvas
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

  // Draw all dots in one drawing pass.
  ctx.beginPath();
  gridState.points.forEach((p) => {
    ctx.moveTo(p.displayX * DPR, p.displayY * DPR);
    ctx.lineTo(bitwiseRound((p.displayX + p.size) * DPR), bitwiseRound(p.displayY * DPR));
    ctx.lineTo(
      bitwiseRound((p.displayX + p.size) * DPR),
      bitwiseRound((p.displayY + p.size) * DPR)
    );
    ctx.lineTo(bitwiseRound(p.displayX * DPR), bitwiseRound((p.displayY + p.size) * DPR));
    ctx.lineTo(bitwiseRound(p.displayX * DPR), bitwiseRound(p.displayY * DPR));
  });
  ctx.fill();

  // Save ctx, as drawing the waves will require changes to the globalAlpha.
  ctx.save();

  // Draw each wave's pulse ratio.
  gridState.waves.forEach((wave) => {
    if (wave.showPulseHalo) {
      // Draw wave pulse. Opacity gets lower as the wave grows.
      const crestR = getWaveEasedCrestValue(wave);
      const normalisedHalfCrest = crestR / (wave.easingRadius / 2);

      if (normalisedHalfCrest < 1) {
        // Using toFixed() prevents bug in Safari where the ripple
        // would flash just before being removed.
        ctx.globalAlpha = Number(
          (
            gridConfig.waveMaxOpacity *
            gridConfig.waveOpacityEasingFunction(1 - normalisedHalfCrest)
          ).toFixed(3)
        );

        ctx.beginPath();
        ctx.arc(wave.x * DPR, wave.y * DPR, crestR * DPR, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      }
    }
  });

  // Restore ctx to what it used to be before draing the waves.
  ctx.restore();
}
