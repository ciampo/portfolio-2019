import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { NextComponentType, NextPageContext } from 'next';
import { motion } from 'framer-motion';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import { ContentfulApiPageProjectsList, ContentfulApiProject } from '../typings';
import routesConfig from '../routes-config';
import { customEaseOut } from '../components/utils/utils';

type PageProjectsListProps = ContentfulApiPageProjectsList & {
  path: string;
  projects: ContentfulApiProject[];
};

const tileAnimationVariants = {
  exit: {
    scale: 0.95,
    y: 20,
    opacity: 0,
  },
  enter: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: customEaseOut,
    },
  },
};

const singleProjectRoute = '/projects/[id]';

const ProjectTile: React.FC<{ id: string; label: string; img: { src: string; alt?: string } }> = ({
  id,
  label,
  img,
}) => (
  <motion.li className="w-full sm:w-1/2 lg:w-1/3 project-tile" variants={tileAnimationVariants}>
    <Link href={singleProjectRoute} as={`/projects/${id}`} scroll={false}>
      <a className="contain-strict relative block w-full h-0 border-4 border-background aspect-ratio-16/9 lg:aspect-ratio-4/3 overflow-hidden outline-none transition-tf-custom transition-d-300 transition-p-opacity-transform focus:z-20 focus:transform-scale-up">
        <span className="z-10 absolute bottom-0 mb-2 sm:mb-3 left-0 pl-1 pr-3 py-1 bg-background font-light text-primary text-lg md:text-xl rounded-tr rounded-br transition-inherit">
          {label}
        </span>

        <img
          className="z-0 absolute top-0 left-0 w-full h-full object-cover"
          src={`${img.src}?w=600&h=450&fit=fill&fm=jpg&q=70`}
          alt={img.alt}
        />
      </a>
    </Link>
  </motion.li>
);

ProjectTile.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  img: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
  }).isRequired,
};

const projectsAnimationVariants = {
  enter: {
    transition: {
      staggerChildren: 0.1,
      delay: 0.5,
    },
  },
};

const PageProjectsList: NextComponentType<{}, PageProjectsListProps, PageProjectsListProps> = ({
  path,
  meta,
  title,
  projects,
}) => (
  <>
    <PageMeta title={meta.fields.title} description={meta.fields.description} path={path} />

    <DefaultPageTransitionWrapper>
      <motion.section
        className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-48 container mx-auto"
        initial="exit"
        animate="enter"
        exit="exit"
        variants={projectsAnimationVariants}
      >
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{title}</h1>

        <ul className="mt-12 md:mt-24 flex flex-wrap">
          {projects.map(({ slug, title, tileImage }) => (
            <ProjectTile
              key={`project-${slug}`}
              id={slug}
              label={title}
              img={{ src: tileImage.fields.file.url, alt: tileImage.fields.description }}
            />
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
    path: '/na',
    title: 'Projects',
    meta: {
      fields: {
        title: 'Projects',
        description: 'Projects I worked on',
      },
    },
    projects: [],
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);

  if (routeConfig && routeConfig.contentfulPageId) {
    const projectsListPageData: ContentfulApiPageProjectsList[] = await import(
      `../data/${routeConfig.contentfulPageId}.json`
    ).then((m) => m.default);

    toReturn.path = pathname;
    toReturn.title = projectsListPageData[0].title;
    toReturn.meta = projectsListPageData[0].meta;
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

  return toReturn;
};

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
PageProjectsList.propTypes = {
  path: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    fields: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  }).isRequired,
  title: PropTypes.string.isRequired,
  projects: PropTypes.array.isRequired,
};

export default PageProjectsList;
