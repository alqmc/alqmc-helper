export const kebabCase = (str: string): string => {
  str = str.replace(str.charAt(0), str.charAt(0).toLocaleLowerCase());
  return str.replace(
    /([a-z])([A-Z])/g,
    (_, p1, p2) => `${p1}-${p2.toLowerCase()}`
  );
};

export const camelize = (str: string): string => {
  return str.replace(/-(\w)/g, (_: any, p: string) => p.toUpperCase());
};

export const bigCamelize = (str: string): string => {
  return camelize(str).replace(str.charAt(0), str.charAt(0).toUpperCase());
};

/**
 * 比较tag 大驼峰形式、连字符形式、小驼峰
 * @param tag
 * @param word
 * @returns
 */
export const compareTag = (tag: string, word: string) => {
  if (tag === word) return true;
  if (
    tag === kebabCase(word) ||
    tag === bigCamelize(word) ||
    tag === camelize(word)
  )
    return true;
  if (
    word === kebabCase(tag) ||
    word === bigCamelize(tag) ||
    word === camelize(tag)
  )
    return true;
  return false;
};
