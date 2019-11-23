import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType, NextPageContext } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import { ContentfulApiPageAbout } from '../typings';
import routesConfig from '../routes-config';

type PageAboutProps = ContentfulApiPageAbout & {
  path: string;
};

const About: NextComponentType<{}, PageAboutProps, PageAboutProps> = ({
  meta,
  path,
  title,
  bio,
}) => {
  return (
    <>
      <PageMeta
        key="page-meta"
        title={meta.fields.title}
        description={meta.fields.description}
        path={path}
      />

      <DefaultPageTransitionWrapper>
        <h1 className="px-6 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{title}</h1>
      </DefaultPageTransitionWrapper>
    </>
  );
};

About.getInitialProps = async ({ pathname }: NextPageContext): Promise<PageAboutProps> => {
  const toReturn: PageAboutProps = {
    path: '/na',
    title: 'About me',
    meta: {
      fields: {
        title: 'About',
        description: 'About page',
      },
    },
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);

  if (routeConfig && routeConfig.contentfulPageId) {
    const aboutData: ContentfulApiPageAbout[] = await import(
      `../data/${routeConfig.contentfulPageId}.json`
    ).then((m) => m.default);

    toReturn.path = pathname;
    toReturn.title = aboutData[0].title;
    toReturn.meta = aboutData[0].meta;
    toReturn.bio = aboutData[0].bio;
  }

  return toReturn;
};

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
About.propTypes = {
  path: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    fields: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  }).isRequired,
  title: PropTypes.string.isRequired,
  bio: PropTypes.object,
};

export default About;
