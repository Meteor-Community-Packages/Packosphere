
export const makeAtmosphereLink = (packageName: string) => {
  const path = packageName.includes(':') ? packageName.replace(':', '/') : `meteor/${packageName}`;
  return `https://atmospherejs.com/${path}`;
};
