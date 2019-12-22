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
    route: '/projects',
    contentfulPageId: 'pageProjects',
  },
  {
    route: '/projects/[id]',
    parentRoute: '/projects',
    contentfulPageId: 'pageProject',
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
