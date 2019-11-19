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

const Home: NextComponentType<{}, PageHomeProps, PageHomeProps> = ({ path, meta, pageTitle }) => (
  <>
    <PageMeta title={meta.fields.title} description={meta.fields.description} path={path} />

    <DefaultPageTransitionWrapper>
      <h1>{pageTitle}</h1>
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

  if (routeConfig && routeConfig.contentfulTypeId) {
    const homeData: ContentfulApiPageHome[] = await import(
      `../data/${routeConfig.contentfulTypeId}.json`
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
