import React, {
  useEffect,
  useRef,
  RefObject,
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { NextComponentType } from 'next';
import { throttle } from 'throttle-debounce';

import {
  createGridPoints,
  updateGridPoints,
  growWave,
  isWaveExpired,
  createGridWave,
} from './grid-logic';
import { drawGrid } from './grid-draw';
import { getDistance2d, absMax, bitwiseRound } from './grid-utils';
import { ThemeContext } from '../utils/ThemeContext';
import { GridWave, GridPoint } from '../../typings';

type HomeGridProps = {
  onInit?: Function;
  onInteraction?: Function;
  onIdle?: Function;
};

function useCanvas(draw: Function): RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    if (canvasRef && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
      }

      // Rendering loop using rAF.
      const renderFrame = (): void => {
        if (canvasRef && canvasRef.current) {
          animationFrameId = requestAnimationFrame(renderFrame);
          draw(ctx, { width: canvasRef.current.width, height: canvasRef.current.height });
        }
      };

      animationFrameId = requestAnimationFrame(renderFrame);
    }

    return (): void => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

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
  const idleTimerId = useRef<NodeJS.Timeout | null>(null);
  const programmaticWavesTimerId = useRef<NodeJS.Timeout | null>(null);
  const isPointerDown = useRef<boolean>(false);
  const didPointerMoveWhileDown = useRef<boolean>(false);
  const lastPointerDownTime = useRef<number>(0);
  const { value: themeColor } = useContext(ThemeContext);

  const canvasDiagonal = useMemo(() => getDistance2d(0, 0, canvasWidth, canvasHeight), [
    canvasHeight,
    canvasWidth,
  ]);

  // Canvas drawing loop
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, dimensions: { width: number; height: number }): void => {
      // Draw current status of the grid
      ctx.fillStyle = themeColor;
      drawGrid(ctx, dimensions, {
        points: gridPoints.current,
        waves: gridWaves.current,
      });

      // Update grid points based on the waves
      gridPoints.current = updateGridPoints(gridPoints.current, gridWaves.current);

      // Grow waves, remove expired ones.
      gridWaves.current = gridWaves.current.map(growWave).filter((w) => !isWaveExpired(w));
    },
    [themeColor]
  );

  const canvasRef = useCanvas(draw);

  // Adds a wave to the grid. Throttled every 50ms to avoid overcrowding.
  const addGridWave = useCallback(
    throttle(100, (evt: { clientX: number; clientY: number }, isWeak: boolean): void => {
      const maxX = absMax(evt.clientX, evt.clientX - canvasWidth);
      const maxY = absMax(evt.clientY, evt.clientY - canvasHeight);

      const wave = createGridWave({
        x: evt.clientX,
        y: evt.clientY,
        furthestCornerDistance: Math.sqrt(maxX * maxX + maxY * maxY),
        sketchDiagonal: canvasDiagonal,
        isWeak,
      });

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
            clientX: bitwiseRound(canvasWidth / 2),
            clientY: bitwiseRound(canvasHeight / 2),
          },
          false
        );
        programmaticWavesTimerId.current = null;
        startProgrammaticWaveTimer();
      });
    }, 2500 + Math.random() * 1000);
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

        gridPoints.current = createGridPoints({
          width,
          height,
        });
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

export default HomeGrid;
