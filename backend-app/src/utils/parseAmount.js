function parseAmount(amount) {
  if (!amount) {
    return 0;
  }

  const normalizedAmount = String(amount).trim();

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

module.exports = {
  parseAmount,
};
