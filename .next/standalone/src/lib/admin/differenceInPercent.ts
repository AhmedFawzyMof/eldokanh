export const differenceInPercent = (a: number, b: number) => {
  if (a !== 0 && b !== 0) {
    return Math.abs(((b - a) / a) * 100).toFixed(1);
  }

  return 0;
};
