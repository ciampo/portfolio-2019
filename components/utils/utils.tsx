export const joinUrl = (a: string, b: string): string =>
  a.replace(/\/+$/, '') + '/' + b.replace(/^\/+/, '');
