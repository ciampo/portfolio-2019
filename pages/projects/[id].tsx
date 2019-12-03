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
  dateLabel,
  clientLabel,
  linkLabel,
  linkText,
  descriptionSectionTitle,
  mediaSectionTitle,
  path,
}) =>
  project ? (
    <>
      <PageMeta title={meta.fields.title} description={meta.fields.description} path={path} />

      <DefaultPageTransitionWrapper>
        <header className="relative pt-24 md:pt-32 pb-20 sm:pb-24 md:pb-32 px-6 lg:pt-48 text-center project-header">
          <h1 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {project.title}
          </h1>

          <dl className="relative z-10 mt-4 md:mt-6 px-6 leading-relaxed md:leading-loose">
            <dt className="inline text-xs md:text-sm lg:text-base uppercase font-normal pr-2">
              {dateLabel}
            </dt>
            <dd className="inline text-sm md:text-base lg:text-lg font-thin pl-2">
              {project.date.split('-')[0]}
            </dd>

            <dt className="inline text-xs md:text-sm lg:text-base uppercase font-normal pr-2">
              {clientLabel}
            </dt>
            <dd className="inline text-sm md:text-base lg:text-lg font-thin pl-2">
              {project.client}
            </dd>

            {project.url && (
              <>
                <dt className="sr-only">{linkLabel}</dt>
                <dd className="inline text-xs md:text-sm lg:text-base uppercase font-normal">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-b-2 border-dashed border-primary outline-none focus:border-solid"
                  >
                    {linkText}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </header>

        <section className="container max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-6 my-16 sm:my-20 md:my-24 text-sm sm:text-base md:text-lg rich-text-container">
          <h2 className="sr-only">{descriptionSectionTitle}</h2>
          {documentToReactComponents(project.description)}
        </section>

        <section className="container mx-auto py-16 sm:py-20 md:py-24">
          <h2 className="sr-only">{mediaSectionTitle}</h2>
        </section>
      </DefaultPageTransitionWrapper>
    </>
  ) : null;

PageProject.getInitialProps = async ({
  pathname,
  query,
}: NextPageContext): Promise<PageProjectProps> => {
  const toReturn: PageProjectProps = {
    path: 'N/A',
    dateLabel: '2019-00-00',
    clientLabel: 'N/A',
    linkLabel: 'Link',
    linkText: 'View project',
    descriptionSectionTitle: 'Description',
    mediaSectionTitle: 'Media',
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

      toReturn.dateLabel = projectPageData[0].dateLabel;
      toReturn.clientLabel = projectPageData[0].clientLabel;
      toReturn.linkLabel = projectPageData[0].linkLabel;
      toReturn.linkText = projectPageData[0].linkText;
      toReturn.descriptionSectionTitle = projectPageData[0].descriptionSectionTitle;
      toReturn.mediaSectionTitle = projectPageData[0].mediaSectionTitle;

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
  dateLabel: PropTypes.string.isRequired,
  clientLabel: PropTypes.string.isRequired,
  linkLabel: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  descriptionSectionTitle: PropTypes.string.isRequired,
  mediaSectionTitle: PropTypes.string.isRequired,
  project: PropTypes.object,
};

export default PageProject;
