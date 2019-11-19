module.exports = [
  {
    route: '/',
    contentfulPageId: 'homePage',
  },
  {
    route: '/about',
    contentfulPageId: 'about',
  },
  {
    route: '/post/[id]',
    dynamicRoute: {
      contentfulItemsId: 'project',
      params: {
        // Replace "[id]" with the slug of the contentful item
        // and pass the slug to the router query under the "id" key.
        id: (contentItem) => contentItem.slug,
      },
    },
  },
];
