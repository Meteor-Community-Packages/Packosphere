const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const makePackosphereLink = (packageName: string): string => {
  const path = packageName.includes(':') ? packageName.replace(':', '/') : `meteor/${packageName}`;
  return `https://packosphere.com/${path}`;
};

export const getAgeInYears = (date: Date | undefined): number => {
  if (typeof date !== 'undefined') {
    const diff = new Date(Date.now() - date.getTime());

    return diff.getUTCFullYear() - 1970;
  }
  return 0;
};

export const formatDateToString = (date: Date): string => {
  return `${months[date.getMonth()]} ${date.getDay()}, ${date.getFullYear()}`;
};

export const setClipboardText = async (text: string): Promise<void> => {
  return await navigator.clipboard.writeText(text);
};
