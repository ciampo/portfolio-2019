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

const ProjectTile: React.FC<{ id: string; label: string; img: { src: string; alt?: string } }> = ({
  id,
  label,
  img,
}) => (
  <motion.li
    className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 project-tile"
    variants={tileAnimationVariants}
  >
    <Link href="/post/[id]" as={`/post/${id}`} scroll={false}>
      <a className="relative block w-full border-2 border-background h-0 aspect-ratio-16/9 xsm:aspect-ratio-21/9 sm:aspect-ratio-16/9 lg:aspect-ratio-4/3 xl:aspect-ratio-square overflow-hidden outline-none">
        <span className="absolute top-0 left-0 w-full h-full px-6 py-4 bg-background font-light text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl">
          {label}
        </span>

        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={`${img.src}?w=600&h=600&fit=fill&fm=jpg&q=70`}
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
    const homeData: ContentfulApiPageProjectsList[] = await import(
      `../data/${routeConfig.contentfulPageId}.json`
    ).then((m) => m.default);

    toReturn.path = pathname;
    toReturn.title = homeData[0].title;
    toReturn.meta = homeData[0].meta;
  }

  const projectsData: ContentfulApiProject[] = await import(`../data/project.json`).then(
    (m) => m.default
  );

  if (projectsData) {
    toReturn.projects = projectsData.sort((a, b) => {
      const dA = Date.parse(a.date);
      const dB = Date.parse(b.date);

      return dA < dB ? 1 : dA > dB ? -1 : 0;
    });
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
