const appUrlFromEnv =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_APP_URL;

if (!appUrlFromEnv) {
  throw new Error(
    "`NEXT_PUBLIC_APP_URL` (or `NEXT_APP_URL`) must be configured to resolve the application origin.",
  );
}

const normalizedAppUrl = appUrlFromEnv.endsWith("/")
  ? appUrlFromEnv.slice(0, -1)
  : appUrlFromEnv;

export const getAppUrl = (): string => normalizedAppUrl;

export const buildAppUrl = (pathname = ""): string => {
  if (!pathname) {
    return normalizedAppUrl;
  }

  return `${normalizedAppUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
};
