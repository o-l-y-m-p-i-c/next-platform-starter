export function formatNumber(
  num: number,
  after: number = 2,
  fixedAfter = 1,
): string {
  if (Math.abs(num) >= 10 ** 12) {
    return (num / 10 ** 12).toFixed(fixedAfter).replace(/\.0$/, '') + 'T';
  } else if (Math.abs(num) >= 10 ** 9) {
    return (num / 10 ** 9).toFixed(fixedAfter).replace(/\.0$/, '') + 'B';
  } else if (Math.abs(num) >= 10 ** 6) {
    return (num / 10 ** 6).toFixed(fixedAfter).replace(/\.0$/, '') + 'M';
  } else if (Math.abs(num) >= 10 ** 3) {
    return (num / 10 ** 3).toFixed(fixedAfter).replace(/\.0$/, '') + 'K';
  }
  return num.toFixed(after);
}
