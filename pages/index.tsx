import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { NextComponentType } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import { ContentfulApiProject } from '../typings';

type PageHomeProps = {
  projects: ContentfulApiProject[];
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

const Home: NextComponentType<{}, PageHomeProps, PageHomeProps> = ({ projects }) => (
  <>
    <PageMeta title="Netx.js modern template" description="Sample descripion" path="/" />

    <DefaultPageTransitionWrapper>
      <div className="w-full text-gray-700">
        <h1 className="m-0 w-fullleading-tight text-5xl text-center">Next.js template</h1>
        <p className="text-center">Just a little help to get started with all the right stuff.</p>
      </div>

      <nav>
        <ul>
          {projects.map((p) => (
            <PostLink id={p.slug} label={p.title} key={`home-post-link${p.slug}`} />
          ))}
        </ul>
      </nav>
    </DefaultPageTransitionWrapper>
  </>
);

Home.getInitialProps = async (): Promise<PageHomeProps> => {
  const projects: ContentfulApiProject[] = await import('../data/project.json').then(
    (m) => m.default
  );

  return { projects };
};

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
Home.propTypes = {
  projects: PropTypes.array,
};

export default Home;
