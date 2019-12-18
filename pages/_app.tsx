import '../styles/index.css';

import React, { useEffect } from 'react';
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
        const routeData: ContentfulApiPageGeneric = await import(
          `../data/${contentfulPageId}.json`
        ).then((m) => m.default);

        if (routeData && routeData.navTitle) {
          navLinks.push({
            href: route,
            label: routeData.navTitle,
          });
        }
      }
    }

    return { pageProps, navLinks };
  }

  scrollToTop(): void {
    if (process.browser) {
      window.scrollTo(0, 0);
    }
  }

  render(): JSX.Element {
    const { Component, pageProps, router, navLinks } = this.props;

    useEffect(() => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      return (): void => {
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'auto';
        }
      };
    }, []);

    return (
      <>
        <Analytics />

        <MainLayout navLinks={navLinks}>
          <AnimatePresence initial={false} exitBeforeEnter onExitComplete={this.scrollToTop}>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </MainLayout>
      </>
    );
  }
}
