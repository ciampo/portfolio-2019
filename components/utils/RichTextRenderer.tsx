import React from 'react';
import { INLINES, Document } from '@contentful/rich-text-types';
import {
  documentToReactComponents,
  Options,
  NodeRenderer,
} from '@contentful/rich-text-react-renderer';
import ReactGA from 'react-ga4';

const AssetLink: NodeRenderer = (node, children) => {
  const url: string = node.data ? node.data.target.fields.file.url : null;

  function sendGaEvent(): void {
    if (window.IS_GA_INIT) {
      ReactGA.event({
        category: 'User',
        action: 'Clicked on asset link',
        label: url,
      });
    }
  }

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" onPointerDown={sendGaEvent}>
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
