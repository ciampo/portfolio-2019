import { theme } from '../../tailwind.config';

const sectionPaddingH = theme.spacing['6'];
const sectionPaddingHPx = parseFloat(sectionPaddingH) * 16;
const maxWidthXs = theme.maxWidth.xs;
const maxWidthXsPx = parseFloat(maxWidthXs) * 16;

const content = {
  resolutions: [320, 480, 640, 768, 1024, 1280],
  sizes: [`calc(100vw - 2 * ${sectionPaddingH})`].join(','),
};

const narrowMedia = {
  resolutions: [320],
  sizes: [
    `(min-width: ${maxWidthXsPx + 2 * sectionPaddingHPx}px) ${maxWidthXs}rem`,
    `calc(100vw - 2 * ${sectionPaddingH})`,
  ].join(','),
};

export { content, narrowMedia };
