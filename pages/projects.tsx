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
    scale: 0.96,
    y: 10,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
  enter: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: customEaseOut,
    },
  },
};

const ProjectTile: React.FC<{ id: string; label: string }> = ({ id, label }) => (
  <motion.li
    className="w-1/2 xsm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 project-tile"
    variants={tileAnimationVariants}
  >
    <Link href="/post/[id]" as={`/post/${id}`}>
      <a className="flex items-center justify-center p-8 border-2 border-background bg-gray-800 h-40 text-center">
        {label}
      </a>
    </Link>
  </motion.li>
);

ProjectTile.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
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
        className="pt-20 lg:pt-48"
        initial="exit"
        animate="enter"
        exit="exit"
        variants={{ enter: { transition: { staggerChildren: 0.1, delay: 0.5 } } }}
      >
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl">{title}</h1>

        <ul className="mt-12 flex flex-wrap">
          {projects.map(({ slug, title }) => (
            <ProjectTile id={slug} label={title} key={`project-${slug}`} />
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
