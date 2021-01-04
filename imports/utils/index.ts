
export const makeAtmosphereLink = (packageName: string): string => {
  const path = packageName.includes(':') ? packageName.replace(':', '/') : `meteor/${packageName}`;
  return `https://atmospherejs.com/${path}`;
};
