import React from 'react';
import { NextComponentType, GetStaticProps, GetStaticPaths } from 'next';

import PageMeta from '../../components/PageMeta';
import ContentfulImage from '../../components/media/image';
import ContentfulVideo from '../../components/media/video';
import DefaultPageTransitionWrapper from '../../components/page-transition-wrappers/Default';
import routesConfig from '../../routes-config';
import { content, narrowMedia } from '../../components/media/sizes-presets';
import RichTextRenderer from '../../components/utils/RichTextRenderer';
import {
  generateWebpageStructuredData,
  generateArticleStructuredData,
} from '../../components/utils/structured-data';
import {
  ContentfulApiPageProject,
  ContentfulApiProject,
  ContentfulMedia,
  ContentfulApiStructuredData,
  ContentfulApiPageProjectsList,
} from '../../typings';

type PageProjectProps = {
  path: string;
  pageData: ContentfulApiPageProject;
  project?: ContentfulApiProject;
  parentPage?: {
    path: string;
    title: string;
  };
};

const PROJECT_PAGE_ROUTE = '/projects/[id]';

const articleMedia = (
  mediaObj: {
    source: ContentfulMedia;
  },
  sizePreset: {
    sizes: string;
    resolutions: number[];
  },
  wrapperClassName?: string
): JSX.Element => (
  <div className={wrapperClassName}>
    {/video/.test(mediaObj.source.file.contentType) ? (
      <ContentfulVideo src={mediaObj.source.file.url} className="mb-24" />
    ) : (
      <ContentfulImage
        baseSrc={mediaObj.source.file.url}
        resolutions={sizePreset.resolutions}
        sizes={sizePreset.sizes}
        label={mediaObj.source.description}
        className="relative mb-24"
        ratio={
          mediaObj.source.file.details.image
            ? mediaObj.source.file.details.image.height / mediaObj.source.file.details.image.width
            : undefined
        }
        lazy={true}
        base64Thumb={mediaObj.source.file.__base64Thumb}
      />
    )}
  </div>
);

