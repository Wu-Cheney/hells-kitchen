export function getTotalTime(prepTime: string, cookTime: string) {
  const prepMinutes = parseMinutes(prepTime);
  const cookMinutes = parseMinutes(cookTime);
  const totalMinutes = prepMinutes + cookMinutes;

  if (totalMinutes <= 0) {
    return "Time unavailable";
  }

  return `${totalMinutes} minutes`;
}

function parseMinutes(time: string) {
  const match = time.match(/\d+/);

  if (!match) {
    return 0;
  }

  return Number(match[0]);
}
