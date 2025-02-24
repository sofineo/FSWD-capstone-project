export function lbsToKg(lbs: number): number {
  return Number((lbs / 2.20462).toFixed(2)); 
}

export function kgToLbs(kg: number): number {
  return Number((kg * 2.20462).toFixed(2));
}

export function feetInchesToCm(feet: number, inches: number = 0): number {
  return Number((feet * 30.48 + inches * 2.54).toFixed(2));
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}
