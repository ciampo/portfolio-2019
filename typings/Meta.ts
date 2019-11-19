import { ContentfulMedia } from './contentful';

export type ContentfulApiGlobalMeta = {
  previewImage: ContentfulMedia;
};

export type Meta = {
  fields: {
    title: string;
    description: string;
  };
};
