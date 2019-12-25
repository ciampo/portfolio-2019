import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType } from 'next';

type ContentfulVideoProps = {
  src: string;
  className?: string;
};

const ContentfulVideo: NextComponentType<{}, ContentfulVideoProps, ContentfulVideoProps> = ({
  src,
  className,
}) => {
  const [hasPlayedOnce, setPlayedOnce] = useState(false);

  return (
    <div
      className={`video-wrapper ${hasPlayedOnce ? '' : 'video-wrapper--paused'} ${className || ''}`}
    >
      <video
        muted
        loop
        controls
        preload="auto"
        playsInline
        src={src}
        className="block cursor-pointer"
        autoPlay
        onPlaying={(): void => setPlayedOnce(true)}
      />
    </div>
  );
};

ContentfulVideo.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ContentfulVideo;
