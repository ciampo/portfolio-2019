import { ContentfulMedia } from './contentful';

export type ContentfulApiProject = {
  title: string;
  slug: string;
  date: string;
  tileImage: ContentfulMedia;
};
