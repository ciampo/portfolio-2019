import React from 'react';
import Link from 'next/link';
import { INLINES, Document } from '@contentful/rich-text-types';
import {
  documentToReactComponents,
  Options,
  NodeRenderer,
} from '@contentful/rich-text-react-renderer';

const AssetLink: NodeRenderer = (node, children) => {
  const url: string = node.data ? node.data.target.fields.file.url : null;
  return url ? (
    <Link href={url}>
      <a target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Link>
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
