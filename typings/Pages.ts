import { Document } from '@contentful/rich-text-types';

import { Meta } from './Meta';
import { ContentfulApiStructuredData } from './StructuredData';

export type ContentfulApiPageGeneric = {
  meta: Meta;
  navTitle?: string;
  templateStructuredData?: ContentfulApiStructuredData;
};

export type ContentfulApiPageHome = ContentfulApiPageGeneric & {
  pageTitle: string;
};

export type ContentfulApiPageAbout = ContentfulApiPageGeneric & {
  title: string;
  bio?: Document;
};

export type ContentfulApiPageProjectsList = ContentfulApiPageGeneric & {
  title: string;
};

export type ContentfulApiPageProject = ContentfulApiPageGeneric & {
  dateLabel: string;
  clientLabel: string;
  linkLabel: string;
  linkText: string;
  descriptionSectionTitle: string;
  mediaSectionTitle: string;
};
