export function getTotalTime(prepTime: string, cookTime: string) {
  const prepMinutes = parseMinutes(prepTime);
  const cookMinutes = parseMinutes(cookTime);
  const totalMinutes = prepMinutes + cookMinutes;

  if (totalMinutes <= 0) {
    return "Time unavailable";
  }

  return formatMinutes(totalMinutes);
}

// Matches one or more consecutive digits anywhere in string
function parseMinutes(time: string) {
  const match = time.match(/\d+/);

  if (!match) {
    return 0;
  }

  return Number(match[0]);
}

function formatMinutes(totalMinutes: number) {
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

export function getScaledAmount(amount: string, scale: number) {
  const numericAmount = parseIngredientAmount(amount);
  const scaledAmount = numericAmount * scale;

  return formatScaledAmount(scaledAmount);
}

function parseIngredientAmount(amount: string) {
  const normalizedAmount = String(amount || "").trim();

  if (normalizedAmount.includes("/")) {
    const [numerator, denominator] = normalizedAmount.split("/").map(Number);

    if (!numerator || !denominator) {
      return 0;
    }

    return numerator / denominator;
  }

  const parsedAmount = Number(normalizedAmount);

  return Number.isNaN(parsedAmount) ? 0 : parsedAmount;
}

function formatScaledAmount(amount: number) {
  if (Number.isInteger(amount)) {
    return String(amount);
  }

  return Number(amount.toFixed(2)).toString();
}
