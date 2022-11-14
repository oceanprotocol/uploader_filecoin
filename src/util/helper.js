export const replaceKeyWords = (array, keyword, value) => {
  return JSON.parse(JSON.stringify(array).replaceAll(keyword, value));
};
