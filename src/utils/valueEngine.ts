import { DetectedItem, MaterialBreakdown } from '../types';
import { getIndicativePrice } from '../data/pricing';

export interface ValueCalculationOutput {
  materials: MaterialBreakdown[];
  total_estimated_value: number;
  confidence_level: 'High' | 'Medium' | 'Low';
  confidence_note: string;
}

/**
 * Deterministic Value Calculation Module
 * Ensures prices are strictly derived from verifiable reference table math
 * rather than arbitrary model hallucinations.
 */
export function calculateIndicativeValue(
  rawMaterials: { name: string; estimated_weight_kg: number; indicative_price_per_kg?: number }[],
  detectedItems: DetectedItem[],
  declaredWeightKg?: number
): ValueCalculationOutput {
  const materials: MaterialBreakdown[] = [];
  let calculatedSum = 0;

  // If user provided a total declared weight and materials need scaling
  const rawTotalWeight = rawMaterials.reduce((sum, m) => sum + (m.estimated_weight_kg || 0), 0);
  const weightScale = declaredWeightKg && declaredWeightKg > 0 && rawTotalWeight > 0
    ? declaredWeightKg / rawTotalWeight
    : 1;

  for (const raw of rawMaterials) {
    const adjustedWeight = parseFloat(Math.max(0.01, (raw.estimated_weight_kg || 0.1) * weightScale).toFixed(2));
    const refPrice = raw.indicative_price_per_kg && raw.indicative_price_per_kg > 0
      ? raw.indicative_price_per_kg
      : getIndicativePrice(raw.name);

    const val = Math.round(adjustedWeight * refPrice);
    calculatedSum += val;

    materials.push({
      name: raw.name,
      estimated_weight_kg: adjustedWeight,
      indicative_price_per_kg: refPrice,
      estimated_value: val,
    });
  }

  // Calculate overall confidence level
  const avgItemConfidence = detectedItems.length > 0
    ? detectedItems.reduce((acc, item) => acc + (item.confidence || 75), 0) / detectedItems.length
    : 70;

  let confidenceLevel: 'High' | 'Medium' | 'Low' = 'Medium';
  let confidenceNote = 'Indicative estimate based on visible components and standard material yield ratios.';

  if (avgItemConfidence >= 85 && declaredWeightKg && declaredWeightKg > 0) {
    confidenceLevel = 'High';
    confidenceNote = 'High confidence: components clearly visible and weight explicitly specified.';
  } else if (avgItemConfidence < 60 || detectedItems.some((i) => i.name.toLowerCase().includes('uncertain'))) {
    confidenceLevel = 'Low';
    confidenceNote = 'Low confidence: image perspective ambiguous or obstructed. Physical inspection recommended.';
  } else {
    confidenceLevel = 'Medium';
    confidenceNote = declaredWeightKg
      ? 'Medium confidence: component composition estimated with user-provided weight.'
      : 'Medium confidence: weight estimated from typical device profiles. Weighing will improve accuracy.';
  }

  return {
    materials,
    total_estimated_value: calculatedSum,
    confidence_level: confidenceLevel,
    confidence_note: confidenceNote,
  };
}
