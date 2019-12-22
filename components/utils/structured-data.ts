import { ContentfulApiStructuredData } from '../../typings';

interface PostInfo {
  title: string;
  image: string;
  publicationDate: string;
  modifiedDate: string;
}

const generateWebsiteStructuredData = (data: ContentfulApiStructuredData): object =>
  JSON.parse(
    JSON.stringify(data.website)
      .replace(/":organization"/g, JSON.stringify(data.organisation))
      .replace(/":author"/g, JSON.stringify(data.author))
      .replace(/:canonicalUrl/g, process.env.CANONICAL_URL || '')
  );

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

export { generateWebsiteStructuredData, generateArticleStructuredData };
