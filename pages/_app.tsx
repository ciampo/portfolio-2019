import '../styles/index.css';

import React from 'react';
import App, { AppContext, AppInitialProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';

import MainLayout from '../components/layouts/Main';
import Analytics from '../components/utils/Analytics';
import routesConfig from '../routes-config';
import { ContentfulApiPageGeneric, UiLink } from '../typings';

type CustomAppProps = AppInitialProps & {
  navLinks: UiLink[];
};

export default class MyApp extends App<CustomAppProps> {
  static async getInitialProps({ Component, ctx }: AppContext): Promise<CustomAppProps> {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const navLinks: UiLink[] = [];
    for (const { route, contentfulPageId } of routesConfig) {
      if (contentfulPageId) {
        const routeData: ContentfulApiPageGeneric[] = await import(
          `../data/${contentfulPageId}.json`
        ).then((m) => m.default);

        if (routeData[0] && routeData[0].navTitle) {
          navLinks.push({
            href: route,
            label: routeData[0].navTitle,
          });
        }
      }
    }

    return { pageProps, navLinks };
  }

  render(): JSX.Element {
    const { Component, pageProps, router, navLinks } = this.props;

    navLinks.forEach((navLink) => {
      navLink.selected = router.route === navLink.href;
    });

    return (
      <>
        <Analytics />

        <MainLayout navLinks={navLinks}>
          <AnimatePresence initial={false} exitBeforeEnter>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </MainLayout>
      </>
    );
  }
}
