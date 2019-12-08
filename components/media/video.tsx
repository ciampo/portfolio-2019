import React from 'react';
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
  return <video src={src} className={`block ${className || ''}`} />;
};

ContentfulVideo.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ContentfulVideo;
