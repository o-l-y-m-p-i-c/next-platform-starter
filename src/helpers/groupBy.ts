// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const groupBy = (arr: any[], keyFn: any) => {
  return arr.reduce((result, currentValue) => {
    const key = keyFn(currentValue);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(currentValue);

    return result;
  }, {});
};
