# Marco Ciampini 2019 portfolio website

[![Netlify Status](https://api.netlify.com/api/v1/badges/6c7b4b9a-84ef-4e4b-a0ce-500d5ab06b37/deploy-status)](https://app.netlify.com/sites/marco-ciampini-portfolio-2019/deploys)

Personal portfolio website based on [this next.js template](https://github.com/ciampo/_nextjs-template).

## Setup 📝

- install `node` glolbally
- install `yarn` glolbally
- set up Contentful, Netlify and Google Analytics
- copy `.env.example` and rename it to `env`. Add the correct values for the env variables.
- add the same env variables to Netlify
- `yarn install`

## Main scripts ⚙️

### `yarn dev`

Starts the application in development mode (hot-code reloading, error reporting, etc)

### `yarn data`

Pulls data from contentful (make sure you added env variables both into a `.env` and into your Netlify project)

### `yarn static`

Builds the app in production mode and exports it as static site ready to be hosted on Netlify.

### `yarn serve:static`

Serves the static site. The application should be compiled with `yarn static` first.

## Other scripts 🛠

### `yarn build`

Compiles the application for production deployment (SSR).

### `yarn serve:ssr`

Starts and serves the application in production mode. The application should be compiled with `yarn build` first.

### `yarn analyze`

Builds the app and opens 2 graphs in the browser showing the app's bundle composition.

### `yarn test`

Lints scripts and styles.

### `yarn test:fix`

Lints scripts and styles, and tries to auto-fix any errors.

## Coming Soon ⌛️

Caught up!

## Nice to have 💭

- inline critical styles. It's not supported out of the box, but there may be a few inspirational examples (like [this one](https://github.com/zeit/next.js/pull/3451)). Also, follow [this GH issue](https://github.com/GoogleChromeLabs/critters/issues/44).

## Contributors

- [Marco Ciampini](https://github.com/ciampo)
