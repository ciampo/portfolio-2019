import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType, NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import { ContentfulApiPageHome } from '../typings';
import routesConfig from '../routes-config';
import gridConfig from '../components/home-grid/grid-config';

const HomeGrid = dynamic(() => import('../components/home-grid/HomeGrid'));

type PageHomeProps = ContentfulApiPageHome & {
  path: string;
};

const { dotSize, tileSize, getDotCoordinate } = gridConfig;
const dotOffset = getDotCoordinate(tileSize, dotSize);

const lettersTransition = {
  delay: 0.2,
  duration: 2.5,
};

const letterGroupAnimationVariants = {
  enter: {
    strokeOpacity: 0.7,
    transition: lettersTransition,
  },
  exit: {
    strokeOpacity: 0,
  },
};

const letterSingleAnimationVariants = {
  enter: {
    strokeDashoffset: 0,
    transition: lettersTransition,
  },
};

const roleAnimationVariants = {
  enter: {
    fillOpacity: 0.6,
    transition: {
      delay: 1.7,
      duration: 1,
    },
  },
};

const Home: NextComponentType<{}, PageHomeProps, PageHomeProps> = ({ path, meta, pageTitle }) => {
  const gridWrapperEl = useRef<HTMLDivElement>(null);

  function forceRealViewportSize(): void {
    if (gridWrapperEl && gridWrapperEl.current) {
      gridWrapperEl.current.style.height = `${window.innerHeight}px`;
    }
  }

  useEffect(() => {
    window.addEventListener('resize', forceRealViewportSize);

    // Becase the useEffect deps is an empty array,
    // it will only run when the component mount/unmounts.
    // So we can run the callback once at init time.
    forceRealViewportSize();
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.documentElement.style.width = '100%';

    return (): void => {
      window.removeEventListener('resize', forceRealViewportSize);

      document.documentElement.style.position = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.width = '';
    };
  }, []);

  const [isCanvasGridVisible, setCanvasGridVisibility] = useState(false);
  const [isSvgFallbackGridVisible, setSvgFallbackGridVisibility] = useState(true);
  const [isHomeLogoVisible, setHomeLogoVisibility] = useState(true);

  function onCanvasInit(): void {
    setSvgFallbackGridVisibility(false);
  }

  function onCanvasInteraction(): void {
    setHomeLogoVisibility(false);
  }

  function onCanvasIdle(): void {
    setHomeLogoVisibility(true);
  }

  function onHomeLogoEnterAnimationComplete(): void {
    setCanvasGridVisibility(true);
  }

  return (
    <>
      <PageMeta title={meta.fields.title} description={meta.fields.description} path={path} />

      <DefaultPageTransitionWrapper>
        <div
          ref={gridWrapperEl}
          className="dot-grid flex w-full h-screen items-center justify-center relative"
        >
          {isCanvasGridVisible && (
            <HomeGrid
              onInit={onCanvasInit}
              onInteraction={onCanvasInteraction}
              onIdle={onCanvasIdle}
            />
          )}
          {isSvgFallbackGridVisible && (
            <svg aria-hidden="true" className="absolute w-full h-full top-0 left-0 z-0">
              <defs>
                <pattern
                  id="dots-grid"
                  x="0"
                  y="0"
                  width={tileSize}
                  height={tileSize}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    fill="currentColor"
                    d={`M${dotOffset} ${dotOffset}h${dotSize}v${dotSize}h${-dotSize}z`}
                    fillRule="evenodd"
                  />
                </pattern>
              </defs>

              <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-grid)"></rect>
            </svg>
          )}

          <h1
            className={`contain-layout-paint text-primary bg-background z-10 pointer-events-none transition-d-500 transition-p-opacity transition-tf-custom home-logo-title ${!isHomeLogoVisible &&
              'opacity-0'}`}
          >
            <span className="sr-only">{pageTitle}</span>
            <motion.svg
              initial="exit"
              animate="enter"
              exit="exit"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 172 124"
              onAnimationComplete={onHomeLogoEnterAnimationComplete}
            >
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  {/* Blur */}
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                  {/* Opacity 0.5 */}
                  <feColorMatrix
                    type="matrix"
                    values="1   0   0   0   0
                            0   1   0   0   0
                            0   0   1   0   0
                            0   0   0   0.5 0"
                  />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g fill="none" fillRule="evenodd">
                <motion.g
                  stroke="currentColor"
                  strokeWidth="0.05rem"
                  variants={letterGroupAnimationVariants}
                  strokeOpacity="0"
                >
                  {/* M */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M33.2 37.8l9-22h5.5V44h-4.5V24.3L35 44h-3.5l-8.3-19.8V44h-4.4V15.7h5.4l9 22z"
                    strokeDasharray="210"
                    strokeDashoffset="210"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* a - outside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M62.3 31.5v-1.3c0-2.1-1.4-3.4-3.8-3.4-2.3 0-3.8 1-4.1 2.8v.2h-4.5v-.3c.3-3.9 3.7-6.6 8.7-6.6 5.1 0 8.4 2.7 8.4 7V44h-4.5v-2.8a7.7 7.7 0 01-6.3 3.2C52 44.5 49 41.9 49 38c0-3.7 2.9-6 7.9-6.3l5.3-.3z"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* a - inside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M62.3 35l-4.7.2c-2.4.2-3.7 1.2-3.7 2.8 0 1.6 1.3 2.7 3.4 2.7 2.9 0 5-2 5-4.4v-1.4z"
                    strokeDasharray="25"
                    strokeDashoffset="25"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* r */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M73.7 26c.9-2 2.6-3 4.7-3l1.5.1h.2v4.5l-.3-.1a6 6 0 00-1.8-.2c-2.6 0-4.1 1.7-4.1 4.4v12.4h-4.7V23.3h4.5V26z"
                    strokeDasharray="68"
                    strokeDashoffset="68"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* c */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M90 44.5c-6.1 0-10-4.1-10-10.8C80 27.2 84 23 90 23c5 0 8.6 3.2 9 7.6v.3h-4.4v-.2a4.4 4.4 0 00-4.6-3.7c-3.2 0-5.2 2.6-5.2 6.8 0 4.3 2 6.8 5.2 6.8 2.4 0 4-1.3 4.5-3.5v-.2h4.6v.2c-.5 4.5-4.1 7.5-9.1 7.5z"
                    strokeDasharray="102"
                    strokeDashoffset="102"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                    id="logo-letter-4"
                  />
                  {/* o - outside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M110.2 44.5c-6.1 0-10-4.2-10-10.8 0-6.6 4-10.8 10-10.8s10 4.2 10 10.8c0 6.6-4 10.8-10 10.8z"
                    strokeDasharray="68"
                    strokeDashoffset="68"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                    id="logo-letter-5"
                  />
                  {/* o - inside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M110.2 40.6c3.2 0 5.2-2.6 5.2-6.9 0-4.3-2-6.8-5.2-6.8s-5.2 2.5-5.2 6.8 2 6.9 5.2 6.9z"
                    strokeDasharray="40"
                    strokeDashoffset="40"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                    id="logo-letter-6"
                  />
                  {/* C */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M30.9 76c-8 0-13.1-5.7-13.1-14.7s5-14.6 13-14.6c6.6 0 11.5 4 12.3 9.9v.3h-4.8v-.2a7.2 7.2 0 00-7.4-5.7c-5 0-8.2 4-8.2 10.3 0 6.4 3.2 10.4 8.2 10.4 3.8 0 6.5-2 7.3-5.2v-.2h5l-.1.3c-1.1 6-5.6 9.4-12.2 9.4z"
                    strokeDasharray="140"
                    strokeDashoffset="140"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (dot) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M47 52a2.7 2.7 0 01-2.6-2.7c0-1.5 1.2-2.7 2.7-2.7a2.6 2.6 0 110 5.3z"
                    strokeDasharray="18"
                    strokeDashoffset="18"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (line) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M49.4 54.7v20.8h-4.7V54.7h4.7z"
                    strokeDasharray="52"
                    strokeDashoffset="52"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* a - outside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M64.2 63v-1.4c0-2.1-1.4-3.4-3.9-3.4-2.2 0-3.7 1-4 2.8v.2h-4.5V61c.2-3.9 3.6-6.6 8.7-6.6 5 0 8.4 2.7 8.4 7v14.2h-4.6v-2.8a7.7 7.7 0 01-6.3 3.2c-4.1 0-7-2.6-7-6.4 0-3.7 2.8-6 7.8-6.3l5.4-.3z"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* a - inside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M64.2 66.3l-4.8.3c-2.4.2-3.7 1.2-3.7 2.8 0 1.6 1.4 2.7 3.5 2.7 2.8 0 5-2 5-4.4v-1.4z"
                    strokeDasharray="25"
                    strokeDashoffset="25"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* m */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M75.5 57.5c1.1-2 3.2-3.2 5.7-3.2 2.8 0 4.9 1.4 5.8 3.7a7 7 0 016.4-3.7c4.2 0 7 2.8 7 7v14.2h-4.8V62.3c0-2.5-1.3-3.9-3.6-3.9-2.4 0-4 1.7-4 4.2v13h-4.6V62c0-2.2-1.4-3.6-3.7-3.6-2.3 0-4 1.8-4 4.3v12.8H71V54.7h4.5v2.8z"
                    strokeDasharray="168"
                    strokeDashoffset="168"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* p (outside) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M107 57.7c1.4-2.1 3.7-3.3 6.4-3.3 5.4 0 8.9 4.2 8.9 10.7 0 6.5-3.5 10.8-8.8 10.8-2.7 0-5-1.2-6.3-3.2v9.5h-4.7V54.8h4.6v3z"
                    strokeDasharray="96"
                    strokeDashoffset="96"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* p (inside) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M112.3 71.8c3.2 0 5.2-2.5 5.2-6.7 0-4.1-2-6.7-5.2-6.7-3 0-5.1 2.7-5.1 6.7 0 4.1 2 6.7 5.1 6.7z"
                    strokeDasharray="38"
                    strokeDashoffset="38"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (dot) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M126 52a2.7 2.7 0 01-2.6-2.7c0-1.5 1.2-2.7 2.7-2.7a2.6 2.6 0 110 5.3z"
                    strokeDasharray="18"
                    strokeDashoffset="18"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (line) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M128.4 54.7v20.8h-4.7V54.7h4.7z"
                    strokeDasharray="52"
                    strokeDashoffset="52"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* n */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M135.3 57.5c1.3-2 3.5-3.2 6.3-3.2 4.6 0 7.4 3 7.4 7.8v13.4h-4.8V63c0-3-1.3-4.5-4-4.5-2.9 0-4.7 2-4.7 5v12.1h-4.7V54.7h4.5v2.8z"
                    strokeDasharray="110"
                    strokeDashoffset="110"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (dot) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M153.6 52a2.7 2.7 0 01-2.7-2.7c0-1.5 1.2-2.7 2.7-2.7a2.6 2.6 0 110 5.3z"
                    strokeDasharray="18"
                    strokeDashoffset="18"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (line) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M156 75.5h-4.8V54.7h4.7v20.8z"
                    strokeDasharray="52"
                    strokeDashoffset="52"
                    filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                </motion.g>

                {/* Web developer */}
                <g transform="translate(2,-10)">
                  <motion.path
                    className="home-logo-title__role"
                    d="M21.6 118l2.6-8.5 2.6 8.4h.8l2.8-9.3h-.8l-2.4 8.6-2.6-8.6h-.8l-2.6 8.6-2.5-8.6H18l2.7 9.3h.9zm13 0c2.2 0 3.6-1 3.9-2.7h-.7c-.3 1.3-1.4 2.2-3.1 2.2-2.1 0-3.5-1.5-3.5-4v-.1h7.4v-.4c0-2.7-1.6-4.5-4-4.5-2.5 0-4.1 1.9-4.1 4.8 0 3 1.6 4.8 4.2 4.8zm3.3-5.2h-6.7c0-2.2 1.4-3.7 3.4-3.7s3.3 1.5 3.3 3.7zm6 5.3c2.4 0 4-2 4-4.8 0-2.9-1.6-4.8-4-4.8-1.6 0-3 1-3.4 2.6V105h-.7v13h.6v-2.6a3.6 3.6 0 003.6 2.7zm0-.6c-2 0-3.4-1.8-3.4-4.2 0-2.5 1.4-4.2 3.4-4.2s3.3 1.7 3.3 4.2-1.3 4.2-3.3 4.2zm11.9.6c1.7 0 3-1.2 3.5-2.7v2.5h.7V105h-.7v6a3.6 3.6 0 00-3.5-2.5c-2.4 0-4 2-4 4.8s1.6 4.8 4 4.8zm0-.6c-2 0-3.3-1.7-3.3-4.2s1.4-4.2 3.4-4.2 3.4 1.7 3.4 4.2-1.4 4.2-3.4 4.2zm9.6.6c2 0 3.5-1.2 3.8-2.8h-.7c-.3 1.3-1.4 2.2-3.1 2.2-2.1 0-3.5-1.5-3.5-4v-.1h7.4v-.4c0-2.7-1.6-4.5-4-4.5-2.5 0-4.1 1.9-4.1 4.8 0 3 1.6 4.8 4.2 4.8zm3.2-5.3h-6.7c0-2.2 1.4-3.7 3.4-3.7s3.3 1.5 3.3 3.7zm5.2 5.1l3.5-9.3h-.7l-3.2 8.6-3.3-8.6h-.7l3.5 9.3h.9zm7.7.2c2.1 0 3.6-1.2 3.9-2.8h-.7c-.3 1.3-1.4 2.2-3.2 2.2-2 0-3.5-1.5-3.5-4v-.1h7.5v-.4c0-2.7-1.6-4.5-4-4.5-2.5 0-4.2 1.9-4.2 4.8 0 3 1.7 4.8 4.2 4.8zm3.3-5.3H78c0-2.2 1.4-3.7 3.3-3.7 2 0 3.4 1.5 3.4 3.7zm2.5 5.1V105h-.7v13h.7zm5.4.2c2.5 0 4.2-1.9 4.2-4.8 0-3-1.7-4.8-4.2-4.8s-4.2 1.8-4.2 4.8 1.7 4.8 4.2 4.8zm0-.6c-2.1 0-3.5-1.6-3.5-4.2s1.4-4.2 3.5-4.2c2 0 3.5 1.6 3.5 4.2s-1.4 4.2-3.5 4.2zm6 3.5v-5.5a3.6 3.6 0 003.4 2.6c2.4 0 4-2 4-4.8 0-2.9-1.6-4.8-4-4.8-1.7 0-3 1.1-3.5 2.6v-2.5h-.7V121h.7zm3.3-3.5c-2 0-3.4-1.7-3.4-4.2s1.4-4.2 3.4-4.2 3.4 1.7 3.4 4.2-1.4 4.2-3.4 4.2zm8.9.6c2.1 0 3.5-1.2 3.8-2.8h-.7c-.2 1.3-1.4 2.2-3 2.2-2.2 0-3.6-1.5-3.6-4v-.1h7.5v-.4c0-2.7-1.6-4.5-4-4.5-2.6 0-4.2 1.9-4.2 4.8 0 3 1.6 4.8 4.2 4.8zm3.2-5.3h-6.7c.1-2.2 1.5-3.7 3.4-3.7 2 0 3.3 1.5 3.3 3.7zm2.5 5.1v-5.8c0-1.7 1-3 2.4-3l1 .2v-.7l-.9-.1c-1.2 0-2.1.7-2.5 2v-1.9h-.7v9.3h.7z"
                    fillOpacity="0"
                    fill="currentColor"
                    fillRule="nonzero"
                    variants={roleAnimationVariants}
                  />
                </g>
              </g>
            </motion.svg>
          </h1>
        </div>
      </DefaultPageTransitionWrapper>
    </>
  );
};

Home.getInitialProps = async ({ pathname }: NextPageContext): Promise<PageHomeProps> => {
  const toReturn = {
    path: '/na',
    pageTitle: 'Home',
    meta: {
      fields: {
        title: 'Home',
        description: 'Home page',
      },
    },
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);

  if (routeConfig && routeConfig.contentfulPageId) {
    const homeData: ContentfulApiPageHome[] = await import(
      `../data/${routeConfig.contentfulPageId}.json`
    ).then((m) => m.default);

    toReturn.path = pathname;
    toReturn.pageTitle = homeData[0].pageTitle;
    toReturn.meta = homeData[0].meta;
  }

  return toReturn;
};

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
Home.propTypes = {
  path: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    fields: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  }).isRequired,
  pageTitle: PropTypes.string.isRequired,
};

export default Home;
