interface PostInfo {
  title: string;
  image: string;
  publicationDate: string;
}

// TODO: get data from contentful
const author = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Marco Ciampini',
  // description: 'TODO',
  email: 'marco.ciampo@gmail.com',
  gender: 'Male',
  jobTitle: 'Web Developer',
  nationality: {
    '@type': 'Country',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IT',
    },
  },
  sameAs: 'https://twitter.com/marco_ciampini',
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: process.env.CANONICAL_URL,
  name: 'Marco Ciampini, Web Developer',
  publisher: author,
};

const generatePostStructuredData = (postInfo: PostInfo): object => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: postInfo.title,
  author: author,
  publisher: author,
  image: postInfo.image,
  datePublished: postInfo.publicationDate,
});

export { author, website, generatePostStructuredData };
