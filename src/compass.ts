export const compassPoints = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"] as const;

export function normalizeDegrees(value: number): number | undefined {
  return Number.isFinite(value) ? ((value % 360) + 360) % 360 : undefined;
}

export function compassPoint(value: number, sectors: 8 | 16 = 16): typeof compassPoints[number] | undefined {
  const degrees = normalizeDegrees(value);
  if (degrees === undefined) return undefined;
  const index = Math.round(degrees / (360 / sectors)) % sectors;
  return compassPoints[index * (16 / sectors)];
}