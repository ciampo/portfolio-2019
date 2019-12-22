import React from 'react';
import { INLINES, Document } from '@contentful/rich-text-types';
import {
  documentToReactComponents,
  Options,
  NodeRenderer,
} from '@contentful/rich-text-react-renderer';

const AssetLink: NodeRenderer = (node, children) => {
  const url: string = node.data ? node.data.target.fields.file.url : null;
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : null;
};

const contentfulRichTextRendererOptions: Options = {
  renderNode: {
    [INLINES.ASSET_HYPERLINK]: AssetLink,
  },
};

const RichTextRenderer = ({ richText }: { richText: Document }): JSX.Element => (
  <>{documentToReactComponents(richText, contentfulRichTextRendererOptions)}</>
);

export default RichTextRenderer;
