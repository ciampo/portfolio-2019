import React, { useEffect, useRef, RefObject, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType } from 'next';
import { throttle } from 'throttle-debounce';

import {
  createGridPoints,
  updateGridPoints,
  growWave,
  isWaveExpired,
  createGridWave,
  computePointsToWavesInfo,
  addWaveToPointsToWavesInfo,
  removeWaveFromPointsToWavesInfo,
} from './grid-logic';
import { drawGrid } from './grid-draw';
import { getDistance2d, absMax, bitwiseRound } from './grid-utils';
import { GridWave, GridPoint, GridPointWavesInfo } from '../../typings';

type HomeGridProps = {
  onInit?: Function;
  onInteraction?: Function;
  onIdle?: Function;
};

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
      fillColorIntervalId = setInterval(updateFillColor, 1000);

      if (ctx) {
        ctx.imageSmoothingEnabled = false;
      }

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

const HomeGrid: NextComponentType<{}, HomeGridProps, HomeGridProps> = ({
  onInit,
  onInteraction,
  onIdle,
}) => {
  // State (updates trigger re-renders) and refs (no re-renders)
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const gridWaves = useRef<GridWave[]>([]);
  const gridPoints = useRef<GridPoint[]>([]);
  const gridPointsToWawesInfo = useRef<GridPointWavesInfo[][]>([]);
  const idleTimerId = useRef<NodeJS.Timeout | null>(null);
  const programmaticWavesTimerId = useRef<NodeJS.Timeout | null>(null);
  const isPointerDown = useRef<boolean>(false);
  const didPointerMoveWhileDown = useRef<boolean>(false);
  const lastPointerDownTime = useRef<number>(0);

  const canvasDiagonal = useMemo(() => getDistance2d(0, 0, canvasWidth, canvasHeight), [
    canvasHeight,
    canvasWidth,
  ]);

  // Canvas drawing loop
  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      dimensions: { width: number; height: number },
      fillColor: string
    ): void => {
      // Update grid points based on the waves
      gridPoints.current = updateGridPoints(
        gridPoints.current,
        gridWaves.current,
        gridPointsToWawesInfo.current
      );

      // Grow waves, remove expired ones.
      gridWaves.current = gridWaves.current
        .map(growWave)
        .map((w, wIndex) => {
          if (isWaveExpired(w)) {
            gridPointsToWawesInfo.current = removeWaveFromPointsToWavesInfo(
              gridPointsToWawesInfo.current,
              gridPoints.current,
              wIndex
            );
          }

          return w;
        })
        .filter((w) => !isWaveExpired(w));

      // Draw current status of the grid
      ctx.fillStyle = fillColor;
      drawGrid(ctx, dimensions, {
        points: gridPoints.current,
        waves: gridWaves.current,
      });
    },
    []
  );

  const canvasRef = useCanvas(draw);

  // Adds a wave to the grid. Throttled every 50ms to avoid overcrowding.
  const addGridWave = useCallback(
    throttle(50, (evt: { clientX: number; clientY: number }, isWeak: boolean): void => {
      const maxX = absMax(evt.clientX, evt.clientX - canvasWidth);
      const maxY = absMax(evt.clientY, evt.clientY - canvasHeight);

      const wave = createGridWave({
        x: evt.clientX,
        y: evt.clientY,
        furthestCornerDistance: Math.sqrt(maxX * maxX + maxY * maxY),
        sketchDiagonal: canvasDiagonal,
        isWeak,
      });

      gridPointsToWawesInfo.current = addWaveToPointsToWavesInfo(
        gridPointsToWawesInfo.current,
        gridPoints.current,
        wave
      );

      gridWaves.current = [...gridWaves.current, wave];
    }),
    [canvasDiagonal, canvasHeight, canvasWidth]
  );

  function stopProgrammaticWaveTimer(): void {
    if (programmaticWavesTimerId.current) {
      clearTimeout(programmaticWavesTimerId.current);
      programmaticWavesTimerId.current = null;
    }
  }

  // The programmatic wave timer waits for a random amount of time
  const startProgrammaticWaveTimer = useCallback((): void => {
    stopProgrammaticWaveTimer();
    programmaticWavesTimerId.current = setTimeout(() => {
      // Avoid waves being added to the grid if the tab isn't in focus
      requestAnimationFrame(() => {
        addGridWave(
          {
            clientX: bitwiseRound(Math.random() * canvasWidth),
            clientY: bitwiseRound(Math.random() * canvasHeight),
          },
          false
        );
        programmaticWavesTimerId.current = null;
        startProgrammaticWaveTimer();
      });
    }, 500 + Math.random() * 2000);
  }, [addGridWave, canvasHeight, canvasWidth]);

  function stopIdleTimer(): void {
    if (idleTimerId.current) {
      clearTimeout(idleTimerId.current);
      idleTimerId.current = null;
    }
  }

  // The idle timer waits for 3 seconds of user inactivity on the grid,
  // before notifying the parent component.
  function startIdleTimer(): void {
    stopIdleTimer();
    idleTimerId.current = setTimeout(() => {
      if (onIdle) {
        onIdle();
      }

      idleTimerId.current = null;
      startProgrammaticWaveTimer();
    }, 3000);
  }

  // Pointer down: notify parent component that interaction occurred.
  function onPointerDown(): void {
    isPointerDown.current = true;
    didPointerMoveWhileDown.current = false;

    stopProgrammaticWaveTimer();
    stopIdleTimer();

    if (idleTimerId.current === null && onInteraction) {
      onInteraction();
    }

    lastPointerDownTime.current = Date.now();
  }

  // Pointer move: add weak wave (if dragging).
  function onPointerMove({ clientX, clientY }: React.PointerEvent<HTMLCanvasElement>): void {
    if (isPointerDown.current) {
      didPointerMoveWhileDown.current = true;
      addGridWave({ clientX, clientY }, true);
    }
  }

  // Pointer up: add strong wave (if click), start idle timer.
  function onPointerUp({ clientX, clientY }: React.PointerEvent<HTMLCanvasElement>): void {
    // Allow for a strong wave to be released if the pointer was pressed down for less than 150ms
    // or if it didn't move at all while down.
    if (Date.now() - lastPointerDownTime.current <= 150 || !didPointerMoveWhileDown.current) {
      addGridWave({ clientX, clientY }, false);
    }

    isPointerDown.current = false;
    startIdleTimer();
  }

  // Programmatic waves, shown when user is idle
  useEffect(() => {
    startProgrammaticWaveTimer();

    return (): void => {
      stopProgrammaticWaveTimer();
    };
  }, [startProgrammaticWaveTimer]);

  // Resize events (set canvas width / height to match its page dimensions)
  useEffect(() => {
    const resizeCanvas = throttle(100, (): void => {
      if (canvasRef && canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasWidth(width);
        setCanvasHeight(height);

        gridPoints.current = createGridPoints(
          {
            width,
            height,
          },
          gridWaves.current
        );

        gridPointsToWawesInfo.current = computePointsToWavesInfo(
          gridPoints.current,
          gridWaves.current
        );
      }
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return (): void => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);

  // Call onInit at component mounting time.
  // This notifies the component host that the grid initialised correctly.
  useEffect(() => {
    if (onInit) {
      onInit();
    }
  }, [onInit]);

  return (
    <canvas
      className="absolute top-0 left-0 w-full h-full z-0 text-primary contain-strict cursor-pointer"
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
};

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
HomeGrid.propTypes = {
  onInit: PropTypes.func,
  onInteraction: PropTypes.func,
  onIdle: PropTypes.func,
};

export default HomeGrid;
