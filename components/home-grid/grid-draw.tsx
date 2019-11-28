import { bitwiseRound } from '../utils/utils';
import { GridPoint } from '../../typings';

const DPR = 1;

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  dimensions: { width: number; height: number },
  gridState: { points: GridPoint[] }
): void {
  ctx.clearRect(0, 0, dimensions.width, dimensions.height);

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
}
