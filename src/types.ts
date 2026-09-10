export interface DetectedItem {
  name: string;
  confidence: number; // 0 to 100
  quantity: number;
  material: string;
  condition: string;
  reusable: boolean;
  hazardous: boolean;
  estimated_weight_kg: number;
  reason: string;
}

export interface MaterialBreakdown {
  name: string;
  estimated_weight_kg: number;
  indicative_price_per_kg: number;
  estimated_value: number; // calculated deterministically: weight * price_per_kg
}

export interface SafetyAssessment {
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  warnings: string[];
  recommended_handling: string[];
  has_hazardous_components: boolean;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  device_summary: string;
  detected_items: DetectedItem[];
  materials: MaterialBreakdown[];
  total_estimated_value: number;
  confidence_level: 'High' | 'Medium' | 'Low';
  safety: SafetyAssessment;
  overall_assessment: string;
  confidence_note: string;
  input_weight_kg?: number;
  input_location?: string;
  input_category?: string;
  is_demo?: boolean;
}

export interface Recycler {
  id: string;
  recycler_name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  accepted_materials: string[];
  accepted_e_waste_types: string[];
  minimum_quantity_kg: number;
  hazardous_waste_capability: boolean;
  phone: string;
  email: string;
  verification_status: 'Verified Facility' | 'Registered Recycler' | 'Certified E-Waste Partner' | 'Demo Partner';
  last_verified_date: string;
  indicative_price_range: string;
  pickup_available: boolean;
  address: string;
  rating: number;
  match_score?: number; // 0 - 100
  match_reasons?: string[];
  distance_km?: number;
}

export interface HandoverRequest {
  id: string;
  analysis_id?: string;
  worker_name: string;
  phone: string;
  recycler_id: string;
  recycler_name: string;
  e_waste_type: string;
  estimated_weight_kg: number;
  handover_type: 'pickup' | 'dropoff';
  preferred_date: string;
  notes: string;
  status: 'Requested' | 'Scheduled' | 'Completed' | 'Cancelled';
  created_at: string;
  estimated_value?: number;
}

export interface KnowledgeItem {
  id: string;
  category: string;
  name: string;
  description: string;
  recyclable_materials: string[];
  reusable_components: string[];
  basic_safety_notes: string;
  handling_category: 'Safe with standard precautions' | 'Requires specialized handling' | 'Hazardous - do not dismantle';
  typical_weight_range_kg: string;
  reference_value_range: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// Vision Provider Abstraction for future YOLO / OpenCV integration
export interface EWasteVisionProvider {
  name: string;
  analyzeImage: (imageData: {
    base64: string;
    mimeType: string;
    declaredCategory?: string;
    declaredWeight?: number;
    declaredLocation?: string;
  }) => Promise<{
    device_summary: string;
    detected_items: DetectedItem[];
    materials: { name: string; estimated_weight_kg: number; indicative_price_per_kg?: number }[];
    safety: { risk_level: 'LOW' | 'MEDIUM' | 'HIGH'; warnings: string[]; recommended_handling: string[] };
    overall_assessment: string;
    confidence_note: string;
  }>;
}
