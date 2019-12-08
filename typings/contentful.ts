export type ContentfulFile = {
  url: string;
  details: {
    size: number;
    image?: { width: number; height: number };
  };
  fileName: string;
  contentType: string;
  __base64Thumb?: string;
};

export type ContentfulMedia = {
  fields: {
    title: string;
    description?: string;
    file: ContentfulFile;
  };
};
