const getBackendURL = (type: 'ws' | 'http' = 'http'): string => {
  const domain = process.env.NEXT_PUBLIC_CORE_BACKEND_DOMAIN;
  const urlType =
    process.env.NEXT_PUBLIC_CORE_BACKEND_USE_HTTPS === 'true'
      ? `${type}s`
      : type;

  return `${urlType}://${domain}`;
};

export { getBackendURL };
