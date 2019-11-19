import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NextComponentType, NextPageContext } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import { ContentfulApiPageAbout } from '../typings';
import routesConfig from '../routes-config';

type PageAboutProps = {
  title: string;
  path: string;
};

const About: NextComponentType<{}, PageAboutProps, PageAboutProps> = ({ title, path }) => {
  const [exampleState] = useState('Example');

  function aboutFullTitle(exampleState: string): string {
    return `${exampleState} — ${title}`;
  }

  return (
    <>
      <PageMeta
        key="page-meta"
        title={aboutFullTitle(exampleState)}
        description="Sample descripion"
        path={path}
      />

      <DefaultPageTransitionWrapper>
        <div>{aboutFullTitle(exampleState)}</div>
      </DefaultPageTransitionWrapper>
    </>
  );
};

About.getInitialProps = async ({ pathname }: NextPageContext): Promise<PageAboutProps> => {
  const toReturn = {
    title: 'About',
    path: '/na',
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);

  if (routeConfig && routeConfig.contentfulTypeId) {
    const aboutData: ContentfulApiPageAbout[] = await import(
      `../data/${routeConfig.contentfulTypeId}.json`
    ).then((m) => m.default);

    toReturn.title = aboutData[0].title;
    toReturn.path = pathname;
  }

  return toReturn;
};

About.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default About;
