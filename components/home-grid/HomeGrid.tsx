import React, { useEffect, useRef, RefObject, useState } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType } from 'next';

import { getGridPoints, growWave, isWaveExpired } from './grid-logic';
import { drawGrid } from './grid-draw';
import { getDistance2d } from '../utils/utils';
import { GridWave } from '../../typings';

function useCanvas(draw: Function): RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [fillColor, setFillColor] = useState('#000');

  useEffect(() => {
    let animationFrameId: number;
    let fillColorIntervalId: NodeJS.Timeout;

    if (canvasRef && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      // Read the 'color' css property on the canvas element and use it
      // for the ctx fillColor.
      // Do the check ones at setup time, and then check  every 500ms,
      // as this really just changes only when the theme changes
      const updateFillColor = (): void => {
        if (canvasRef && canvasRef.current) {
          const computedStyles = window.getComputedStyle(canvasRef.current);
          if (computedStyles && computedStyles.color) {
            setFillColor(computedStyles.color);
          }
        }
      };

      updateFillColor();
      fillColorIntervalId = setInterval(updateFillColor, 500);

      // Rendering loop using rAF.
      const renderFrame = (): void => {
        if (canvasRef && canvasRef.current) {
          animationFrameId = requestAnimationFrame(renderFrame);
          draw(
            ctx,
            { width: canvasRef.current.width, height: canvasRef.current.height },
            fillColor
          );
        }
      };

      animationFrameId = requestAnimationFrame(renderFrame);
    }

    return (): void => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(fillColorIntervalId);
    };
  }, [draw, fillColor]);

  return canvasRef;
}

type HomeGridProps = {
  onInit: Function;
  onInteraction: Function;
  onIdle: Function;
};

const HomeGrid: NextComponentType<{}, HomeGridProps, HomeGridProps> = ({
  onInit,
  onInteraction,
  onIdle,
}) => {
  // State and refs
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasDiagonal, setCanvasDiagonal] = useState(0);
  const [gridWaves, setGridWaves] = useState<GridWave[]>([]);

  function draw(
    ctx: CanvasRenderingContext2D,
    dimensions: { width: number; height: number },
    fillColor: string
  ): void {
    // Compute grid state based on canvas size and waves
    const gridState = {
      points: getGridPoints(dimensions, gridWaves),
      waves: gridWaves,
    };

    // console.log(gridWaves);

    // Draw current status of the grid
    ctx.fillStyle = fillColor;
    drawGrid(ctx, dimensions, gridState);

    // Grow waves, remove expired ones.
    setGridWaves([...gridWaves.map(growWave).filter((w) => !isWaveExpired(w))]);
  }

  // function appendWave(wave: GridWave) {
  //   setGridWaves([...gridWaves, wave]);
  // }

  const canvasRef = useCanvas(draw);

  // Call onInit at component mounting time.
  // This notifies the component host that the grid initialised correctly.
  useEffect(() => {
    onInit();
  }, [onInit]);

  // User interactions, onInteraction/onIdle callbacks
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    // function addGridWave(evt: MouseEvent): void {
    //   const maxX = absMax(evt.clientX, evt.clientX - canvasWidth);
    //   const maxY = absMax(evt.clientY, evt.clientY - canvasHeight);

    //   appendWave(
    //     createGridWave({
    //       x: evt.clientX,
    //       y: evt.clientY,
    //       furthestCornerDistance: Math.sqrt(maxX * maxX + maxY * maxY),
    //       sketchDiagonal: canvasDiagonal,
    //       isWeak: false,
    //     })
    //   );

    //   console.log(maxX, maxY);
    // }

    function stopIdleTimer(): void {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    }

    function startIdleTimer(): void {
      stopIdleTimer();
      timerId = setTimeout(() => {
        onIdle();
        timerId = null;
      }, 5000);
    }

    function onCanvasMouseUp(evt: MouseEvent): void {
      // addGridWave(evt);
      startIdleTimer();
    }

    function onCanvasMouseDown(): void {
      if (timerId === null) {
        onInteraction();
      }

      stopIdleTimer();
    }

    let canvasEl: HTMLCanvasElement;
    if (canvasRef && canvasRef.current) {
      canvasEl = canvasRef.current;
      canvasEl.addEventListener('mouseup', onCanvasMouseUp);
      canvasEl.addEventListener('mousedown', onCanvasMouseDown);
    }

    return (): void => {
      stopIdleTimer();

      if (canvasEl) {
        canvasEl.removeEventListener('mouseup', onCanvasMouseUp);
        canvasEl.removeEventListener('mousedown', onCanvasMouseDown);
      }
    };
  }, [canvasRef, onIdle, onInteraction]);

  // Resize events (set canvas width / height to match its page dimensions)
  useEffect(() => {
    function resizeCanvas(): void {
      if (canvasRef && canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasWidth(width);
        setCanvasHeight(height);
        setCanvasDiagonal(getDistance2d(0, 0, width, height));
      }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return (): void => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);

  return (
    <canvas
      className="absolute top-0 left-0 w-full h-full z-0 text-primary"
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
HomeGrid.propTypes = {
  onInit: PropTypes.func.isRequired,
  onInteraction: PropTypes.func.isRequired,
  onIdle: PropTypes.func.isRequired,
};

export default HomeGrid;
