import { Document } from '@contentful/rich-text-types';

import { Meta } from './Meta';

export type ContentfulApiPageGeneric = {
  meta: Meta;
  navTitle?: string;
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
