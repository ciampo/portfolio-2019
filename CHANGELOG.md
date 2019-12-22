# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

<!--
## [X.Y.X] - YYYY-MM-DD

### Added

for new features.

### Changed

for changes in existing functionality.

### Deprecated

for soon-to-be removed features.

### Removed

for now removed features.

### Fixed

for any bug fixes.

### Security

in case of vulnerabilities.
-->

## [1.0.0-rc.4] - 2019-12-22

### Added

- Added Structured Data (Author, Organization, WebSite, WebPages + breadcrumbs, Article)

### Changed

- Theme Switcher isnow position absolute (previously was fixed)
- Lazy load Web Font (+ JS fallback)

### Fixed

- Link to CV in about page
- Contentful Rich Text Renderer can now handle Assets links

### Removed

- dead code in home grid for setting `fillcolor`

## [1.0.0-rc.3] - 2019-12-21

### Fixed

- theme switcher aria label
- CSS variables value set in :root instead of html selector

## [1.0.0-rc.2] - 2019-12-21

### Changed

- dark/light theme now changes with a toggle button and perists on localstorage
- homepage logo: thinner, no blur, heavier box shadow

## [1.0.0-rc.1] - 2019-12-20

### Fixed

- better nav spinner out transition
- prevented browser's native scroll restoration, as it conflicts with next router and page transitions

### Changed

- videos now autoplay inline while being muted
- narrow media are now displayed on destkop side-by-side

## [0.0.10] - 2019-12-16

### Changed

- more explicit page loading spinner in the Nav component
- use Trillium Web font instead of system fonts

## [0.0.9] - 2019-12-13

### Changed

- tweaked grid config (slower waves, smaller dots, larger grid gaps, centered programmatic waves...)
- removed loading spinner, replaced with animated nav link underline
- nav menu keeps the mobile menu on desktop too
- use rAF when loading full res in lazy image
- updated browserlist

### Fixed

- base64 thumb qualitty back to 10 (below 10 itt loses color info)
- project page's text size is same as about page
- netlify headers file uses placeholders instead of all the explicit routes

## [0.0.8] - 2019-12-11

### Fixed

- moved shared tailwind config to separate file, avoids pulling all of tailwind deps (including full lodash) into the clientside bundle
- `Content-Security-Policy` and `X-XSS-Protection` HTTP headers applied only to HTML pages
- Correct `Content-Type` for `.js` and `.webmanifest` files
- Correct `<meta name="vieport" />` tag

## [0.0.7] - 2019-12-09

### Added

- contentful data download script:
  - singleton option
  - slim down API objects by removing all `sys` and `fields`
  - download all images base64 thumb and attach to API data
- media components:
  - lazy image
  - video
  - `sizes` presets

### Changed

- project media structure: now split between wide and narrow pictures
- using lazy image in project tiles
- single project hero markup/background color, sections spacing

### Fixed

- Force page to be scrolled to top inbetween page transitions.

## [0.0.6] - 2019-12-03

### Added

- home page logo enter animation (per letter)
- home page logo neon effect
- home page lazy-loading interactive grid
- top right corner spinner while transitioning between pages
- individual project page header

### Changed

- nav links compute selected property automously inside the Nav component
- project tiles background color

## [0.0.5] - 2019-11-25

### Added

- "selected" nav links
- staggered enter animations on about page
- project page: meta, title and description

### Changed

- `/post/[id]` => `/projects/[id]`
- styles: created custom tailwind utilities, replacing custom css code
- ux: avoiding hover styles (improved touch screen experience)
- new home logo (shorter, stronger type hierarchy)
- nav links styles ('|_' replaced with dot)

### Fixed

- prevented home page from bouncing

## [0.0.4] - 2019-11-23

### Added

- About page: using contentful data for meta
- Profile illustration
- Bio (rich text) rendering and styles

## [0.0.3] - 2019-11-21

### Added

- Home - logo `enter` animation
- Projects list page:
  - project tiles markup/styles
  - project tiles staggered `enter` animation (server-side and no-js proof)
- error page spacing
- nav items `hover`/`focus` styles
- tailwind `xsm` breakpoint
- tailwind `aspect-ratio` plugin
- split css code across multiple files

## [0.0.2] - 2019-11-20

### Changed

- `routes-config.js` structure and how it's used within the project
- more subtle page transitions

### Removed

- footer removed from `MainLayout`

### Added

- contentful data for home page and nav
- new `Nav`
- homepage, with static grid placeholder

## [0.0.1] - 2019-11-17

### Added

- Initial commit from next.js template repository
- Added changelog
- Updated README and added Netlify badge
- Updated package.json

[Unreleased]: https://github.com/ciampo/portfolio-2019/compare/v1.0.0-rc.4...HEAD
<!-- [X.Y.Z]: https://github.com/ciampo/portfolio-2019/compare/v1.0.0-rc.4...vX.Y.Z -->
[X.Y.Z]: https://github.com/ciampo/portfolio-2019/compare/v1.0.0-rc.3...v1.0.0-rc.4
[1.0.0-rc.2]: https://github.com/ciampo/portfolio-2019/compare/v1.0.0-rc.2...v1.0.0-rc.3
[1.0.0-rc.2]: https://github.com/ciampo/portfolio-2019/compare/v1.0.0-rc.1...v1.0.0-rc.2
[1.0.0-rc.1]: https://github.com/ciampo/portfolio-2019/compare/v0.0.10...v1.0.0-rc.1
[0.0.10]: https://github.com/ciampo/portfolio-2019/compare/v0.0.9...v0.0.10
[0.0.9]: https://github.com/ciampo/portfolio-2019/compare/v0.0.8...v0.0.9
[0.0.8]: https://github.com/ciampo/portfolio-2019/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/ciampo/portfolio-2019/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/ciampo/portfolio-2019/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/ciampo/portfolio-2019/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/ciampo/portfolio-2019/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/ciampo/portfolio-2019/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/ciampo/portfolio-2019/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/ciampo/portfolio-2019/releases/tag/v0.0.1
