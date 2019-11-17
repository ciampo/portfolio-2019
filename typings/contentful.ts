export type ContentfulFile = {
  url: string;
  details: {
    size: number;
    image: { width: number; height: number };
  };
  fileName: string;
  contentType: string;
};

export type ContentfulMedia = {
  fields: {
    title: string;
    description?: string;
    file: ContentfulFile;
  };
};
