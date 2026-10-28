// Comprehensive Bukidnon Municipalities, Official Barangays, and Puroks
// Covering Cabanglasan, San Fernando, and Valencia City for Llano Selecta Dealer Operations

export const BUKIDNON_AREAS = [
  'Valencia',
  'Cabanglasan',
  'San Fernando'
];

export const OFFICIAL_BARANGAYS = {
  Cabanglasan: [
    'Poblacion (Cabanglasan Centro)',
    'Anlogan',
    'Cabulohan',
    'Canangaan',
    'Capihan',
    'Dalacutan',
    'Freedom',
    'Iba',
    'Imbatug',
    'Jampason',
    'Lambagan',
    'Mandaing',
    'Mandahikan',
    'Mauswagon',
    'Paradise'
  ],
  'San Fernando': [
    'Halapitan (Poblacion)',
    'Bonacao',
    'Burgos',
    'Cabuling',
    'Candelaria',
    'Cayaga',
    'Dao',
    'Durian',
    'Iglugsad',
    'Kalagangan',
    'Little Baguio',
    'Mabuhay',
    'Magasao',
    'Matupe',
    'Namnam',
    'Palacapao',
    'Sacramento Valley',
    'San Jose',
    'Tugop'
  ],
  Valencia: [
    'Poblacion',
    'Bagontaas',
    'Banlag',
    'Barobo',
    'Batangan',
    'Catumbalon',
    'Colonia',
    'Concepcion',
    'Dagat-Kidavao',
    'Guinoyoran',
    'Kahaponan',
    'Laligan',
    'Lillingayon',
    'Lourdes',
    'Lumbayao',
    'Lumbo',
    'Lurugan',
    'Maapag',
    'Mabuhay',
    'Mailag',
    'Mount Nebo',
    'Nabag-o',
    'Pinatilan',
    'San Carlos',
    'San Isidro',
    'Sinabuagan',
    'Sinayawan',
    'Sugod',
    'Tongantongan',
    'Tugaya',
    'Vintar (Ventar)'
  ]
};

export const COMMON_PUROKS = [
  'Purok 1',
  'Purok 2',
  'Purok 3',
  'Purok 4',
  'Purok 5',
  'Purok 6',
  'Purok 7',
  'Purok 8',
  'Purok Centro',
  'Purok Public Market',
  'Purok Crossing / Highway',
  'Purok Riverside',
  'Purok Upper',
  'Purok Lower',
  'Sitio Greenhills',
  'Barangay Hall Plaza'
];

// Helper to normalize and match territory area names
export function normalizeAreaName(area) {
  if (!area) return 'Valencia';
  const norm = area.toLowerCase();
  if (norm.includes('caban') || norm.includes('cabal')) return 'Cabanglasan';
  if (norm.includes('fernando') || norm.includes('sanfernando') || norm.includes('halapitan')) return 'San Fernando';
  return 'Valencia';
}

// Get barangays for an area safely
export function getBarangaysForArea(area) {
  const normKey = normalizeAreaName(area);
  return OFFICIAL_BARANGAYS[normKey] || OFFICIAL_BARANGAYS['Valencia'];
}
