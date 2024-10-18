export const normalizeCount = (val?: string) => {
  if (val === undefined) {
    return 0;
  }

  const parsedInt = parseInt(val);

  if (Number.isNaN(parsedInt)) {
    return 0;
  }

  return parsedInt;
};
