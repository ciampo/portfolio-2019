import { Document } from '@contentful/rich-text-types';

import { ContentfulMedia } from './contentful';

export type ContentfulApiProject = {
  id: string;
  title: string;
  slug: string;
  tileImage: ContentfulMedia;
  client: string;
  url: string;
  date: string;
  description: Document;
  media: ContentfulMedia[];
};
