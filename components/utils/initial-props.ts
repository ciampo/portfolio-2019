import { ContentfulApiPageGeneric } from '../../typings';

export const initialDefaultPageProps: ContentfulApiPageGeneric = {
  meta: {
    title: 'Page Title',
    description: 'Page Description',
    previewImage: {
      title: 'Sample preview image',
      file: {
        url: '',
        contentType: '',
        fileName: '',
        details: {
          size: -1,
          image: {
            width: -1,
            height: -1,
          },
        },
      },
    },
  },
  navTitle: undefined,
  templateStructuredData: undefined,
};
