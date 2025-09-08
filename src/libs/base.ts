export const base: string = process.env.NODE_ENV === "production" ? "/front_6th_chapter4-2" : "";

export const withBase = (path: string) => {
  const isProd = import.meta.env.PROD;

  if (isProd) {
    return `${base}${path}`;
  }

  return path;
};
