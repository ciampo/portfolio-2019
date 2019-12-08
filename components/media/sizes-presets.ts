import { theme } from '../../tailwind.config';

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

export { content, narrowMedia };
