import React, { useEffect, useRef, RefObject, useState } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType } from 'next';

import { getGridPoints } from './grid-logic';
import { drawGrid } from './grid-draw';

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
  function draw(
    ctx: CanvasRenderingContext2D,
    dimensions: { width: number; height: number },
    fillColor: string
  ): void {
    const gridState = {
      points: getGridPoints(dimensions),
    };

    ctx.fillStyle = fillColor;

    drawGrid(ctx, dimensions, gridState);
  }

  // State and refs
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const canvasRef = useCanvas(draw);

  // Call onInit at component mounting time.
  // This notifies the component host that the grid initialised correctly.
  useEffect(() => {
    onInit();
  }, [onInit]);

  // User interactions, onInteraction/onIdle callbacks
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

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

    function onCanvasMouseUp(): void {
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
