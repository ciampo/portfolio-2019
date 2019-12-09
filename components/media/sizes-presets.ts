import { sharedTheme } from '../../tailwind.shared';

// This sharedTheme import (instead of the whole tailwind config) enables
// massive savings in terms of bundle size are achieved by
// not importing tailwind's config directly.

function remToPx(rem: string): number {
  return parseFloat(rem) * 16;
}

function pxToRem(px: string): number {
  return parseFloat(px) / 16;
}

const sectionPaddingH = sharedTheme.spacing['6'];
const sectionPaddingHPx = remToPx(sectionPaddingH);
const maxWidthXs = sharedTheme.maxWidth.xs;
const maxWidthXsPx = remToPx(maxWidthXs);

const content = {
  resolutions: [320, 480, 640, 768, 1024, 1280],
  sizes: [
    `(min-width: ${sharedTheme.screens.xl}) calc(${pxToRem(
      sharedTheme.screens.xl
    )}rem - 2 * ${sectionPaddingH})`,
    `(min-width: ${sharedTheme.screens.lg}) calc(${pxToRem(
      sharedTheme.screens.lg
    )}rem - 2 * ${sectionPaddingH})`,
    `(min-width: ${sharedTheme.screens.md}) calc(${pxToRem(
      sharedTheme.screens.md
    )}rem - 2 * ${sectionPaddingH})`,
    `(min-width: ${sharedTheme.screens.sm}) calc(${pxToRem(
      sharedTheme.screens.sm
    )}rem - 2 * ${sectionPaddingH})`,
    `(min-width: ${sharedTheme.screens.xsm}) calc(${pxToRem(
      sharedTheme.screens.xsm
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
    `(min-width: ${sharedTheme.screens.xl}) calc(${pxToRem(sharedTheme.screens.xl) /
      3}rem - 2 * ${pxToRem('4px')}rem)`,
    `(min-width: ${sharedTheme.screens.lg}) calc(${pxToRem(sharedTheme.screens.lg) /
      3}rem - 2 * ${pxToRem('4px')}rem)`,
    `(min-width: ${sharedTheme.screens.md}) calc(${pxToRem(sharedTheme.screens.md) /
      2}rem - 2 * ${pxToRem('4px')}rem)`,
    `(min-width: ${sharedTheme.screens.sm}) calc(${pxToRem(sharedTheme.screens.sm) /
      2}rem - 2 * ${pxToRem('4px')}rem)`,
    `(min-width: ${sharedTheme.screens.xsm}) calc(${pxToRem(
      sharedTheme.screens.xsm
    )}rem - 2 * ${pxToRem('4px')}rem)`,
    `calc(100vw - 2 * ${pxToRem('4px')}rem)`,
  ].join(','),
};

export { content, narrowMedia, projectTile };
