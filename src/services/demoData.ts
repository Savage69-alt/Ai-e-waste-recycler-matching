import { AnalysisResult } from '../types';
import { calculateIndicativeValue } from '../utils/valueEngine';

export function createDemoAnalysis(): AnalysisResult {
  const declaredWeight = 1.6;
  const rawItems = [
    {
      name: 'High-Density Motherboard PCB',
      confidence: 94,
      quantity: 1,
      material: 'Fiberglass epoxy, copper traces, ICs',
      condition: 'Partially disassembled; gold contacts intact',
      reusable: true,
      hazardous: false,
      estimated_weight_kg: 0.45,
      reason: 'Standard laptop mainboard with visible chipset, RAM slots, and surface-mount components.',
    },
    {
      name: 'Extruded Aluminium Heatsink & Heatpipe',
      confidence: 91,
      quantity: 1,
      material: 'Aluminium alloy + Copper core',
      condition: 'Good structural condition',
      reusable: true,
      hazardous: false,
      estimated_weight_kg: 0.35,
      reason: 'Cooling radiator assembly for CPU/GPU with copper thermal sintered heatpipe.',
    },
    {
      name: 'Lithium-Ion Pouch / Cell Battery Pack',
      confidence: 88,
      quantity: 1,
      material: 'Lithium cobalt oxide, graphite, copper foil',
      condition: 'Aged; showing slight swelling at corner edge',
      reusable: false,
      hazardous: true,
      estimated_weight_kg: 0.3,
      reason: '3-cell rechargeable laptop battery assembly. Label indicates 11.4V Li-ion chemistry.',
    },
    {
      name: 'Insulated Copper Wiring Harness & Connectors',
      confidence: 89,
      quantity: 2,
      material: 'PVC insulated copper wiring',
      condition: 'Cut at connector ends; untangled',
      reusable: false,
      hazardous: false,
      estimated_weight_kg: 0.2,
      reason: 'DC-in jack wiring and display LVDS flex cable bundle.',
    },
    {
      name: 'Galvanized Steel Mounting Shield & Brackets',
      confidence: 85,
      quantity: 2,
      material: 'Stamped sheet steel',
      condition: 'Bent but intact',
      reusable: false,
      hazardous: false,
      estimated_weight_kg: 0.3,
      reason: 'Internal structural hinge plates and electromagnetic interference (EMI) shield.',
    },
  ];

  const rawMaterials = [
    { name: 'High-Grade PCB', estimated_weight_kg: 0.45, indicative_price_per_kg: 420 },
    { name: 'Copper', estimated_weight_kg: 0.18, indicative_price_per_kg: 720 },
    { name: 'Aluminium', estimated_weight_kg: 0.35, indicative_price_per_kg: 195 },
    { name: 'Lithium-Ion Battery', estimated_weight_kg: 0.3, indicative_price_per_kg: 130 },
    { name: 'Insulated Copper Cable', estimated_weight_kg: 0.2, indicative_price_per_kg: 260 },
    { name: 'Steel & Casing Iron', estimated_weight_kg: 0.3, indicative_price_per_kg: 38 },
  ];

  const valueResult = calculateIndicativeValue(rawMaterials, rawItems, declaredWeight);

  // SVG representation for high quality demo image
  const demoSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420" fill="none">
      <rect width="640" height="420" fill="#0f172a"/>
      <rect x="20" y="20" width="600" height="380" rx="12" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      
      <!-- Circuit Board / PCB -->
      <rect x="60" y="60" width="340" height="230" rx="8" fill="#065f46" stroke="#10b981" stroke-width="2"/>
      <line x1="80" y1="90" x2="220" y2="90" stroke="#34d399" stroke-width="2" stroke-dasharray="6 4"/>
      <line x1="120" y1="130" x2="280" y2="130" stroke="#34d399" stroke-width="2"/>
      <line x1="280" y1="130" x2="340" y2="190" stroke="#34d399" stroke-width="2"/>
      <rect x="150" y="100" width="70" height="70" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="185" y="140" fill="#94a3b8" font-size="11" font-family="sans-serif" text-anchor="middle">CPU CHIP</text>
      
      <!-- RAM Slots with Gold fingers -->
      <rect x="75" y="190" width="160" height="22" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
      <rect x="75" y="220" width="160" height="22" rx="2" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
      
      <!-- Heatsink / Aluminium -->
      <rect x="240" y="80" width="140" height="60" rx="4" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>
      <line x1="250" y1="80" x2="250" y2="140" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="270" y1="80" x2="270" y2="140" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="290" y1="80" x2="290" y2="140" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="310" y1="80" x2="310" y2="140" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="330" y1="80" x2="330" y2="140" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M 230 110 L 180 110" stroke="#ea580c" stroke-width="6" stroke-linecap="round"/>
      
      <!-- Battery Pack (Hazardous Highlight) -->
      <rect x="420" y="60" width="160" height="200" rx="8" fill="#7f1d1d" stroke="#ef4444" stroke-width="3"/>
      <rect x="435" y="80" width="130" height="150" rx="4" fill="#991b1b"/>
      <path d="M 500 110 L 485 145 L 505 145 L 495 185" stroke="#fef08a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="500" y="210" fill="#fee2e2" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">LI-ION BATTERY</text>
      <text x="500" y="225" fill="#fca5a5" font-size="10" font-family="sans-serif" text-anchor="middle">CAUTION: HAZARD</text>

      <!-- Cables & Wire Harness -->
      <path d="M 80 320 Q 200 370, 360 330 T 560 340" stroke="#b45309" stroke-width="5" fill="none"/>
      <path d="M 120 340 Q 260 380, 420 330 T 580 360" stroke="#0284c7" stroke-width="4" fill="none"/>
      <text x="320" y="385" fill="#94a3b8" font-size="12" font-family="sans-serif" text-anchor="middle">EcoValue AI • Verified Demo E-Waste Image Sample (Laptop Assembly)</text>
    </svg>
  `)}`;

  return {
    id: `demo-analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    imageUrl: demoSvg,
    device_summary: 'Dismantled notebook computer sub-assembly containing multi-layer motherboard, copper-core cooling heatsink, bundled wire harness, and a lithium-ion rechargeable battery pack.',
    detected_items: rawItems,
    materials: valueResult.materials,
    total_estimated_value: valueResult.total_estimated_value,
    confidence_level: valueResult.confidence_level,
    safety: {
      risk_level: 'HIGH',
      has_hazardous_components: true,
      warnings: [
        'Possible lithium-ion battery detected in pouch/cell casing.',
        'Visible corner stress/swelling observed — elevated thermal runaway risk if crushed.',
        'Do not puncture, pierce, crush, heat, or dismantle the battery unit.',
        'High-voltage capacitors may retain residual electrical charge.',
      ],
      recommended_handling: [
        'Disconnect or isolate battery using plastic insulated tools before handling metals.',
        'Store battery separately in a dry, fire-resistant sand bucket away from flammable scrap.',
        'Wear heavy-duty leather or cut-resistant gloves and safety goggles during sorting.',
        'Never burn wires or plastic casings in open fire — sell intact to authorized mechanical recyclers.',
        'Hand over hazardous battery unit exclusively to an authorized hazardous waste recycler.',
      ],
    },
    overall_assessment: 'Valuable batch with substantial copper, high-grade circuit board recovery, and clean aluminium heat sinks. Because a lithium-ion battery is present, segregation is mandatory prior to recycler sale.',
    confidence_note: valueResult.confidence_note,
    input_weight_kg: declaredWeight,
    input_location: 'Mumbai, Maharashtra',
    input_category: 'Laptop',
    is_demo: true,
  };
}
