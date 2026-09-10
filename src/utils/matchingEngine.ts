import { Recycler } from '../types';
import { DEMO_RECYCLERS } from '../data/recyclers';

export interface MatchInput {
  detectedMaterials: string[];
  eWasteTypes: string[];
  weightKg?: number;
  locationCity?: string;
  locationState?: string;
  hasHazardousComponents: boolean;
}

// Approximate city coordinates for distance calculation
const KNOWN_CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.209 },
  'new delhi': { lat: 28.6139, lng: 77.209 },
  noida: { lat: 28.5355, lng: 77.391 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  pune: { lat: 18.5204, lng: 73.8567 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  surat: { lat: 21.1702, lng: 72.8311 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  indore: { lat: 22.7196, lng: 75.8577 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  kochi: { lat: 9.9312, lng: 76.2673 },
};

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function matchRecyclers(
  input: MatchInput,
  recyclerPool: Recycler[] = DEMO_RECYCLERS,
  limit: number = 5
): Recycler[] {
  const userCityKey = input.locationCity?.toLowerCase().trim() || 'mumbai';
  const userCoords = KNOWN_CITY_COORDS[userCityKey] || KNOWN_CITY_COORDS['mumbai'];
  const weight = input.weightKg || 5;

  const scoredRecyclers = recyclerPool.map((rec) => {
    const reasons: string[] = [];

    // 1. Material compatibility (35%)
    let matchedMaterialsCount = 0;
    const matchedMaterialNames: string[] = [];
    if (input.detectedMaterials.length > 0) {
      for (const mat of input.detectedMaterials) {
        const found = rec.accepted_materials.some((acc) =>
          acc.toLowerCase().includes(mat.toLowerCase()) || mat.toLowerCase().includes(acc.toLowerCase())
        );
        if (found) {
          matchedMaterialsCount++;
          matchedMaterialNames.push(mat);
        }
      }
    }
    const materialRatio = input.detectedMaterials.length > 0
      ? matchedMaterialsCount / input.detectedMaterials.length
      : 0.7;
    const materialScore = materialRatio * 35;
    if (matchedMaterialNames.length > 0) {
      reasons.push(`Accepts key detected materials (${matchedMaterialNames.slice(0, 2).join(', ')})`);
    }

    // 2. E-waste type compatibility (20%)
    let typeRatio = 0.5;
    if (input.eWasteTypes.length > 0) {
      const typeMatches = input.eWasteTypes.filter((t) =>
        rec.accepted_e_waste_types.some((at) => at.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(at.toLowerCase()))
      );
      typeRatio = typeMatches.length > 0 ? 1 : 0.2;
      if (typeMatches.length > 0) {
        reasons.push(`Processes ${typeMatches[0]} e-waste stream directly`);
      }
    }
    const typeScore = typeRatio * 20;

    // 3. Location proximity (15%)
    const distanceKm = calculateHaversineDistance(
      userCoords.lat,
      userCoords.lng,
      rec.latitude,
      rec.longitude
    );
    let locationScore = 0;
    if (distanceKm <= 20) {
      locationScore = 15;
      reasons.push(`Within ${distanceKm} km in ${rec.city}`);
    } else if (distanceKm <= 50) {
      locationScore = 12;
      reasons.push(`Located nearby (~${distanceKm} km)`);
    } else if (distanceKm <= 150) {
      locationScore = 8;
    } else if (rec.state.toLowerCase().includes(input.locationState?.toLowerCase() || '')) {
      locationScore = 6;
      reasons.push(`Regional state partner (${rec.state})`);
    } else {
      locationScore = 3;
    }

    // 4. Quantity requirement (10%)
    let quantityScore = 5;
    if (weight >= rec.minimum_quantity_kg) {
      quantityScore = 10;
      reasons.push(`Accepts batches from ${rec.minimum_quantity_kg} kg (your batch: ${weight} kg)`);
    } else if (weight >= rec.minimum_quantity_kg * 0.6) {
      quantityScore = 7;
    } else {
      quantityScore = 3;
    }

    // 5. Hazardous-waste capability (10%)
    let hazardScore = 8;
    if (input.hasHazardousComponents) {
      if (rec.hazardous_waste_capability) {
        hazardScore = 10;
        reasons.push(`Government-authorized for hazardous e-waste containment`);
      } else {
        hazardScore = 0; // cannot safely handle
      }
    } else {
      hazardScore = 10;
    }

    // 6. Pickup availability (5%)
    let pickupScore = 0;
    if (rec.pickup_available) {
      pickupScore = 5;
      reasons.push(`Free door pickup available for scrap shops`);
    } else {
      pickupScore = 2;
    }

    // 7. Verification status (5%)
    let verificationScore = 3;
    if (rec.verification_status === 'Verified Facility') {
      verificationScore = 5;
      reasons.push(`Verified registered facility (audited)`);
    } else if (rec.verification_status === 'Certified E-Waste Partner') {
      verificationScore = 4;
      reasons.push(`Certified e-waste partner`);
    }

    const rawTotal = materialScore + typeScore + locationScore + quantityScore + hazardScore + pickupScore + verificationScore;
    const finalScore = Math.min(99, Math.max(30, Math.round(rawTotal)));

    return {
      ...rec,
      match_score: finalScore,
      distance_km: distanceKm,
      match_reasons: reasons.slice(0, 5),
    };
  });

  // Sort descending by match score
  scoredRecyclers.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  return scoredRecyclers.slice(0, limit);
}
