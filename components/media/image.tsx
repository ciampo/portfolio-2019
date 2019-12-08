import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType } from 'next';
import { useIntersection } from 'react-use';

import { isIoSupported, arraySortNumberAsc, arrayUnique } from '../utils/utils';

type ContentfulImageProps = {
  baseSrc: string;
  resolutions: number[];
  sizes: string;
  label?: string;
  className?: string;
  ratio?: number;
  lazy?: boolean;
  base64Thumb?: string;
};

function getImageUrl(baseSrc: string, res: number, format: string): string {
  return `${baseSrc}?w=${res}&fit=fill&fm=${format}&q=70`;
}

function getSrcSet(baseSrc: string, resolutions: number[], format: string): string {
  return resolutions.map((res) => `${getImageUrl(baseSrc, res, format)}  ${res}w`).join(', ');
}

const ioOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
  threshold: 0.01,
};

const ContentfulImage: NextComponentType<{}, ContentfulImageProps, ContentfulImageProps> = ({
  baseSrc,
  resolutions,
  sizes,
  label,
  className,
  ratio,
  lazy,
  base64Thumb,
}) => {
  const wrapperRef = useRef(null);
  const [hasLoaded, setLoaded] = useState(lazy ? false : true);
  const [showFullRes, setShowFullRes] = useState(
    lazy && isIoSupported && base64Thumb ? false : true
  );

  const allResolutions = arraySortNumberAsc(
    arrayUnique(
      resolutions.reduce((arr: number[], res: number) => [...arr, res, res * 2], [] as number[])
    )
  );

  function onImageLoaded(): void {
    if (showFullRes) {
      setLoaded(true);
    }
  }

  // Download full res verison the first time that the image comes into view
  const ioResults = useIntersection(wrapperRef, ioOptions);
  if (!showFullRes && ioResults && ioResults.intersectionRatio > 0) {
    setShowFullRes(true);
  }

  return (
    <div
      className={`relative overflow-hidden picture ${
        hasLoaded ? 'picture--loaded' : ''
      } ${className}`}
      style={ratio ? { height: 0, paddingBottom: `${ratio * 100}%` } : {}}
      ref={wrapperRef}
    >
      {lazy && (
        <noscript
          // using `dangerouslySetInnerHTML` because of
          // https://github.com/preactjs/preact/issues/341
          dangerouslySetInnerHTML={{
            __html: `<img
              class="absolute top-0 left-0 w-full h-full object-cover"
              src=${getImageUrl(baseSrc, allResolutions.slice(-1)[0], 'jpg')}
              alt=${label || ''}
              loading="lazy"
            />`,
          }}
        ></noscript>
      )}
      <picture>
        <source
          type="image/webp"
          srcSet={showFullRes ? getSrcSet(baseSrc, allResolutions, 'webp') : undefined}
          sizes={sizes}
        />
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          srcSet={showFullRes ? getSrcSet(baseSrc, allResolutions, 'jpg') : undefined}
          src={showFullRes ? getImageUrl(baseSrc, allResolutions.slice(-1)[0], 'jpg') : base64Thumb}
          alt={label || ''}
          onLoad={onImageLoaded}
          sizes={sizes}
        />
      </picture>
    </div>
  );
};

ContentfulImage.propTypes = {
  baseSrc: PropTypes.string.isRequired,
  resolutions: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  sizes: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  ratio: PropTypes.number,
  lazy: PropTypes.bool,
  base64Thumb: PropTypes.string,
};

export default ContentfulImage;