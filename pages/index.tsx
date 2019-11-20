import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { NextComponentType, NextPageContext } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import { ContentfulApiPageHome } from '../typings';
import routesConfig from '../routes-config';

type PageHomeProps = ContentfulApiPageHome & {
  path: string;
};

const PostLink: React.FC<{ id: string; label: string }> = ({ id, label }) => (
  <li>
    <Link href="/post/[id]" as={`/post/${id}`}>
      <a>{label}</a>
    </Link>
  </li>
);

PostLink.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const dotSize = 1;
const tileSize = 32;
const dotOffset = tileSize - 1;

const Home: NextComponentType<{}, PageHomeProps, PageHomeProps> = ({ path, meta, pageTitle }) => (
  <>
    <PageMeta title={meta.fields.title} description={meta.fields.description} path={path} />

    <DefaultPageTransitionWrapper>
      <div className="dot-grid flex w-full h-screen items-center justify-center relative">
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

        <h1 className="text-primary bg-background z-10 pointer-events-none home-logo-sizing">
          <span className="sr-only">{pageTitle}</span>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <g fill="none" fillRule="evenodd">
              <path
                d="M62.47 36.45l-12 29.2h-5l-12.03-29.2v29.2h-6.23v-40.9h7.7L47.97 56.8l13.04-32.05h7.72v40.9h-6.26v-29.2zm27.57 11.16v-2.04c0-3.13-2.1-4.98-5.68-4.98-3.31 0-5.47 1.53-5.99 4.11l-.04.2h-6.2l.01-.27c.36-5.64 5.24-9.47 12.45-9.47 7.29 0 12 3.88 12 9.94v20.54h-6.32v-4.4c-1.86 3-5.45 4.9-9.22 4.9-5.95 0-10.09-3.7-10.09-9.12 0-5.3 4.1-8.55 11.22-8.95l7.86-.46zm0 4.7l-7 .43c-3.5.24-5.45 1.74-5.45 4.12 0 2.42 2 4 5.14 4 4.13 0 7.31-2.82 7.31-6.5v-2.05zm16.13-12.43a7.27 7.27 0 017-4.66c.6 0 1.18.06 1.82.17l.5.1v6.2l-.34-.14a8.6 8.6 0 00-2.63-.32c-3.76 0-6.07 2.49-6.07 6.53v17.88h-6.57V35.7h6.29v4.18zm35.13 6.18l.02.27h-6.27l-.04-.2c-.64-3.28-3.1-5.43-6.69-5.43-4.58 0-7.53 3.83-7.53 9.97 0 6.23 2.93 9.97 7.59 9.97 3.57 0 5.95-1.92 6.63-5.26l.05-.2h6.32l-.03.27c-.66 6.45-5.85 10.75-13.03 10.75-8.69 0-14.21-5.97-14.21-15.53 0-9.44 5.57-15.5 14.15-15.5 7.33 0 12.45 4.56 13.04 10.89zm14.73 20.14c-8.69 0-14.27-6-14.27-15.53 0-9.5 5.6-15.5 14.27-15.5s14.27 6 14.27 15.5c0 9.53-5.58 15.53-14.27 15.53zm0-5.48c4.7 0 7.59-3.73 7.59-10.05 0-6.29-2.91-10.02-7.59-10.02s-7.59 3.73-7.59 10.02c0 6.31 2.9 10.05 7.59 10.05zM44.57 111.18c-11.55 0-18.82-8.15-18.82-21.13 0-12.9 7.33-21.1 18.82-21.1 9.33 0 16.36 5.73 17.44 14.26l.04.29h-6.72l-.05-.2c-1.1-5.07-5.32-8.37-10.7-8.37-7.23 0-11.9 5.9-11.9 15.12 0 9.3 4.62 15.14 11.92 15.14 5.52 0 9.45-2.8 10.69-7.56l.05-.19h6.75l-.05.3c-1.57 8.47-8.03 13.44-17.47 13.44zM67.9 76.3a3.75 3.75 0 01-3.76-3.72 3.73 3.73 0 013.76-3.72 3.73 3.73 0 110 7.44zm3.28 34.2h-6.57V80.57h6.57v29.95zm21.54-18.03v-2.03c0-3.13-2.1-4.98-5.68-4.98-3.31 0-5.47 1.53-6 4.1l-.03.2h-6.2l.01-.26c.36-5.64 5.23-9.47 12.44-9.47 7.3 0 12 3.88 12 9.93v20.55h-6.32v-4.4c-1.86 3-5.44 4.9-9.22 4.9-5.94 0-10.08-3.71-10.08-9.12 0-5.31 4.09-8.56 11.22-8.96l7.86-.46zm0 4.7l-7.01.43c-3.5.25-5.44 1.75-5.44 4.12 0 2.42 2 4 5.14 4 4.13 0 7.3-2.82 7.3-6.49v-2.06zm16.13-12.25c1.54-3.02 4.59-4.86 8.29-4.86 4.04 0 7.04 2 8.35 5.51 1.64-3.44 5.11-5.51 9.26-5.51 5.98 0 9.92 3.96 9.92 9.96v20.49h-6.6V91.48c0-3.68-1.94-5.74-5.4-5.74-3.44 0-5.84 2.53-5.84 6.13v18.64h-6.46V91.03c0-3.25-2.05-5.3-5.34-5.3-3.43 0-5.9 2.67-5.9 6.33v18.45h-6.57V80.56h6.29v4.36zm45.66 21.2v14.13h-6.57V80.56h6.37v4.56a10.52 10.52 0 019.28-5.04c7.7 0 12.7 6.06 12.7 15.45 0 9.4-4.97 15.48-12.59 15.48-4 0-7.34-1.81-9.19-4.88zm7.48-.73c4.64 0 7.56-3.78 7.56-9.86 0-6.05-2.93-9.85-7.56-9.85-4.5 0-7.5 3.92-7.5 9.85 0 5.99 2.97 9.86 7.5 9.86zm19.87-29.09a3.75 3.75 0 01-3.76-3.72 3.73 3.73 0 013.76-3.72 3.73 3.73 0 110 7.44zm3.28 34.2h-6.57V80.57h6.57v29.95zm9.93-25.52c1.78-3.16 4.97-4.92 9.19-4.92 6.6 0 10.5 4.2 10.5 11.14v19.3h-6.6V92.38c0-4.35-2.02-6.6-6.04-6.6-4.1 0-6.77 2.88-6.77 7.33v17.4h-6.57V80.57h6.29v4.42zm26.45-8.68a3.75 3.75 0 01-3.77-3.72 3.73 3.73 0 013.77-3.72 3.73 3.73 0 110 7.44zm-3.29 34.2V80.57h6.57v29.95h-6.57z"
                stroke="currentColor"
                strokeWidth="0.05rem"
                fillOpacity=".05"
                fill="currentColor"
                fillRule="nonzero"
              />
              <path
                d="M55.64 162.08H52.6l-5.3 20.1h-.07l-5.89-20.1h-3.04l-5.9 20.1h-.06l-5.3-20.1H24l6.73 23.44h3.19l5.86-19.45h.07l5.9 19.45h3.18l6.7-23.44zm19.4 16.79c-.66 2.57-3.14 4.42-6.71 4.42-4.71 0-7.74-3.3-7.74-8.59v-.18h17.72v-1.26c0-6.99-3.96-11.56-10.23-11.56-6.42 0-10.58 4.89-10.58 12.17 0 7.43 4.12 12.03 10.76 12.03 5.2 0 9.05-2.97 9.76-7.03h-2.98zm-7-14.56c4.27 0 7.11 3.23 7.18 7.84h-14.6c.25-4.61 3.18-7.84 7.41-7.84zm25.67 21.6c5.96 0 10-4.8 10-12.11 0-7.3-4.04-12.1-9.98-12.1a8.54 8.54 0 00-8.1 5.27h-.06V153h-3.03v32.52h2.9v-4.96h.06a8.66 8.66 0 008.2 5.34zm-.57-21.57c4.55 0 7.48 3.74 7.48 9.46 0 5.75-2.93 9.46-7.48 9.46-4.46 0-7.6-3.83-7.6-9.46 0-5.61 3.17-9.46 7.6-9.46zm-58.04 57.3a8.71 8.71 0 008.19-5.35h.06v4.96h2.87v-32.52H43.2v13.9h-.07a8.55 8.55 0 00-8.1-5.2c-5.94 0-10.05 4.8-10.05 12.1 0 7.28 4.14 12.1 10.12 12.1zm.52-21.57c4.5 0 7.6 3.8 7.6 9.46 0 5.68-3.1 9.46-7.6 9.46-4.55 0-7.55-3.74-7.55-9.46 0-5.72 3-9.46 7.55-9.46zm32.34 14.53c-.66 2.57-3.14 4.42-6.7 4.42-4.66 0-7.67-3.22-7.74-8.4v-.37h17.72V209c0-6.99-3.96-11.56-10.24-11.56-6.41 0-10.57 4.89-10.57 12.17 0 7.43 4.11 12.03 10.76 12.03 5.2 0 9.05-2.97 9.75-7.03h-2.98zm-7-14.56c4.27 0 7.12 3.23 7.19 7.84h-14.6c.24-4.61 3.18-7.84 7.4-7.84zm32.86-2.23h-3.14l-7.2 20.3h-.07l-7.2-20.3h-3.17l8.8 23.44h3.2l8.78-23.44zm19.31 16.79c-.66 2.57-3.14 4.42-6.7 4.42-4.71 0-7.74-3.3-7.74-8.59v-.18h17.72V209c0-6.99-3.96-11.56-10.24-11.56-6.41 0-10.57 4.89-10.57 12.17 0 7.43 4.11 12.03 10.75 12.03 5.21 0 9.06-2.97 9.76-7.03h-2.98zm-7-14.56c4.27 0 7.12 3.23 7.18 7.84h-14.6c.25-4.61 3.19-7.84 7.42-7.84zm14.5 21.2h3.01v-32.51h-3v32.52zm18 .4c6.43 0 10.78-4.67 10.78-12.11 0-7.46-4.35-12.1-10.78-12.1-6.42 0-10.78 4.64-10.78 12.1 0 7.44 4.34 12.1 10.78 12.1zm0-2.65c-4.64 0-7.71-3.51-7.71-9.46 0-5.95 3.07-9.46 7.7-9.46 4.65 0 7.74 3.51 7.74 9.46 0 5.95-3.1 9.46-7.73 9.46zm25.86-21.56a8.65 8.65 0 00-8.14 5.34h-.1v-4.96h-2.84V229h3v-12.57h.1a8.49 8.49 0 008.05 5.2c5.93 0 10-4.8 10-12.1 0-7.28-4.1-12.1-10.07-12.1zm-.53 21.56c-4.48 0-7.55-3.8-7.55-9.46 0-5.63 3.07-9.46 7.55-9.46 4.58 0 7.53 3.76 7.53 9.46 0 5.72-2.95 9.46-7.53 9.46zm30.98-4.39c-.66 2.57-3.14 4.42-6.7 4.42-4.66 0-7.67-3.22-7.74-8.4v-.37h17.72V209c0-6.99-3.96-11.56-10.24-11.56-6.41 0-10.57 4.89-10.57 12.17 0 7.43 4.11 12.03 10.75 12.03 5.21 0 9.06-2.97 9.76-7.03h-2.98zm-7-14.56c4.27 0 7.12 3.23 7.18 7.84h-14.6c.25-4.61 3.19-7.84 7.42-7.84zm14.3 21.2v-23.43h2.85v4.17h.06c.87-2.86 3.07-4.55 5.99-4.55.8 0 1.5.16 1.86.25v2.93a6.14 6.14 0 00-2.25-.34c-3.37 0-5.5 2.59-5.5 6.38v14.6h-3z"
                fillOpacity=".5"
                fill="currentColor"
                fillRule="nonzero"
              />
            </g>
          </svg>
        </h1>
      </div>
    </DefaultPageTransitionWrapper>
  </>
);

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