const PageProject: NextComponentType<{}, PageProjectProps, PageProjectProps> = ({
  project,
  pageData,
  path,
  parentPage,
}) => {
  if (!project) {
    return null;
  }

  let webPageStructuredData;
  let articleStructuredData;
  if (pageData.templateStructuredData) {
    webPageStructuredData = generateWebpageStructuredData(pageData.templateStructuredData, {
      path,
      title: pageData.meta.title,
      description: pageData.meta.description,
      breadcrumbsPages: parentPage && [
        {
          name: parentPage.title,
          url: parentPage.path,
        },
      ],
    });

    articleStructuredData = generateArticleStructuredData(pageData.templateStructuredData, {
      title: project.title,
      image: `https:${project.tileImage.file.url}?w=1280&fit=fill&fm=jpg&q=70`,
      publicationDate: project.publicationDate,
      modifiedDate: project._updatedAt,
      webPageStructuredData,
    });
  }

  return (
    <>
      <PageMeta
        title={pageData.meta.title}
        description={pageData.meta.description}
        previewImage={pageData.meta.previewImage.file.url}
        path={path}
        webPageStructuredData={webPageStructuredData}
        articleStructuredData={articleStructuredData}
      />

      <DefaultPageTransitionWrapper>
        <header className="relative pt-24 md:pt-32 lg:pt-40 pb-20 sm:pb-24 md:pb-32 px-6 text-center project-header">
          <h1 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {project.title}
          </h1>

          <dl className="relative z-10 mt-4 md:mt-6 px-6 leading-relaxed md:leading-loose">
            <dt className="inline text-xs md:text-sm lg:text-base uppercase font-normal pr-2">
              {pageData.dateLabel}
            </dt>
            <dd className="inline text-sm md:text-base lg:text-lg font-thin pl-2">
              {project.date.split('-')[0]}
            </dd>

            <dt className="inline text-xs md:text-sm lg:text-base uppercase font-normal pr-2">
              {pageData.clientLabel}
            </dt>
            <dd className="inline text-sm md:text-base lg:text-lg font-thin pl-2">
              {project.client}
            </dd>

            {project.url && (
              <>
                <dt className="sr-only">{pageData.linkLabel}</dt>
                <dd className="inline text-xs md:text-sm lg:text-base uppercase font-normal">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block pt-2 border-b-2 border-dashed border-primary outline-none focus:border-solid"
                  >
                    {pageData.linkText}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </header>

        <section className="container max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-6 my-16 sm:my-20 md:my-24 rich-text-container">
          <h2 className="sr-only">{pageData.descriptionSectionTitle}</h2>
          <RichTextRenderer richText={project.description} />
        </section>

        <section className="container mx-auto px-6 mt-24 sm:mt-32 md:mt-40 mb-16 sm:mb-20 md:mb-24">
          <h2 className="sr-only">{pageData.mediaSectionTitle}</h2>

          {/* Wide pictures */}
          {project.widePictures &&
            project.widePictures.map((mediaObj) => articleMedia(mediaObj, content))}

          <div className="project-narrow-media-container">
            {/* Narrow pictures */}
            {project.narrowPictures &&
              project.narrowPictures.map((mediaObj) => articleMedia(mediaObj, narrowMedia))}
          </div>
        </section>
      </DefaultPageTransitionWrapper>
    </>
  );
};

// SSG

type StaticPath = { params: { [key: string]: string } };

// Get all the paths that should be statically generated
export const getStaticPaths: GetStaticPaths = async () => {
  const projectRoute = routesConfig.find(({ route }) => route === PROJECT_PAGE_ROUTE);

  if (!projectRoute || !projectRoute.dynamicRoute || !projectRoute.dynamicRoute.contentfulItemsId) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const allProjects: ContentfulApiProject[] = await import(
    `../../data/${projectRoute.dynamicRoute.contentfulItemsId}.json`
  ).then((m) => m.default);

  const paths: StaticPath[] = allProjects.map((item) => {
    const projectPath: StaticPath = { params: {} };

    for (const [pattern, replacerFn] of Object.entries(projectRoute.dynamicRoute.params)) {
      projectPath.params[pattern] = replacerFn(item);
    }

    return projectPath;
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params) {
    return { props: {} };
  }

  const projectRoute = routesConfig.find(({ route }) => route === PROJECT_PAGE_ROUTE);

  if (!projectRoute || !projectRoute.dynamicRoute || !projectRoute.dynamicRoute.contentfulItemsId) {
    return { props: {} };
  }

  // Page data
  const pageData: ContentfulApiPageProject = await import(
    `../../data/${projectRoute.contentfulPageId}.json`
  ).then((m) => m.default);
  if (!pageData) {
    return { props: {} };
  }

  // Project data
  const allProjects: ContentfulApiProject[] = await import(
    `../../data/${projectRoute.dynamicRoute.contentfulItemsId}.json`
  ).then((m) => m.default);

  const project = allProjects.find((item) => {
    let matchFound = true;

    for (const [pattern, replacerFn] of Object.entries(projectRoute.dynamicRoute.params)) {
      matchFound = matchFound && (context.params || {})[pattern] === replacerFn(item);
    }

    return matchFound;
  });

  if (!project) {
    return { props: {} };
  }

  // Path
  let path = projectRoute.route;
  for (const [pattern, replacerFn] of Object.entries(projectRoute.dynamicRoute.params)) {
    path = path.replace(`[${pattern}]`, replacerFn(project));
  }

  const parentRoute = routesConfig.find(({ route }) => route === projectRoute.parentRoute);
  if (!parentRoute) {
    return { props: {} };
  }

  const parentPageData: ContentfulApiPageProjectsList = await import(
    `../../data/${parentRoute.contentfulPageId}.json`
  ).then((m) => m.default);

  const structuredDataTemplate: ContentfulApiStructuredData = await import(
    `../../data/structuredData.json`
  ).then((m) => m.default);

  // Parent page
  return {
    props: {
      path,
      pageData: {
        ...pageData,
        meta: {
          ...pageData.meta,
          title: pageData.meta.title.replace('[project-title]', project.title),
          description: pageData.meta.description.replace('[project-description]', project.title),
        },
        templateStructuredData: structuredDataTemplate,
      },
      project,
      parentPage: {
        path: projectRoute.parentRoute,
        title: parentPageData.title,
      },
    },
  };
};

export default PageProject;
