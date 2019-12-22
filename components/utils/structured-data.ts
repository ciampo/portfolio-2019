import { ContentfulApiStructuredData } from '../../typings';

interface PostInfo {
  title: string;
  image: string;
  publicationDate: string;
  modifiedDate: string;
}

interface BreadcrumbPage {
  name: string;
  url: string;
}

interface PageInfo {
  title: string;
  description: string;
  breadcrumbsPages?: BreadcrumbPage[];
}

const generateBreadcrumbs = (breadcrumbsPages: BreadcrumbPage[]): object => ({
  ['@context']: 'https://schema.org',
  ['@type']: 'BreadcrumbList',
  itemListElement: breadcrumbsPages.map(({ name, url }, i) => ({
    ['@type']: 'ListItem',
    position: i + 1,
    name,
    item: `${process.env.CANONICAL_URL || ''}${url}`,
  })),
});

const generateWebsiteStructuredData = (data: ContentfulApiStructuredData): object =>
  JSON.parse(
    JSON.stringify(data.website)
      .replace(/":organization"/g, JSON.stringify(data.organisation))
      .replace(/":author"/g, JSON.stringify(data.author))
      .replace(/:canonicalUrl/g, process.env.CANONICAL_URL || '')
  );

const generateWebpageStructuredData = (
  data: ContentfulApiStructuredData,
  pageInfo: PageInfo
): object => {
  const webpageData = JSON.parse(
    JSON.stringify(data.webpage)
      .replace(/":website"/g, JSON.stringify(data.website))
      .replace(/":organization"/g, JSON.stringify(data.organisation))
      .replace(/":author"/g, JSON.stringify(data.author))
      .replace(/:canonicalUrl/g, process.env.CANONICAL_URL || '')
      .replace(/:pageTitle/g, pageInfo.title)
      .replace(/:pageDescription/g, pageInfo.description)
  );

  if (pageInfo.breadcrumbsPages && pageInfo.breadcrumbsPages.length > 0) {
    webpageData.breadcrumb = generateBreadcrumbs(pageInfo.breadcrumbsPages);
  }

  return webpageData;
};

const generateArticleStructuredData = (
  data: ContentfulApiStructuredData,
  postInfo: PostInfo
): object =>
  JSON.parse(
    JSON.stringify(data.article)
      .replace(/":organization"/g, JSON.stringify(data.organisation))
      .replace(/":author"/g, JSON.stringify(data.author))
      .replace(/:canonicalUrl/g, process.env.CANONICAL_URL || '')
      .replace(/:headline/g, postInfo.title)
      .replace(/:image/g, postInfo.image)
      .replace(/:datePublished/g, postInfo.publicationDate)
      .replace(/:dateModified/g, postInfo.modifiedDate)
  );

export {
  generateWebsiteStructuredData,
  generateWebpageStructuredData,
  generateArticleStructuredData,
};
