import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { joinUrl } from './utils/utils';

interface PageMetaProps {
  title: string;
  description: string;
  path: string;
  previewImage?: string;
  webPageStructuredData?: object;
  articleStructuredData?: object;
}

const PageMeta: React.FC<PageMetaProps> = ({
  title,
  description,
  path,
  previewImage,
  webPageStructuredData,
  articleStructuredData,
}) => (
  <Head>
    <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />

    <title key="page-title">{title}</title>
    <meta key="page-description" name="description" content={description} />

    {/* og:tags */}
    <meta key="page-og-title" property="og:title" content={title} />
    <meta key="page-og-description" property="og:description" content={description} />
    {previewImage && (
      <meta key="page-og-image" property="og:image" content={`https:${previewImage}`} />
    )}
    {process.env.CANONICAL_URL && (
      <meta
        key="page-og-url"
        property="og:url"
        content={joinUrl(process.env.CANONICAL_URL, path)}
      />
    )}

    {/* Structured data */}
    {webPageStructuredData && (
      <script
        type="application/ld+json"
        key="structured-data-webpage"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData),
        }}
      />
    )}
    {articleStructuredData && (
      <script
        type="application/ld+json"
        key="structured-data-article"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
    )}
  </Head>
);

PageMeta.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  previewImage: PropTypes.string.isRequired,
  webPageStructuredData: PropTypes.any,
  articleStructuredData: PropTypes.any,
};

export default PageMeta;
