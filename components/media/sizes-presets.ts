// This replicates the values in the tailwind config.
// Massive savings in terms of bundle size are achieved by
// not importing tailwind's config directly.

// @TODO: move this config in a common place, then use it
// in both this file and the tailwind config.
const theme = {
  screens: {
    xsm: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  spacing: {
    '6': '1.5rem',
  },
  maxWidth: {
    xs: '20rem',
  },
};

function remToPx(rem: string): number {
  return parseFloat(rem) * 16;
}

function pxToRem(px: string): number {
  return parseFloat(px) / 16;
}

const sectionPaddingH = theme.spacing['6'];
const sectionPaddingHPx = remToPx(sectionPaddingH);
const maxWidthXs = theme.maxWidth.xs;
const maxWidthXsPx = remToPx(maxWidthXs);

const content = {
  resolutions: [320, 480, 640, 768, 1024, 1280],
  sizes: [
    `(min-width: ${theme.screens.xl}) calc(${pxToRem(
      theme.screens.xl
    )}rem - 2 * ${sectionPaddingH})`,
    `(min-width: ${theme.screens.lg}) calc(${pxToRem(
      theme.screens.lg
    )}rem - 2 * ${sectionPaddingH})`,
    `(min-width: ${theme.screens.md}) calc(${pxToRem(
      theme.screens.md
    )}rem - 2 * ${sectionPaddingH})`,
    `(min-width: ${theme.screens.sm}) calc(${pxToRem(
      theme.screens.sm
    )}rem - 2 * ${sectionPaddingH})`,
    `(min-width: ${theme.screens.xsm}) calc(${pxToRem(
      theme.screens.xsm
    )}rem - 2 * ${sectionPaddingH})`,
    `calc(100vw - 2 * ${sectionPaddingH})`,
  ].join(','),
};

const narrowMedia = {
  resolutions: [320],
  sizes: [
    `(min-width: ${maxWidthXsPx + 2 * sectionPaddingHPx}px) ${maxWidthXs}rem`,
    `calc(100vw - 2 * ${sectionPaddingH})`,
  ].join(','),
};

const projectTile = {
  resolutions: [312, 334, 376, 419, 472],
  sizes: [
    `(min-width: ${theme.screens.xl}) calc(${pxToRem(theme.screens.xl) / 3}rem - 2 * ${pxToRem(
      '4px'
    )}rem)`,
    `(min-width: ${theme.screens.lg}) calc(${pxToRem(theme.screens.lg) / 3}rem - 2 * ${pxToRem(
      '4px'
    )}rem)`,
    `(min-width: ${theme.screens.md}) calc(${pxToRem(theme.screens.md) / 2}rem - 2 * ${pxToRem(
      '4px'
    )}rem)`,
    `(min-width: ${theme.screens.sm}) calc(${pxToRem(theme.screens.sm) / 2}rem - 2 * ${pxToRem(
      '4px'
    )}rem)`,
    `(min-width: ${theme.screens.xsm}) calc(${pxToRem(theme.screens.xsm)}rem - 2 * ${pxToRem(
      '4px'
    )}rem)`,
    `calc(100vw - 2 * ${pxToRem('4px')}rem)`,
  ].join(','),
};

export { content, narrowMedia, projectTile };
