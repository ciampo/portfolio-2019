import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import Router from 'next/router';

const pageView = (): void => {
  if (window.IS_GA_INIT) {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }
};

const Analytics: React.FC<{}> = (): null => {
  useEffect(() => {
    // Init GA the first time.
    if (!window.IS_GA_INIT && process.env.GA) {
      ReactGA.initialize(process.env.GA, {
        gtagOptions: {
          // Disable automatic page view (to work properly, it also needs to disable
          // enhanced measurement on GA4 dashboard)
          // https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag#disable_pageview_measurement
          // eslint-disable-next-line @typescript-eslint/camelcase
          send_page_view: false,
        },
      });
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
