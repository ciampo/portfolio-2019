import React, { useEffect, useRef, RefObject, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType } from 'next';

import { getGridPoints, growWave, isWaveExpired, createGridWave } from './grid-logic';
import { drawGrid } from './grid-draw';
import { getDistance2d, absMax } from '../utils/utils';
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
  const gridWaves = useRef<GridWave[]>([]);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const canvasDiagonal = useMemo(() => getDistance2d(0, 0, canvasWidth, canvasHeight), [
    canvasHeight,
    canvasWidth,
  ]);

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      dimensions: { width: number; height: number },
      fillColor: string
    ): void => {
      // Draw current status of the grid
      ctx.fillStyle = fillColor;
      drawGrid(ctx, dimensions, {
        // Compute points based on canvas dimensions and active waves.
        points: getGridPoints(dimensions, gridWaves.current),
        waves: gridWaves.current,
      });

      // Grow waves, remove expired ones.
      gridWaves.current = [...gridWaves.current.map(growWave).filter((w) => !isWaveExpired(w))];
    },
    [gridWaves]
  );

  const canvasRef = useCanvas(draw);

  // Call onInit at component mounting time.
  // This notifies the component host that the grid initialised correctly.
  useEffect(() => {
    onInit();
  }, [onInit]);

  const addGridWave = useCallback(
    (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void => {
      const maxX = absMax(evt.clientX, evt.clientX - canvasWidth);
      const maxY = absMax(evt.clientY, evt.clientY - canvasHeight);

      gridWaves.current = [
        ...gridWaves.current,
        createGridWave({
          x: evt.clientX,
          y: evt.clientY,
          furthestCornerDistance: Math.sqrt(maxX * maxX + maxY * maxY),
          sketchDiagonal: canvasDiagonal,
          isWeak: false,
        }),
      ];
    },
    [canvasDiagonal, canvasHeight, canvasWidth]
  );

  function stopIdleTimer(): void {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }
  }

  function startIdleTimer(): void {
    stopIdleTimer();
    timerId.current = setTimeout(() => {
      onIdle();
      timerId.current = null;
    }, 3000);
  }

  function onCanvasMouseUp(evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
    addGridWave(evt);
    startIdleTimer();
  }

  function onCanvasMouseDown(): void {
    if (timerId.current === null) {
      onInteraction();
    }

    stopIdleTimer();
  }

  // Resize events (set canvas width / height to match its page dimensions)
  useEffect(() => {
    function resizeCanvas(): void {
      if (canvasRef && canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasWidth(width);
        setCanvasHeight(height);
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
      className="absolute top-0 left-0 w-full h-full z-0 text-primary contain-strict"
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseUp={onCanvasMouseUp}
      onMouseDown={onCanvasMouseDown}
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
