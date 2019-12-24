import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType } from 'next';
import { useIntersection } from 'react-use';

type ContentfulVideoProps = {
  src: string;
  className?: string;
};

const ioOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
  threshold: 0.01,
};

const ContentfulVideo: NextComponentType<{}, ContentfulVideoProps, ContentfulVideoProps> = ({
  src,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hasVideoAlreadyAutoplayed, setVideoAlreadyAutoplayed] = useState(false);
  const [isVideoPaused, setVideoPaused] = useState(true);

  function toggleVideoPlayState(): void {
    if (!videoRef.current) {
      return;
    }

    if (videoRef.current.paused) {
      videoRef.current.play();
      setVideoPaused(false);
    } else {
      videoRef.current.pause();
      setVideoPaused(true);
    }
  }

  const ioResults = useIntersection(wrapperRef, ioOptions);
  if (!hasVideoAlreadyAutoplayed && ioResults && ioResults.intersectionRatio > 0) {
    requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setVideoPaused(false);
        setVideoAlreadyAutoplayed(true);
      }
    });
  }

  return (
    <div className={`relative shadow-lg background-gradient ${className || ''}`} ref={wrapperRef}>
      <video
        muted
        loop
        preload="auto"
        playsInline
        src={src}
        className="block cursor-pointer"
        ref={videoRef}
        onClick={toggleVideoPlayState}
      />

      <button
        className={`absolute top-0 left-0 w-full h-full opacity-75 bg-background text-primary flex items-center justify-center ${
          isVideoPaused ? '' : 'hidden'
        }`}
        onClick={toggleVideoPlayState}
      >
        <span className="sr-only">Pause video</span>
        <svg
          aria-hidden="true"
          className="w-12 h-12"
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
        >
          <path fill="currentColor" d="M12 38h8V10h-8v28zm16-28v28h8V10h-8z" />
        </svg>
      </button>
    </div>
  );
};

ContentfulVideo.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ContentfulVideo;
