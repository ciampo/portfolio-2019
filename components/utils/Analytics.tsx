import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import Router from 'next/router';

const pageView = (): void => {
  if (window.IS_GA_INIT) {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }
};

const Analytics: React.FC<{}> = (): null => {
  useEffect(() => {
    // Init GA the first time.
    if (!window.IS_GA_INIT && process.env.GA) {
      ReactGA.initialize(process.env.GA);
      window.IS_GA_INIT = true;
    }

    // Send a pageview event
    pageView();

    // Send a pageview event every time a new route is activated.
    Router.events.on('routeChangeComplete', pageView);

    return (): void => {
      // Cleanup subscriptions / event listeners.
      Router.events.off('routeChangeComplete', pageView);
    };
  }, []);

  return null;
};

export default Analytics;
