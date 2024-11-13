export const truncateString = (str: string, maxLength: number = 32): string => {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};
