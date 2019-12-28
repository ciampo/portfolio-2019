import React, { useState } from 'react';
import Link from 'next/link';
import { NextComponentType, NextPageContext } from 'next';
import { motion } from 'framer-motion';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import routesConfig from '../routes-config';
import { customEaseOut } from '../components/utils/utils';
import ContentfulImage from '../components/media/image';
import { projectTile } from '../components/media/sizes-presets';
import { generateWebpageStructuredData } from '../components/utils/structured-data';
import { initialDefaultPageProps } from '../components/utils/initial-props';
import {
  ContentfulApiPageProjectsList,
  ContentfulApiProject,
  ContentfulMedia,
  ContentfulApiStructuredData,
} from '../typings';

type PageProjectsListProps = ContentfulApiPageProjectsList & {
  path: string;
  projects: ContentfulApiProject[];
};

const tileAnimationVariants = {
  exit: {
    y: 20,
    opacity: 0,
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: customEaseOut,
    },
  },
};

const singleProjectRoute = '/projects/[id]';

const ProjectTile: React.FC<{ id: string; label: string; img: ContentfulMedia }> = ({
  id,
  label,
  img,
}) => {
  const [stallImageLazyInit, setStallImageLazyInit] = useState(true);

  function onAnimationUpdate(latest: { opacity: number }): void {
    if (latest.opacity === 1) {
      setStallImageLazyInit(false);
    }
  }

  return (
    <motion.li
      className="w-full sm:w-1/2 lg:w-1/3 relative project-tile"
      variants={tileAnimationVariants}
      onUpdate={onAnimationUpdate}
    >
      <Link href={singleProjectRoute} as={`/projects/${id}`} scroll={false}>
        <a className="contain-strict relative block w-full h-0 border-4 border-background aspect-ratio-16/9 lg:aspect-ratio-4/3 overflow-hidden outline-none transition-tf-custom transition-d-300 transition-p-opacity-transform focus:z-20 focus:transform-scale-up">
          <span className="z-10 absolute bottom-0 mb-2 sm:mb-3 left-0 pl-1 pr-3 py-1 bg-background font-light text-primary text-lg md:text-xl rounded-tr rounded-br transition-inherit">
            {label}
          </span>

          <ContentfulImage
            baseSrc={img.file.url}
            resolutions={projectTile.resolutions}
            sizes={projectTile.sizes}
            label={img.description}
            className="z-0 absolute top-0 left-0 w-full h-full"
            lazy={true}
            base64Thumb={img.file.__base64Thumb}
            stallLazyInit={stallImageLazyInit}
          />
        </a>
      </Link>
    </motion.li>
  );
};

const projectsAnimationVariants = {
  enter: {
    transition: {
      staggerChildren: 0.15,
      delay: 0.5,
      delayChildren: 0.5,
    },
  },
};

const PageProjectsList: NextComponentType<{}, PageProjectsListProps, PageProjectsListProps> = ({
  path,
  meta,
  title,
  projects,
  templateStructuredData,
}) => (
  <>
    <PageMeta
      title={meta.title}
      description={meta.description}
      previewImage={meta.previewImage.file.url}
      path={path}
      webPageStructuredData={
        templateStructuredData &&
        generateWebpageStructuredData(templateStructuredData, {
          title: meta.title,
          description: meta.description,
        })
      }
    />

    <DefaultPageTransitionWrapper>
      <motion.section
        className="pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 container mx-auto"
        initial="exit"
        animate="enter"
        exit="exit"
        variants={projectsAnimationVariants}
      >
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{title}</h1>

        <ul className="mt-12 md:mt-24 flex flex-wrap">
          {projects.map(({ slug, title, tileImage }) => (
            <ProjectTile key={`project-${slug}`} id={slug} label={title} img={tileImage} />
          ))}
        </ul>
      </motion.section>
    </DefaultPageTransitionWrapper>
  </>
);

PageProjectsList.getInitialProps = async ({
  pathname,
}: NextPageContext): Promise<PageProjectsListProps> => {
  const toReturn: PageProjectsListProps = {
    ...initialDefaultPageProps,
    path: '/projects',
    title: 'Projects',
    projects: [],
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);

  if (routeConfig && routeConfig.contentfulPageId) {
    const projectsListPageData: ContentfulApiPageProjectsList = await import(
      `../data/${routeConfig.contentfulPageId}.json`
    ).then((m) => m.default);

    toReturn.path = pathname;
    toReturn.title = projectsListPageData.title;
    toReturn.meta = projectsListPageData.meta;
  }

  const singleProjectPage = routesConfig.find(({ route }) => route === singleProjectRoute);

  if (
    singleProjectPage &&
    singleProjectPage.dynamicRoute &&
    singleProjectPage.dynamicRoute.contentfulItemsId
  ) {
    const projectsData: ContentfulApiProject[] = await import(
      `../data/${singleProjectPage.dynamicRoute.contentfulItemsId}.json`
    ).then((m) => m.default);

    if (projectsData) {
      toReturn.projects = projectsData.sort((a, b) => {
        const dA = Date.parse(a.date);
        const dB = Date.parse(b.date);

        return dA < dB ? 1 : dA > dB ? -1 : 0;
      });
    }
  }

  const structuredDataTemplate: ContentfulApiStructuredData = await import(
    `../data/structuredData.json`
  ).then((m) => m.default);
  toReturn.templateStructuredData = structuredDataTemplate;

  return toReturn;
};

export default PageProjectsList;
