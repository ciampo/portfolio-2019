import '../styles/index.css';

import React from 'react';
import App from 'next/app';
import { AnimatePresence } from 'framer-motion';

import MainLayout from '../components/layouts/Main';
import Analytics from '../components/utils/Analytics';

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps, router } = this.props;

    return (
      <>
        <Analytics />

        <MainLayout>
          <AnimatePresence initial={false} exitBeforeEnter>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </MainLayout>
      </>
    );
  }
}
