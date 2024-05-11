import React, { useEffect, useRef, useState } from 'react';
import { NextComponentType, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import gridConfig from '../components/home-grid/grid-config';
import { generateWebpageStructuredData } from '../components/utils/structured-data';
import { ContentfulApiPageHome, ContentfulApiStructuredData } from '../typings';

const HomeGrid = dynamic(() => import('../components/home-grid/HomeGrid'), { ssr: false });

type PageHomeProps = {
  homeData: ContentfulApiPageHome;
  path: string;
};

const { dotSize, tileSize, getDotCoordinate } = gridConfig;
const dotOffset = getDotCoordinate(tileSize, dotSize);

const lettersTransition = {
  delay: 0.2,
  duration: 2,
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

const Home: NextComponentType<{}, PageHomeProps, PageHomeProps> = ({ path, homeData }) => {
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

  function onCanvasInit(): void {
    setSvgFallbackGridVisibility(false);
  }

  function onHomeLogoEnterAnimationComplete(): void {
    setCanvasGridVisibility(true);
  }

  return (
    <>
      <PageMeta
        title={homeData.meta.title}
        description={homeData.meta.description}
        previewImage={homeData.meta.previewImage.file.url}
        path={path}
        webPageStructuredData={
          homeData.templateStructuredData &&
          generateWebpageStructuredData(homeData.templateStructuredData, {
            path,
            title: homeData.meta.title,
            description: homeData.meta.description,
          })
        }
      />

      <DefaultPageTransitionWrapper>
        <div
          ref={gridWrapperEl}
          className="dot-grid flex w-full h-screen items-center justify-center relative"
        >
          {/* Interactive canvas grid */}
          {isCanvasGridVisible && <HomeGrid onInit={onCanvasInit} />}
          {/* Static SVG used as fallback on first render */}
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
                    opacity="0.8"
                  />
                </pattern>
              </defs>

              <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-grid)"></rect>
            </svg>
          )}

          <h1 className="contain-layout-paint text-primary z-10 pointer-events-none transition-d-500 transition-p-opacity transition-tf-custom home-logo-title bg-background  shadow-2xl">
            <span className="sr-only">{homeData.pageTitle}</span>
            <motion.svg
              initial="exit"
              animate="enter"
              exit="exit"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 172 124"
              onAnimationComplete={onHomeLogoEnterAnimationComplete}
            >
              {/* Blur (std 1) + Opacity (0.5) */}
              {/* <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs> */}
              <g fill="none" fillRule="evenodd">
                <motion.g
                  stroke="currentColor"
                  strokeWidth="0.03rem"
                  variants={letterGroupAnimationVariants}
                  strokeOpacity="0"
                >
                  {/* M */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M33.2 37.8l9-22h5.5V44h-4.5V24.3L35 44h-3.5l-8.3-19.8V44h-4.4V15.7h5.4l9 22z"
                    strokeDasharray="210"
                    strokeDashoffset="210"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* a - outside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M62.3 31.5v-1.3c0-2.1-1.4-3.4-3.8-3.4-2.3 0-3.8 1-4.1 2.8v.2h-4.5v-.3c.3-3.9 3.7-6.6 8.7-6.6 5.1 0 8.4 2.7 8.4 7V44h-4.5v-2.8a7.7 7.7 0 01-6.3 3.2C52 44.5 49 41.9 49 38c0-3.7 2.9-6 7.9-6.3l5.3-.3z"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* a - inside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M62.3 35l-4.7.2c-2.4.2-3.7 1.2-3.7 2.8 0 1.6 1.3 2.7 3.4 2.7 2.9 0 5-2 5-4.4v-1.4z"
                    strokeDasharray="25"
                    strokeDashoffset="25"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* r */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M73.7 26c.9-2 2.6-3 4.7-3l1.5.1h.2v4.5l-.3-.1a6 6 0 00-1.8-.2c-2.6 0-4.1 1.7-4.1 4.4v12.4h-4.7V23.3h4.5V26z"
                    strokeDasharray="68"
                    strokeDashoffset="68"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* c */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M90 44.5c-6.1 0-10-4.1-10-10.8C80 27.2 84 23 90 23c5 0 8.6 3.2 9 7.6v.3h-4.4v-.2a4.4 4.4 0 00-4.6-3.7c-3.2 0-5.2 2.6-5.2 6.8 0 4.3 2 6.8 5.2 6.8 2.4 0 4-1.3 4.5-3.5v-.2h4.6v.2c-.5 4.5-4.1 7.5-9.1 7.5z"
                    strokeDasharray="102"
                    strokeDashoffset="102"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                    id="logo-letter-4"
                  />
                  {/* o - outside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M110.2 44.5c-6.1 0-10-4.2-10-10.8 0-6.6 4-10.8 10-10.8s10 4.2 10 10.8c0 6.6-4 10.8-10 10.8z"
                    strokeDasharray="68"
                    strokeDashoffset="68"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                    id="logo-letter-5"
                  />
                  {/* o - inside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M110.2 40.6c3.2 0 5.2-2.6 5.2-6.9 0-4.3-2-6.8-5.2-6.8s-5.2 2.5-5.2 6.8 2 6.9 5.2 6.9z"
                    strokeDasharray="40"
                    strokeDashoffset="40"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                    id="logo-letter-6"
                  />
                  {/* C */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M30.9 76c-8 0-13.1-5.7-13.1-14.7s5-14.6 13-14.6c6.6 0 11.5 4 12.3 9.9v.3h-4.8v-.2a7.2 7.2 0 00-7.4-5.7c-5 0-8.2 4-8.2 10.3 0 6.4 3.2 10.4 8.2 10.4 3.8 0 6.5-2 7.3-5.2v-.2h5l-.1.3c-1.1 6-5.6 9.4-12.2 9.4z"
                    strokeDasharray="140"
                    strokeDashoffset="140"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (dot) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M47 52a2.7 2.7 0 01-2.6-2.7c0-1.5 1.2-2.7 2.7-2.7a2.6 2.6 0 110 5.3z"
                    strokeDasharray="18"
                    strokeDashoffset="18"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (line) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M49.4 54.7v20.8h-4.7V54.7h4.7z"
                    strokeDasharray="52"
                    strokeDashoffset="52"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* a - outside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M64.2 63v-1.4c0-2.1-1.4-3.4-3.9-3.4-2.2 0-3.7 1-4 2.8v.2h-4.5V61c.2-3.9 3.6-6.6 8.7-6.6 5 0 8.4 2.7 8.4 7v14.2h-4.6v-2.8a7.7 7.7 0 01-6.3 3.2c-4.1 0-7-2.6-7-6.4 0-3.7 2.8-6 7.8-6.3l5.4-.3z"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* a - inside */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M64.2 66.3l-4.8.3c-2.4.2-3.7 1.2-3.7 2.8 0 1.6 1.4 2.7 3.5 2.7 2.8 0 5-2 5-4.4v-1.4z"
                    strokeDasharray="25"
                    strokeDashoffset="25"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* m */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M75.5 57.5c1.1-2 3.2-3.2 5.7-3.2 2.8 0 4.9 1.4 5.8 3.7a7 7 0 016.4-3.7c4.2 0 7 2.8 7 7v14.2h-4.8V62.3c0-2.5-1.3-3.9-3.6-3.9-2.4 0-4 1.7-4 4.2v13h-4.6V62c0-2.2-1.4-3.6-3.7-3.6-2.3 0-4 1.8-4 4.3v12.8H71V54.7h4.5v2.8z"
                    strokeDasharray="168"
                    strokeDashoffset="168"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* p (outside) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M107 57.7c1.4-2.1 3.7-3.3 6.4-3.3 5.4 0 8.9 4.2 8.9 10.7 0 6.5-3.5 10.8-8.8 10.8-2.7 0-5-1.2-6.3-3.2v9.5h-4.7V54.8h4.6v3z"
                    strokeDasharray="96"
                    strokeDashoffset="96"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* p (inside) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M112.3 71.8c3.2 0 5.2-2.5 5.2-6.7 0-4.1-2-6.7-5.2-6.7-3 0-5.1 2.7-5.1 6.7 0 4.1 2 6.7 5.1 6.7z"
                    strokeDasharray="38"
                    strokeDashoffset="38"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (dot) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M126 52a2.7 2.7 0 01-2.6-2.7c0-1.5 1.2-2.7 2.7-2.7a2.6 2.6 0 110 5.3z"
                    strokeDasharray="18"
                    strokeDashoffset="18"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (line) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M128.4 54.7v20.8h-4.7V54.7h4.7z"
                    strokeDasharray="52"
                    strokeDashoffset="52"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* n */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M135.3 57.5c1.3-2 3.5-3.2 6.3-3.2 4.6 0 7.4 3 7.4 7.8v13.4h-4.8V63c0-3-1.3-4.5-4-4.5-2.9 0-4.7 2-4.7 5v12.1h-4.7V54.7h4.5v2.8z"
                    strokeDasharray="110"
                    strokeDashoffset="110"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (dot) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M153.6 52a2.7 2.7 0 01-2.7-2.7c0-1.5 1.2-2.7 2.7-2.7a2.6 2.6 0 110 5.3z"
                    strokeDasharray="18"
                    strokeDashoffset="18"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                  {/* i (line) */}
                  <motion.path
                    className="home-logo-title__letter"
                    d="M156 75.5h-4.8V54.7h4.7v20.8z"
                    strokeDasharray="52"
                    strokeDashoffset="52"
                    // filter="url(#glow)"
                    variants={letterSingleAnimationVariants}
                  />
                </motion.g>

                {/* J */}
                <motion.path
                  className="home-logo-title__role"
                  d="M23.19 107.29c.65 0 1.15-.1 1.5-.32.34-.21.59-.48.74-.82a3 3 0 0 0 .25-1.1 31 31 0 0 0 .02-1.22V96.2h.7v8.63a4.49 4.49 0 0 1-.37 1.66c-.13.27-.3.5-.54.71-.23.21-.53.38-.89.5a4 4 0 0 1-1.33.2 3.7 3.7 0 0 1-1.81-.37 2.4 2.4 0 0 1-.97-.94c-.2-.39-.33-.8-.38-1.27-.05-.46-.07-.9-.07-1.33h.7c-.03.43-.03.84.02 1.24.04.4.14.74.31 1.04.18.3.43.55.77.74.33.19.78.28 1.35.28Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* a */}
                <motion.path
                  className="home-logo-title__role"
                  d="M33.76 106h-.03c-.1.24-.23.47-.41.69a3.27 3.27 0 0 1-1.55.98c-.34.1-.7.15-1.1.15a3.2 3.2 0 0 1-2.03-.57c-.48-.38-.72-.96-.72-1.75a2.13 2.13 0 0 1 1.02-1.9c.3-.17.62-.3.97-.37.36-.08.7-.13 1.04-.16l.94-.08c.44-.04.78-.09 1.03-.16.25-.06.44-.16.57-.28.13-.13.2-.28.24-.48.03-.19.05-.43.05-.72a1.4 1.4 0 0 0-.53-1.14 2 2 0 0 0-.7-.34 3.77 3.77 0 0 0-1.06-.13c-.73 0-1.33.18-1.78.54-.46.36-.7.91-.75 1.65h-.6c.04-.9.33-1.59.87-2.04.54-.45 1.3-.68 2.3-.68.98 0 1.7.2 2.16.58.45.4.68.9.68 1.53v5.14c.01.12.03.22.07.32.03.1.08.17.16.23a.5.5 0 0 0 .31.09c.11 0 .26-.02.45-.05v.51a1.9 1.9 0 0 1-1.08-.03.77.77 0 0 1-.33-.26.94.94 0 0 1-.15-.37c-.02-.15-.04-.3-.04-.47v-.44Zm0-3.05c-.15.19-.37.3-.68.37-.3.07-.64.11-1.01.15l-1.03.1c-.3.02-.6.07-.9.13-.3.06-.56.16-.8.3-.24.13-.44.32-.59.56-.14.24-.22.55-.22.94 0 .6.2 1.06.58 1.35.38.3.9.44 1.58.44.7 0 1.24-.13 1.65-.38.4-.25.71-.53.93-.86.21-.33.35-.64.4-.94.06-.3.1-.51.1-.62v-1.54Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* v */}
                <motion.path
                  className="home-logo-title__role"
                  d="M39.44 107.63h-.75l-3.31-8.23h.7l2.98 7.52h.03l2.78-7.52h.68l-3.1 8.23Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* a */}
                <motion.path
                  className="home-logo-title__role"
                  d="M48.87 106h-.03a2.92 2.92 0 0 1-1.08 1.28 3.9 3.9 0 0 1-1.98.54 3.2 3.2 0 0 1-2.03-.57c-.48-.38-.72-.96-.72-1.75 0-.48.1-.87.28-1.18.2-.3.44-.54.73-.72.3-.17.62-.3.98-.37.36-.08.7-.13 1.03-.16l.95-.08c.43-.04.78-.09 1.03-.16.25-.06.44-.16.56-.28a.82.82 0 0 0 .24-.48c.04-.19.05-.43.05-.72a1.4 1.4 0 0 0-.53-1.14 2 2 0 0 0-.7-.34 3.77 3.77 0 0 0-1.05-.13c-.74 0-1.34.18-1.79.54-.45.36-.7.91-.74 1.65h-.61c.04-.9.33-1.59.87-2.04.54-.45 1.3-.68 2.3-.68.99 0 1.71.2 2.16.58.46.4.69.9.69 1.53v5.14c0 .12.03.22.06.32s.08.17.16.23a.5.5 0 0 0 .32.09c.1 0 .25-.02.45-.05v.51a1.9 1.9 0 0 1-1.08-.03.77.77 0 0 1-.33-.26.94.94 0 0 1-.15-.37c-.03-.15-.04-.3-.04-.47v-.44Zm0-3.05c-.15.19-.38.3-.68.37-.3.07-.65.11-1.02.15l-1.02.1c-.3.02-.6.07-.9.13-.3.06-.57.16-.8.3-.25.13-.44.32-.6.56-.14.24-.22.55-.22.94 0 .6.2 1.06.58 1.35.38.3.91.44 1.59.44.69 0 1.24-.13 1.64-.38.4-.25.72-.53.93-.86.21-.33.35-.64.4-.94.07-.3.1-.51.1-.62v-1.54Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* S */}
                <motion.path
                  className="home-logo-title__role"
                  d="M58.98 99.47a3.05 3.05 0 0 0-.31-1.28 2.7 2.7 0 0 0-.76-.92c-.32-.24-.7-.42-1.15-.55a5.44 5.44 0 0 0-2.48-.07 2.9 2.9 0 0 0-1.8 1.14c-.2.32-.3.71-.3 1.18 0 .46.11.83.34 1.12.22.29.51.52.88.7.36.17.77.31 1.24.42l1.43.3c.49.1.96.21 1.43.35.46.13.88.31 1.25.54a2.57 2.57 0 0 1 1.22 2.28c0 .6-.13 1.1-.38 1.5a3.3 3.3 0 0 1-.97 1c-.39.25-.82.44-1.3.55-.47.11-.93.17-1.37.17a7.9 7.9 0 0 1-1.88-.22 4.21 4.21 0 0 1-1.54-.7 3.4 3.4 0 0 1-1.03-1.26 4.08 4.08 0 0 1-.36-1.87h.7a2.87 2.87 0 0 0 1.16 2.66 4 4 0 0 0 1.34.6 6.9 6.9 0 0 0 1.61.18c.35 0 .71-.04 1.1-.13.39-.08.75-.23 1.07-.43.33-.2.6-.47.82-.8.22-.33.33-.75.33-1.25 0-.48-.12-.87-.34-1.17a2.5 2.5 0 0 0-.89-.74 5.75 5.75 0 0 0-1.24-.45l-1.44-.31c-.48-.1-.95-.2-1.42-.34a4.9 4.9 0 0 1-1.25-.52c-.36-.21-.66-.5-.88-.84-.22-.35-.34-.8-.34-1.34a2.72 2.72 0 0 1 1.25-2.34c.36-.24.78-.42 1.23-.53a6.7 6.7 0 0 1 3.03.03 4 4 0 0 1 1.37.62c.39.29.7.65.93 1.1.24.45.37.99.4 1.62h-.7Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* c */}
                <motion.path
                  className="home-logo-title__role"
                  d="M67.68 101.95a2.38 2.38 0 0 0-.28-.96 2.13 2.13 0 0 0-.6-.7 2.73 2.73 0 0 0-.85-.4 3.6 3.6 0 0 0-1.05-.15 2.87 2.87 0 0 0-2.35 1.14c-.27.35-.47.74-.61 1.19a5.76 5.76 0 0 0-.02 2.9c.13.47.33.88.6 1.22.26.35.6.62.99.81.4.2.86.29 1.39.29a2.88 2.88 0 0 0 1.93-.72c.25-.22.45-.5.61-.8.16-.32.27-.67.32-1.04h.61c-.06.5-.2.93-.4 1.31a3.22 3.22 0 0 1-1.82 1.57c-.4.14-.81.2-1.25.2-.67 0-1.25-.11-1.72-.35a3.28 3.28 0 0 1-1.17-.97 4.1 4.1 0 0 1-.67-1.4 6.27 6.27 0 0 1 .03-3.29c.17-.51.4-.96.73-1.34a3.46 3.46 0 0 1 2.8-1.25c.45 0 .87.06 1.25.17.4.11.74.28 1.04.5a2.71 2.71 0 0 1 1.1 2.06h-.6Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* r */}
                <motion.path
                  className="home-logo-title__role"
                  d="M70.4 101.23h.05a2.23 2.23 0 0 1 1.13-1.36 3.59 3.59 0 0 1 2.02-.52v.61a2.9 2.9 0 0 0-1.1.1c-.4.1-.8.34-1.17.7a5.8 5.8 0 0 0-.4.47 3.15 3.15 0 0 0-.46 1.1c-.03.22-.06.5-.07.8v4.5h-.6V99.4h.6v1.83Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* i (dot) */}
                <motion.path
                  className="home-logo-title__role"
                  d="M74.39 96.2H75v1.65h-.61z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* i (line) */}
                <motion.path
                  className="home-logo-title__role"
                  d="M74.39 99.4H75v8.22h-.61z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* p */}
                <motion.path
                  className="home-logo-title__role"
                  d="M77.68 101.29h.03a3.19 3.19 0 0 1 .92-1.35 3.2 3.2 0 0 1 2.08-.73 3.34 3.34 0 0 1 2.8 1.3c.3.4.52.85.67 1.37a6.28 6.28 0 0 1 0 3.38 3.9 3.9 0 0 1-.68 1.35c-.3.38-.69.67-1.15.89-.47.21-1.01.32-1.64.32-.69 0-1.3-.15-1.83-.45-.53-.3-.92-.78-1.16-1.46h-.04v4.66h-.6V99.4h.6v1.89Zm3.03 6a2.74 2.74 0 0 0 2.34-1.12c.25-.34.44-.74.56-1.2a5.5 5.5 0 0 0 0-2.82c-.1-.46-.29-.86-.53-1.22a2.8 2.8 0 0 0-.96-.86 2.86 2.86 0 0 0-1.41-.33 2.63 2.63 0 0 0-2.33 1.17c-.24.35-.41.75-.52 1.2a6.81 6.81 0 0 0-.02 2.83c.1.46.26.86.5 1.2.22.35.53.63.92.84.39.2.87.31 1.45.31Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* t */}
                <motion.path
                  className="home-logo-title__role"
                  d="M88.85 99.93h-1.8v5.74c0 .33.05.6.12.79.08.19.19.34.34.44.16.1.35.16.56.18.22.02.48.03.77.02v.53c-.31.02-.62.02-.9-.01a1.8 1.8 0 0 1-.78-.24 1.4 1.4 0 0 1-.54-.6 2.27 2.27 0 0 1-.17-1.1v-5.75h-1.52v-.53h1.52v-2.56h.6v2.56h1.8v.53Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* e */}
                <motion.path
                  className="home-logo-title__role"
                  d="M94.66 103.6v.09a4.52 4.52 0 0 0 .76 2.53 2.7 2.7 0 0 0 2.26 1.07c.82 0 1.47-.22 1.95-.65a3.4 3.4 0 0 0 1-1.8h.6c-.18.96-.57 1.7-1.17 2.21s-1.4.77-2.4.77c-.6 0-1.13-.11-1.58-.33a3.23 3.23 0 0 1-1.14-.9c-.3-.37-.53-.82-.68-1.34a6.01 6.01 0 0 1 0-3.33c.16-.53.4-.99.7-1.39a3.44 3.44 0 0 1 2.8-1.32 3.2 3.2 0 0 1 2.64 1.2c.3.36.53.79.68 1.27a5.1 5.1 0 0 1 .22 1.91h-6.64Zm6.03-.53c-.02-.45-.1-.88-.22-1.28-.13-.4-.32-.75-.57-1.05a2.67 2.67 0 0 0-2.14-1 2.87 2.87 0 0 0-2.24 1.01c-.25.3-.45.66-.59 1.07a5 5 0 0 0-.26 1.25h6.02Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* n */}
                <motion.path
                  className="home-logo-title__role"
                  d="M102.72 99.4h.61v1.76h.03c.11-.3.26-.58.46-.82a3.04 3.04 0 0 1 1.54-1 3.74 3.74 0 0 1 2.17.05 2.25 2.25 0 0 1 1.33 1.11 3.58 3.58 0 0 1 .36 1.43l.02.6v5.1h-.61v-5.2c0-.2-.02-.46-.05-.77-.03-.31-.13-.6-.28-.89a2.04 2.04 0 0 0-.7-.73 2.4 2.4 0 0 0-1.3-.3 2.7 2.7 0 0 0-2.18.97c-.26.3-.46.66-.59 1.08-.13.43-.2.89-.2 1.39v4.45h-.6V99.4Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* g */}
                <motion.path
                  className="home-logo-title__role"
                  d="M117.83 99.4v7.8c0 .45-.06.9-.16 1.33a2.7 2.7 0 0 1-1.63 1.94 5.33 5.33 0 0 1-2.98.16 2.95 2.95 0 0 1-1-.44 2.2 2.2 0 0 1-.7-.78 2.77 2.77 0 0 1-.3-1.2h.6c.04.36.13.66.28.92.15.26.34.47.58.63.24.17.51.29.81.36.3.08.62.11.96.11.57 0 1.04-.08 1.42-.25a2.4 2.4 0 0 0 1.38-1.6c.08-.34.13-.69.13-1.04v-1.89h-.03c-.3.6-.68 1.07-1.18 1.4-.5.31-1.1.47-1.8.47-.6 0-1.13-.1-1.57-.31-.45-.2-.82-.5-1.1-.86-.3-.37-.52-.8-.67-1.3a5.66 5.66 0 0 1 .02-3.14c.16-.5.38-.92.68-1.3a3.29 3.29 0 0 1 2.64-1.2c.65 0 1.25.17 1.8.5.55.33.94.8 1.18 1.4h.03v-1.7h.6Zm-3.62.34a2.67 2.67 0 0 0-2.21 1.1c-.25.33-.43.7-.55 1.13a4.97 4.97 0 0 0 0 2.66c.12.43.31.8.56 1.12a2.73 2.73 0 0 0 2.2 1.04c.5 0 .94-.1 1.31-.28.38-.2.69-.46.94-.79s.44-.7.56-1.13a4.74 4.74 0 0 0 0-2.66c-.12-.43-.31-.8-.56-1.13a2.77 2.77 0 0 0-2.25-1.06Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* i (dot) */}
                <motion.path
                  className="home-logo-title__role"
                  d="M119.76 96.2h.61v1.65h-.61z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* i (line) */}
                <motion.path
                  className="home-logo-title__role"
                  d="M119.76 99.4h.61v8.22h-.61z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* n */}
                <motion.path
                  className="home-logo-title__role"
                  d="M122.3 99.4h.62v1.76h.03c.1-.3.26-.58.45-.82a3.04 3.04 0 0 1 1.55-1 3.74 3.74 0 0 1 2.17.05 2.25 2.25 0 0 1 1.33 1.11 3.35 3.35 0 0 1 .36 1.43v5.71h-.6v-5.2c0-.2-.02-.46-.05-.77-.03-.31-.12-.6-.28-.89a2.04 2.04 0 0 0-.7-.73 2.4 2.4 0 0 0-1.3-.3 2.7 2.7 0 0 0-2.18.97c-.26.3-.45.66-.58 1.08-.14.43-.2.89-.2 1.39v4.45h-.61V99.4Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* e */}
                <motion.path
                  className="home-logo-title__role"
                  d="M130.85 103.6v.09a4.52 4.52 0 0 0 .76 2.53 2.7 2.7 0 0 0 2.26 1.07c.83 0 1.48-.22 1.96-.65a3.4 3.4 0 0 0 .99-1.8h.6c-.17.96-.57 1.7-1.17 2.21s-1.4.77-2.4.77c-.6 0-1.13-.11-1.58-.33a3.23 3.23 0 0 1-1.14-.9c-.3-.37-.53-.82-.68-1.34a6.01 6.01 0 0 1 0-3.33c.16-.53.4-.99.7-1.39a3.44 3.44 0 0 1 2.8-1.32 3.2 3.2 0 0 1 2.64 1.2c.3.36.53.79.69 1.27a5.1 5.1 0 0 1 .21 1.91h-6.64Zm6.03-.53c-.02-.45-.1-.88-.22-1.28-.13-.4-.32-.75-.57-1.05a2.67 2.67 0 0 0-2.14-1 2.87 2.87 0 0 0-2.24 1.01c-.25.3-.45.66-.59 1.07a5 5 0 0 0-.25 1.25h6.01Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* e */}
                <motion.path
                  className="home-logo-title__role"
                  d="M139.16 103.6v.09c0 .48.06.94.19 1.38.13.43.31.82.56 1.15a2.7 2.7 0 0 0 2.27 1.07c.82 0 1.47-.22 1.95-.65a3.4 3.4 0 0 0 1-1.8h.6c-.18.96-.57 1.7-1.17 2.21s-1.4.77-2.4.77c-.6 0-1.14-.11-1.59-.33a3.23 3.23 0 0 1-1.13-.9c-.3-.37-.54-.82-.69-1.34a6.01 6.01 0 0 1 .01-3.33c.16-.53.39-.99.7-1.39a3.44 3.44 0 0 1 2.8-1.32 3.2 3.2 0 0 1 2.64 1.2c.3.36.52.79.68 1.27a5.1 5.1 0 0 1 .21 1.91h-6.63Zm6.03-.53c-.02-.45-.1-.88-.23-1.28s-.31-.75-.56-1.05a2.67 2.67 0 0 0-2.14-1 2.87 2.87 0 0 0-2.24 1.01c-.26.3-.45.66-.6 1.07a5 5 0 0 0-.25 1.25h6.02Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
                {/* r */}
                <motion.path
                  className="home-logo-title__role"
                  d="M147.83 101.23h.04c.08-.27.22-.52.41-.76.2-.23.44-.43.72-.6a3.59 3.59 0 0 1 2.03-.52v.61a2.9 2.9 0 0 0-1.1.1c-.41.1-.8.34-1.18.7a5.8 5.8 0 0 0-.39.47c-.1.15-.2.31-.28.5a4.5 4.5 0 0 0-.25 1.4v4.5h-.61V99.4h.6v1.83Z"
                  fillOpacity="0"
                  fill="currentColor"
                  fillRule="nonzero"
                  variants={roleAnimationVariants}
                />
              </g>
            </motion.svg>
          </h1>
        </div>
      </DefaultPageTransitionWrapper>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const path = '/';
  const homeData = await import(`../data/homePage.json`).then((m) => m.default);

  const structuredDataTemplate: ContentfulApiStructuredData = await import(
    `../data/structuredData.json`
  ).then((m) => m.default);

  return {
    props: {
      homeData: {
        ...homeData,
        templateStructuredData: structuredDataTemplate,
      },
      path,
    },
  };
};

export default Home;
