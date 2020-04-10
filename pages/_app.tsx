// import 'preact/debug';
import '../styles/index.css';

import React from 'react';
import App from 'next/app';
import { AnimatePresence } from 'framer-motion';

import MainLayout from '../components/layouts/Main';
import Analytics from '../components/utils/Analytics';

import {
  ThemeContext,
  themes,
  classNames,
  localStorageKey,
} from '../components/utils/ThemeContext';

// Read saved value from localstorage
let localStorageTheme: string;
if (process.browser) {
  let savedThemeValue;
  try {
    savedThemeValue = window.localStorage.getItem(localStorageKey);
  } catch (e) {
    console.log(`Error while retrieving theme color from localstorage: ${e}`);
  }

  if (savedThemeValue && Object.values(themes).indexOf(savedThemeValue) > -1) {
    localStorageTheme = savedThemeValue;
  }
}

export default class MyApp extends App {
  state = {
    theme: localStorageTheme || themes.DARK,
  };

  scrollToTop(): void {
    if (process.browser) {
      window.scrollTo(0, 0);
    }
  }

  persistTheme = (): void => {
    if (!process.browser) {
      return;
    }

    try {
      window.localStorage.setItem(localStorageKey, this.state.theme);
    } catch (e) {
      console.log(`Error while saving theme color to localstorage: ${e}`);
    }
  };

  retrieveTheme = (): void => {
    if (!process.browser) {
      return;
    }

    let localStorageTheme;
    try {
      localStorageTheme = window.localStorage.getItem(localStorageKey);
    } catch (e) {
      console.log(`Error while retrieving theme color from localstorage: ${e}`);
    }

    if (localStorageTheme && Object.values(themes).indexOf(localStorageTheme) > -1) {
      // this.setState({ theme: localStorageTheme }, this.applyTheme);
      console.log(localStorageTheme);
      this.setState({ theme: localStorageTheme }, () => this.applyTheme());
    }
  };

  applyTheme = (): void => {
    if (this.state.theme === themes.LIGHT) {
      document.documentElement.classList.add(classNames.LIGHT);
    } else {
      document.documentElement.classList.remove(classNames.LIGHT);
    }
  };

  toggleTheme = (): void => {
    this.setState(
      (prevState: Readonly<{ theme: string }>) => ({
        theme: prevState.theme === themes.DARK ? themes.LIGHT : themes.DARK,
      }),
      (): void => {
        this.applyTheme();
        this.persistTheme();
      }
    );
  };

  componentDidMount(): void {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    this.applyTheme();
  }

  componentWillUnmount(): void {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }
  }

  render(): JSX.Element {
    const { Component, pageProps, router } = this.props;

    return (
      <ThemeContext.Provider
        value={{
          value: this.state.theme,
          toggle: this.toggleTheme,
        }}
      >
        <Analytics />

        <MainLayout>
          <AnimatePresence initial={false} exitBeforeEnter onExitComplete={this.scrollToTop}>
            <Component {...pageProps} key={router.asPath} />
          </AnimatePresence>
        </MainLayout>
      </ThemeContext.Provider>
    );
  }
}
