import React from 'react';
import PropTypes from 'prop-types';
import { NextComponentType, NextPageContext } from 'next';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import PageMeta from '../../components/PageMeta';
import DefaultPageTransitionWrapper from '../../components/page-transition-wrappers/Default';
import { ContentfulApiPageProject, ContentfulApiProject } from '../../typings';
import routesConfig from '../../routes-config';

type PageProjectProps = ContentfulApiPageProject & {
  path: string;
  project?: ContentfulApiProject;
};

const PageProject: NextComponentType<{}, PageProjectProps, PageProjectProps> = ({
  project,
  meta,
  path,
}) =>
  project ? (
    <>
      <PageMeta title={meta.fields.title} description={meta.fields.description} path={path} />

      <DefaultPageTransitionWrapper>
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-48 container mx-auto">
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {project.title}
          </h1>
          <div className="mt-12 md:mt-24 rich-text-container">
            {documentToReactComponents(project.description)}
          </div>
        </section>
      </DefaultPageTransitionWrapper>
    </>
  ) : null;

PageProject.getInitialProps = async ({
  pathname,
  query,
}: NextPageContext): Promise<PageProjectProps> => {
  const toReturn: PageProjectProps = {
    path: '/na',
    meta: {
      fields: {
        title: 'Project',
        description: 'Project',
      },
    },
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);
  if (
    routeConfig &&
    routeConfig.dynamicRoute &&
    routeConfig.dynamicRoute.contentfulItemsId &&
    routeConfig.dynamicRoute.params
  ) {
    const postData: ContentfulApiProject[] = await import(
      `../../data/${routeConfig.dynamicRoute.contentfulItemsId}.json`
    ).then((m) => m.default);

    const currentPost = postData.find((item) => {
      let matchFound = true;

      for (const [pattern, replacerFn] of Object.entries(routeConfig.dynamicRoute.params)) {
        matchFound = matchFound && query[pattern] === replacerFn(item);
      }

      return matchFound;
    });

    if (currentPost) {
      const projectPageData: ContentfulApiPageProject[] = await import(
        `../../data/${routeConfig.contentfulPageId}.json`
      ).then((m) => m.default);

      // Meta data comes from projectPageData, and then placeholders are swapped
      // for the actual title/description of the current project.
      toReturn.meta = {
        fields: {
          title: projectPageData[0].meta.fields.title.replace('[project-title]', currentPost.title),
          description: projectPageData[0].meta.fields.description.replace(
            '[project-description]',
            currentPost.title
          ),
        },
      };

      // Path and projects are set from the current project API data.
      toReturn.path = pathname;
      for (const [pattern, replacerFn] of Object.entries(routeConfig.dynamicRoute.params)) {
        toReturn.path = toReturn.path.replace(`[${pattern}]`, replacerFn(currentPost));
      }

      toReturn.project = currentPost;
    }
  }

  return toReturn;
};

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
PageProject.propTypes = {
  path: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    fields: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  }).isRequired,
  project: PropTypes.object,
};

export default PageProject;
