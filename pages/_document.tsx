import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
  DocumentProps,
} from 'next/document';

import { ContentfulApiGlobalMeta } from '../typings';

type CustomDocumentProps = {
  previewSharingImage: string;
};

// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

class CustomDocument extends Document<DocumentProps & CustomDocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & CustomDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);

    const globalMeta: ContentfulApiGlobalMeta = await import('../data/globalMeta.json').then(
      (m) => m.default
    );

    return {
      previewSharingImage: globalMeta.previewImage.file.url,
      ...initialProps,
    };
  }

  render(): JSX.Element {
    const previewSharingImage = this.props.previewSharingImage.startsWith('//')
      ? `https:${this.props.previewSharingImage}`
      : this.props.previewSharingImage;
    return (
      <Html lang="en">
        <Head>
          <meta name="twitter:card" content="summary" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={previewSharingImage} />

          {/* Manifests */}
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="msapplication-config" content="/browserconfig.xml" />

          {/* Icons & theme colors */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="theme-color" content="#ffffff"></meta>

          {/* This allows styles based on JS being supported or not */}
          <script
            dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js-app')` }}
          ></script>

          {/* Perf improvements */}
          <link
            rel="preconnect dns-prefetch"
            href="https://www.google-analytics.com"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
