const UNIT_TO_GRAMS = {
  g: 1,
  gram: 1,
  grams: 1,

  kg: 1000,

  oz: 28,
  ounce: 28,
  ounces: 28,

  lb: 454,
  pound: 454,
  pounds: 454,

  ml: 1,
  l: 1000,

  tsp: 5,
  tbsp: 15,

  cup: 250,
  cups: 250,

  can: 400,

  whole: 150,
  piece: 100,
  pieces: 100,

  small: 100,
  medium: 150,
  large: 200,

  clove: 5,
  cloves: 5,

  leaf: 1,
  leaves: 1,

  sheet: 3,
  sheets: 3,

  head: 600,
  bunch: 250,
};

function convertToGrams(amount, unit) {
  const normalizedUnit = String(unit || "")
    .toLowerCase()
    .trim();
  const gramsPerUnit = UNIT_TO_GRAMS[normalizedUnit];

  if (!gramsPerUnit) {
    return amount * 100;
  }

  return amount * gramsPerUnit;
}

module.exports = {
  convertToGrams,
};
