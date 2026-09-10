// Reference indicative market prices per kg (in INR - ₹)
// Clearly documented as reference indicative rates for hackathon MVP estimation
export interface PriceReference {
  name: string;
  aliases: string[];
  pricePerKg: number;
  category: 'Metals' | 'Circuits' | 'Batteries' | 'Plastics' | 'Assemblies';
  notes: string;
}

export const MATERIAL_PRICING_TABLE: PriceReference[] = [
  {
    name: 'Copper',
    aliases: ['copper', 'cu', 'copper wire', 'copper coils', 'copper winding'],
    pricePerKg: 720,
    category: 'Metals',
    notes: 'High-purity transformer windings, motor armatures, and stripped wire.',
  },
  {
    name: 'Aluminium',
    aliases: ['aluminium', 'aluminum', 'al', 'aluminium heatsink', 'heatsink'],
    pricePerKg: 195,
    category: 'Metals',
    notes: 'Cast and extruded heatsinks, laptop chasses, and shielding cans.',
  },
  {
    name: 'High-Grade PCB',
    aliases: ['pcb', 'printed circuit board', 'motherboard', 'smartphone board', 'circuit board', 'telecom board', 'ram'],
    pricePerKg: 420,
    category: 'Circuits',
    notes: 'Gold-plated connectors, high density ICs, multi-layer server/laptop boards.',
  },
  {
    name: 'Standard PCB',
    aliases: ['power supply pcb', 'low-grade pcb', 'tv pcb', 'monitor pcb', 'single-layer pcb'],
    pricePerKg: 180,
    category: 'Circuits',
    notes: 'Brown phenolic and single-sided circuit boards with standard capacitors.',
  },
  {
    name: 'Lithium-Ion Battery',
    aliases: ['lithium battery', 'li-ion', 'battery', 'lipo', 'lithium-ion cell', '18650 cell', 'laptop battery'],
    pricePerKg: 130,
    category: 'Batteries',
    notes: 'Specialized recycling for cobalt, nickel, and lithium recovery. Requires hazardous handling permit.',
  },
  {
    name: 'Insulated Copper Cable',
    aliases: ['cable', 'cables', 'wire', 'wiring harness', 'power cord', 'usb cable'],
    pricePerKg: 260,
    category: 'Metals',
    notes: 'Average wire recovery yielding 45-55% copper by weight.',
  },
  {
    name: 'Steel & Casing Iron',
    aliases: ['steel', 'iron', 'metal chassis', 'pc casing', 'stamped steel'],
    pricePerKg: 38,
    category: 'Metals',
    notes: 'Galvanized desktop frame and magnetic shielding plates.',
  },
  {
    name: 'Hard Disk Drive Assembly',
    aliases: ['hard disk', 'hdd', 'hard drive', 'magnetic platter'],
    pricePerKg: 280,
    category: 'Assemblies',
    notes: 'Contains cast aluminium housing, neodymium magnets, and logic board.',
  },
  {
    name: 'Engineering Plastics (ABS/PC)',
    aliases: ['plastic', 'abs', 'polycarbonate', 'casing plastic', 'pvc'],
    pricePerKg: 32,
    category: 'Plastics',
    notes: 'Clean, sorted flame-retardant computer housings.',
  },
  {
    name: 'Brass & Connectors',
    aliases: ['brass', 'bronze', 'connector pins', 'plugs'],
    pricePerKg: 410,
    category: 'Metals',
    notes: 'Screw fittings, high-durability electrical contacts, and terminal lugs.',
  },
];

export function getIndicativePrice(materialName: string): number {
  const normalized = materialName.toLowerCase().trim();
  for (const item of MATERIAL_PRICING_TABLE) {
    if (
      item.name.toLowerCase() === normalized ||
      item.aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized))
    ) {
      return item.pricePerKg;
    }
  }
  // Default general electronic scrap rate if no direct match
  return 120;
}
