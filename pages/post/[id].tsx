import React from 'react';
import PropTypes from 'prop-types';
import { NextComponentType, NextPageContext } from 'next';

import PageMeta from '../../components/PageMeta';
import DefaultPageTransitionWrapper from '../../components/page-transition-wrappers/Default';
import { ContentfulApiProject } from '../../typings';
import routesConfig from '../../routes-config';

type PagePostProps = {
  title: string;
  path: string;
};

const Post: NextComponentType<{}, PagePostProps, PagePostProps> = ({ title, path }) => (
  <>
    <PageMeta title={title} description="A blog post" path={path} />

    <DefaultPageTransitionWrapper>
      <h1>{title}</h1>
      <p>This is the blog post content.</p>
    </DefaultPageTransitionWrapper>
  </>
);

Post.getInitialProps = async ({ pathname, query }: NextPageContext): Promise<PagePostProps> => {
  const toReturn = {
    title: 'Post',
    path: pathname,
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);
  if (routeConfig && routeConfig.contentfulTypeId) {
    const postData: ContentfulApiProject[] = await import(
      `../../data/${routeConfig.contentfulTypeId}.json`
    ).then((m) => m.default);

    if (routeConfig.params) {
      const currentPost = postData.find((item) => {
        let matchFound = true;

        for (const [pattern, replacerFn] of Object.entries(routeConfig.params)) {
          matchFound = matchFound && query[pattern] === replacerFn(item);
        }

        return matchFound;
      });

      if (currentPost) {
        toReturn.path = pathname;
        for (const [pattern, replacerFn] of Object.entries(routeConfig.params)) {
          toReturn.path = toReturn.path.replace(`[${pattern}]`, replacerFn(currentPost));
        }

        toReturn.title = currentPost.title;
      }
    }
  }

  return toReturn;
};

Post.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default Post;
