export const getFetchConcurrently = async (...args) => {
  const [...getData] = await Promise.all(...args);
  return getData;
};
