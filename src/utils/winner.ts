export function winner(str: readonly string[]) {
  const slugPoints = str.reduce<Record<string, number>>(
    (obj, slug) => {
      obj[slug] = (obj[slug] || 0) + 1;
      return obj;
    },
    {},
  );

  const maxScore = Math.max(...Object.values(slugPoints), 0);
  const winners = Object.entries(slugPoints).filter(([, score]) => score === maxScore);

  const [maybeWinner, ...maybeJustifiedWinners] = winners;

  if (maybeJustifiedWinners.length)
    throw new Error('Unable to resolve conclusively.');

  if (!maybeWinner) throw new Error('Not found.');

  return maybeWinner[0];
}
