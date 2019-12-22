export type ContentfulApiStructuredData = {
  id: string;
  _updatedAt: string;
  author: {
    ['@context']: string;
    ['@type']: string;
    name: string;
    email: string;
    gender: string;
    sameAs: string;
    jobTitle: string;
    description: string;
    nationality: {
      ['@type']: string;
      address: {
        ['@type']: string;
        addressCountry: string;
      };
    };
  };
  organisation: {
    ['@context']: string;
    ['@type']: string;
    url: string;
    logo: {
      url: string;
      ['@type']: string;
      width: string;
      height: string;
    };
    name: string;
    email: string;
    founder: string;
  };
  website: {
    ['@context']: string;
    ['@type']: string;
    url: string;
    name: string;
    publisher: string;
  };
  webpage: {
    ['@context']: string;
    ['@type']: string;
    url: string;
    name: string;
    isPartOf: string;
    inLanguage: string;
    description: string;
  };
  article: {
    ['@context']: string;
    ['@type']: string;
    image: string;
    author: string;
    headline: string;
    publisher: string;
    dateModified: string;
    datePublished: string;
  };
};
