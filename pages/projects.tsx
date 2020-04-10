import React from 'react';
import Link from 'next/link';
import { NextComponentType, GetStaticProps } from 'next';
import { motion } from 'framer-motion';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import { getSrcSet, getImageUrl, getRetinaResolutions } from '../components/media/image';
import { customEaseOut } from '../components/utils/utils';
import { projectTile } from '../components/media/sizes-presets';
import { generateWebpageStructuredData } from '../components/utils/structured-data';
import {
  ContentfulApiPageProjectsList,
  ContentfulApiProject,
  ContentfulMedia,
  ContentfulApiStructuredData,
} from '../typings';

type PageProjectsListProps = {
  pageData: ContentfulApiPageProjectsList;
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
  const allResolutions = getRetinaResolutions(projectTile.resolutions);

  return (
    <motion.li
      className="w-full sm:w-1/2 lg:w-1/3 relative project-tile"
      variants={tileAnimationVariants}
    >
      <Link href={singleProjectRoute} as={`/projects/${id}`} scroll={false}>
        <a className="contain-strict relative block w-full h-0 border-4 border-background aspect-ratio-16/9 lg:aspect-ratio-4/3 overflow-hidden outline-none transition-tf-custom transition-d-300 transition-p-opacity-transform focus:z-20 focus:transform-scale-up">
          <span className="z-10 absolute bottom-0 mb-2 sm:mb-3 left-0 pl-1 pr-3 py-1 bg-background font-light text-primary text-lg md:text-xl rounded-tr rounded-br transition-inherit">
            {label}
          </span>

          <img
            className="z-0 absolute top-0 left-0 w-full h-full object-cover"
            srcSet={getSrcSet(img.file.url, allResolutions, 'jpg')}
            src={getImageUrl(img.file.url, allResolutions.slice(-1)[0], 'jpg')}
            alt={img.description}
            sizes={projectTile.sizes}
            loading="lazy"
            width={img.file.details.image ? img.file.details.image.width : undefined}
            height={img.file.details.image ? img.file.details.image.height : undefined}
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
  pageData,
  projects,
}) => (
  <>
    <PageMeta
      title={pageData.meta.title}
      description={pageData.meta.description}
      previewImage={pageData.meta.previewImage.file.url}
      path={path}
      webPageStructuredData={
        pageData.templateStructuredData &&
        generateWebpageStructuredData(pageData.templateStructuredData, {
          path,
          title: pageData.meta.title,
          description: pageData.meta.description,
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
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          {pageData.title}
        </h1>

        <ul className="mt-12 md:mt-24 flex flex-wrap">
          {projects.map(({ slug, title, tileImage }) => (
            <ProjectTile key={`project-${slug}`} id={slug} label={title} img={tileImage} />
          ))}
        </ul>
      </motion.section>
    </DefaultPageTransitionWrapper>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const path = '/projects';
  const pageData = await import(`../data/pageProjects.json`).then((m) => m.default);

  const structuredDataTemplate: ContentfulApiStructuredData = await import(
    `../data/structuredData.json`
  ).then((m) => m.default);

  const projects = await import(`../data/project.json`).then((m) => m.default);

  return {
    props: {
      path,
      pageData: {
        ...pageData,
        templateStructuredData: structuredDataTemplate,
      },
      projects,
    },
  };
};

export default PageProjectsList;
