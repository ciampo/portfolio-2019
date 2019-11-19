module.exports = [
  {
    route: '/',
    contentfulTypeId: 'homePage',
  },
  {
    route: '/about',
    contentfulTypeId: 'about',
  },
  {
    route: '/post/[id]',
    contentfulTypeId: 'project',
    params: {
      // Replace "[id]" with the slug of the contentful item
      // and pass the slug to the router query under the "id" key.
      id: (contentItem) => contentItem.slug,
    },
  },
];
