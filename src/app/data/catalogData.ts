export type Category =
  | "All"
  | "Perfume Bottles"
  | "Spray Bottles"
  | "Skincare Jars"
  | "Roll-On Bottles"
  | "Cosmetic Packaging";

export interface Product {
  id: number;
  name: string;
  category: Category;
  sku: string;
  material: string;
  capacity: string[];
  finish: string;
  moq: string;
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
  isPopular?: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  tags: string[];
  dateAdded: string;
}

export const CATALOG_PRODUCTS: Product[] = [
  // ─── Perfume Bottles ───────────────────────────────────────────────────────
  {
    id: 1,
    name: "Botol Kaca Kotak Mewah",
    category: "Perfume Bottles",
    sku: "PB-SQ-001",
    material: "Borosilicate Glass",
    capacity: ["30ml", "50ml", "100ml"],
    finish: "Bening / Buram",
    moq: "500 pcs",
    badge: "Terlaris",
    badgeColor: "#27C7C3",
    isPopular: true,
    rating: 4.9,
    reviewCount: 128,
    image:
      "https://images.unsplash.com/photo-1621275155732-2bff82c64fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMHBlcmZ1bWUlMjBib3R0bGUlMjBzcXVhcmUlMjBlbGVnYW50fGVufDF8fHx8MTc3ODQyNjkxM3ww&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Botol kaca borosilikat potongan kotak premium dengan tepi miring. Sempurna untuk merek parfum mewah yang menginginkan siluet tegas dan arsitektural.",
    tags: ["glass", "square", "clear", "luxury"],
    dateAdded: "2025-01-15",
  },
  {
    id: 2,
    name: "Botol Kristal Bulat Elegan",
    category: "Perfume Bottles",
    sku: "PB-RD-002",
    material: "Crystal Glass",
    capacity: ["50ml", "75ml", "100ml"],
    finish: "Kristal Bening",
    moq: "500 pcs",
    badge: "Baru",
    badgeColor: "#10B981",
    isNew: true,
    rating: 4.8,
    reviewCount: 42,
    image:
      "https://images.unsplash.com/photo-1773527142304-58116364b8a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZ2xhc3MlMjBlbGVnYW50fGVufDF8fHx8MTc3ODQyNTM4MHww&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Botol kaca kristal bulat yang anggun dengan lekukan halus. Leher bergelombang menambah keanggunan sentuhan dan genggaman yang nyaman.",
    tags: ["crystal", "round", "elegant"],
    dateAdded: "2025-03-20",
  },
  {
    id: 3,
    name: "Botol Prestige Gelap",
    category: "Perfume Bottles",
    sku: "PB-DK-003",
    material: "Tinted Glass",
    capacity: ["30ml", "50ml"],
    finish: "Berasap / Hitam Matte",
    moq: "300 pcs",
    isPopular: true,
    rating: 4.7,
    reviewCount: 89,
    image:
      "https://images.unsplash.com/photo-1774682060922-c395859148c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmcmFncmFuY2UlMjBib3R0bGUlMjBkYXJrJTIwYmFja2dyb3VuZCUyMHN0dWRpb3xlbnwxfHx8fDE3Nzg0MjY5MTR8MA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Botol kaca berasap gelap yang memancarkan misteri dan kemewahan. Lapisan pelindung UV menjaga integritas aroma.",
    tags: ["dark", "smoked", "UV-protection", "premium"],
    dateAdded: "2025-02-10",
  },
  {
    id: 4,
    name: "Flakon Bening Minimalis",
    category: "Perfume Bottles",
    sku: "PB-CL-004",
    material: "Borosilicate Glass",
    capacity: ["30ml", "50ml", "75ml"],
    finish: "Ultra-Bening",
    moq: "500 pcs",
    badge: "Elegan",
    badgeColor: "#6366F1",
    rating: 4.6,
    reviewCount: 61,
    image:
      "https://images.unsplash.com/photo-1758560936904-4eb0049284aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwZ2xhc3MlMjBib3R0bGUlMjBjbGVhciUyMG1pbmltYWxpc3QlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc4NDI1Mzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Flakon kaca borosilikat ultra-minimalis dengan siluet bersih dan sederhana. Ideal untuk merek wewangian niche kontemporer.",
    tags: ["minimalist", "clear", "modern"],
    dateAdded: "2025-01-28",
  },
  {
    id: 5,
    name: "Botol Berlian Multi-Sisi",
    category: "Perfume Bottles",
    sku: "PB-DM-005",
    material: "Crystal Glass",
    capacity: ["50ml", "100ml"],
    finish: "Kristal Bersisi",
    moq: "500 pcs",
    isPopular: true,
    rating: 5.0,
    reviewCount: 34,
    image:
      "https://images.unsplash.com/photo-1598100574448-f4741c12dc81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlJTIwY29sbGVjdGlvbiUyMGx1eHVyeSUyMGdvbGQlMjB3aGl0ZXxlbnwxfHx8fDE3Nzg0MjY5MTh8MA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Botol kristal potongan berlian bersisi banyak yang membiaskan cahaya dengan indah. Solusi kemasan istimewa untuk koleksi wewangian kelas atas.",
    tags: ["diamond", "faceted", "crystal", "luxury"],
    dateAdded: "2025-04-01",
  },
  {
    id: 6,
    name: "Botol Buram Tembus Cahaya",
    category: "Perfume Bottles",
    sku: "PB-FR-006",
    material: "Frosted Glass",
    capacity: ["30ml", "50ml"],
    finish: "Buram Matte",
    moq: "300 pcs",
    badge: "Baru",
    badgeColor: "#10B981",
    isNew: true,
    rating: 4.5,
    reviewCount: 18,
    image:
      "https://images.unsplash.com/photo-1720423514789-15a33e59fc81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmFncmFuY2UlMjBib3R0bGUlMjB0cmFuc3BhcmVudCUyMGNyeXN0YWwlMjBjbGVhciUyMG1pbmltYWx8ZW58MXx8fHwxNzc4NDI2OTE5fDA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Botol kaca buram matte halus dengan permukaan lembut yang nyaman disentuh. Cocok dipadukan dengan tutup metalik atau kayu.",
    tags: ["frosted", "matte", "soft-touch"],
    dateAdded: "2025-04-15",
  },

  // ─── Spray Bottles ────────────────────────────────────────────────────────
  {
    id: 7,
    name: "Atomizer Kabut Halus Emas",
    category: "Spray Bottles",
    sku: "SP-GM-001",
    material: "Glass + Aluminum",
    capacity: ["50ml", "100ml", "200ml"],
    finish: "Berlapis Emas",
    moq: "300 pcs",
    badge: "Terlaris",
    badgeColor: "#27C7C3",
    isPopular: true,
    rating: 4.9,
    reviewCount: 97,
    image:
      "https://images.unsplash.com/photo-1770301410072-f6ef6dad65b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJheSUyMHBlcmZ1bWUlMjBib3R0bGUlMjBnb2xkJTIwbHV4dXJ5fGVufDF8fHx8MTc3ODQyNTM4MHww&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Atomizer kabut halus premium dengan casing aluminium berlapis emas. Menghasilkan pola semprot yang konsisten dan sangat halus di setiap pompa.",
    tags: ["gold", "atomizer", "fine-mist"],
    dateAdded: "2025-01-10",
  },
  {
    id: 8,
    name: "Botol Pompa Presisi Silver",
    category: "Spray Bottles",
    sku: "SP-SV-002",
    material: "Glass + Stainless Steel",
    capacity: ["50ml", "100ml"],
    finish: "Krom Silver",
    moq: "500 pcs",
    rating: 4.7,
    reviewCount: 53,
    image:
      "https://images.unsplash.com/photo-1640780227086-27330ac28301?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYXRvbWl6ZXIlMjBzcHJheSUyMHB1bXAlMjBnb2xkJTIwc2lsdmVyfGVufDF8fHx8MTc3ODQyNjkxNXww&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Mekanisme pompa presisi tinggi dengan komponen stainless steel. Dirancang untuk ketahanan jangka panjang dan pengeluaran aroma yang konsisten.",
    tags: ["silver", "chrome", "precision"],
    dateAdded: "2025-02-05",
  },
  {
    id: 9,
    name: "Set Vial Semprot Ukuran Travel",
    category: "Spray Bottles",
    sku: "SP-TR-003",
    material: "Aluminum",
    capacity: ["5ml", "10ml", "15ml"],
    finish: "Aluminium Matte",
    moq: "1000 pcs",
    badge: "Baru",
    badgeColor: "#10B981",
    isNew: true,
    rating: 4.6,
    reviewCount: 29,
    image:
      "https://images.unsplash.com/photo-1725182525091-ae6076964336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwYm90dGxlJTIwaGVybyUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeSUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3ODQyNTM4MHww&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Vial semprot kompak ukuran travel berbahan aluminium matte. Sempurna untuk set sampel, ritel perjalanan, dan kemasan hadiah.",
    tags: ["travel", "compact", "aluminum", "vial"],
    dateAdded: "2025-03-28",
  },

  // ─── Skincare Jars ────────────────────────────────────────────────────────
  {
    id: 10,
    name: "Toples Krim Akrilik Buram",
    category: "Skincare Jars",
    sku: "SK-AC-001",
    material: "Acrylic",
    capacity: ["15g", "30g", "50g", "100g"],
    finish: "Akrilik Buram",
    moq: "300 pcs",
    badge: "Populer",
    badgeColor: "#8B5CF6",
    isPopular: true,
    rating: 4.8,
    reviewCount: 112,
    image:
      "https://images.unsplash.com/photo-1763503839418-2b45c3d7a3c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpYyUyMHBhY2thZ2luZyUyMHNraW5jYXJlJTIwamFyJTIwd2hpdGV8ZW58MXx8fHwxNzc4NDI1MzgwfDA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Toples akrilik buram premium dengan konstruksi dinding ganda untuk insulasi superior. Bukaan lebar untuk kemudahan akses produk.",
    tags: ["acrylic", "cream", "wide-mouth"],
    dateAdded: "2025-01-20",
  },
  {
    id: 11,
    name: "Toples Efek Marmer Mewah",
    category: "Skincare Jars",
    sku: "SK-MB-002",
    material: "Glass + Aluminum Lid",
    capacity: ["30g", "50g"],
    finish: "Motif Marmer",
    moq: "500 pcs",
    isNew: true,
    rating: 4.9,
    reviewCount: 38,
    image:
      "https://images.unsplash.com/photo-1684430127653-c5436b095a34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGNyZWFtJTIwamFyJTIwbHV4dXJ5JTIwd2hpdGUlMjBtYXJibGV8ZW58MXx8fHwxNzc4NDI2OTE1fDA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Toples kaca bermotif marmer memukau dengan tutup ulir aluminium. Menciptakan tampilan premium di rak untuk lini perawatan kulit mewah.",
    tags: ["marble", "glass", "luxury", "premium"],
    dateAdded: "2025-04-05",
  },
  {
    id: 12,
    name: "Botol Dropper Kaca Serum",
    category: "Skincare Jars",
    sku: "SK-DR-003",
    material: "Kaca Amber",
    capacity: ["15ml", "30ml", "50ml"],
    finish: "Kaca Amber / Bening",
    moq: "500 pcs",
    badge: "Terlaris",
    badgeColor: "#27C7C3",
    isPopular: true,
    rating: 4.8,
    reviewCount: 146,
    image:
      "https://images.unsplash.com/photo-1702475139168-88e2393845f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpYyUyMHNlcnVtJTIwZHJvcHBlciUyMGJvdHRsZSUyMGdsYXNzfGVufDF8fHx8MTc3ODQyNjkxNHww&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Botol dropper kaca amber pelindung UV untuk serum dan minyak wajah. Pipet dropper presisi untuk pengeluaran yang terkontrol.",
    tags: ["dropper", "serum", "amber", "UV"],
    dateAdded: "2025-01-05",
  },
  {
    id: 13,
    name: "Toples Pompa Airless",
    category: "Skincare Jars",
    sku: "SK-AP-004",
    material: "PP Plastic + Aluminum",
    capacity: ["30ml", "50ml"],
    finish: "Putih Matte",
    moq: "300 pcs",
    rating: 4.6,
    reviewCount: 72,
    image:
      "https://images.unsplash.com/photo-1771329064159-33f758d91f4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwYWNrYWdpbmclMjBwcm9kdWN0JTIwZmxhdCUyMGxheSUyMG1pbmltYWx8ZW58MXx8fHwxNzc4NDI2OTE1fDA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Teknologi pompa airless melindungi formula sensitif dengan mencegah oksidasi. Sempurna untuk serum dan krim anti-penuaan.",
    tags: ["airless", "pump", "preservation"],
    dateAdded: "2025-02-18",
  },

  // ─── Roll-On Bottles ──────────────────────────────────────────────────────
  {
    id: 14,
    name: "Botol Kaca Roll-On Klasik",
    category: "Roll-On Bottles",
    sku: "RO-CL-001",
    material: "Glass + SS Ball",
    capacity: ["5ml", "10ml"],
    finish: "Kaca Bening",
    moq: "1000 pcs",
    badge: "Terlaris",
    badgeColor: "#27C7C3",
    isPopular: true,
    rating: 4.9,
    reviewCount: 203,
    image:
      "https://images.unsplash.com/photo-1647507653704-bde7f2d6dbf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsLW9uJTIwcGVyZnVtZSUyMGJvdHRsZSUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc4NDI1MzgwfDA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Roll-on kaca ramping klasik dengan aplikator bola presisi stainless steel. Segel halus anti-bocor untuk aplikasi yang mudah.",
    tags: ["roll-on", "glass", "stainless-steel"],
    dateAdded: "2025-01-01",
  },
  {
    id: 15,
    name: "Minyak Parfum Roll-On Amber",
    category: "Roll-On Bottles",
    sku: "RO-AM-002",
    material: "Amber Glass + SS Ball",
    capacity: ["5ml", "10ml", "20ml"],
    finish: "Kaca Amber",
    moq: "500 pcs",
    badge: "Populer",
    badgeColor: "#F59E0B",
    rating: 4.7,
    reviewCount: 88,
    image:
      "https://images.unsplash.com/photo-1612798187806-a3f89fb22988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsJTIwb24lMjBvaWwlMjBib3R0bGUlMjBhbWJlciUyMGdsYXNzJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3Nzg0MjY5MTl8MA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Roll-on kaca amber ideal untuk minyak esensial dan minyak parfum pekat. Perlindungan UV melindungi formula sensitif cahaya.",
    tags: ["amber", "oil", "UV-protection"],
    dateAdded: "2025-02-28",
  },

  // ─── Cosmetic Packaging ───────────────────────────────────────────────────
  {
    id: 16,
    name: "Set Kemasan Kosmetik Mewah",
    category: "Cosmetic Packaging",
    sku: "CP-LS-001",
    material: "Mixed (Glass + Acrylic)",
    capacity: ["Custom"],
    finish: "Kustom / OEM",
    moq: "200 sets",
    badge: "Kustom",
    badgeColor: "#EF4444",
    rating: 4.9,
    reviewCount: 57,
    image:
      "https://images.unsplash.com/photo-1739980296455-3f8d6051ca20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpYyUyMHBhY2thZ2luZyUyMGx1eHVyeSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc3ODQyNTM4MHww&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Set kemasan bespoke lengkap untuk merek kosmetik. Termasuk botol, toples, pompa, dan kemasan luar yang serasi dengan branding kustom.",
    tags: ["OEM", "custom", "full-set", "branding"],
    dateAdded: "2025-03-01",
  },
  {
    id: 17,
    name: "Set Tube Kosmetik",
    category: "Cosmetic Packaging",
    sku: "CP-TB-002",
    material: "Aluminum + PE Plastic",
    capacity: ["30ml", "50ml", "100ml"],
    finish: "Putih Matte / Glossy",
    moq: "500 pcs",
    isNew: true,
    rating: 4.5,
    reviewCount: 31,
    image:
      "https://images.unsplash.com/photo-1741017778557-31eaf775ce0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpYyUyMHR1YmUlMjBwYWNrYWdpbmclMjBjcmVhbSUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3Nzg0MjY5MTl8MA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Tube kosmetik fleksibel untuk losion, krim, dan gel. Tersedia dalam pilihan aluminium dan PE dengan pencetakan kustom.",
    tags: ["tube", "flexible", "printing"],
    dateAdded: "2025-04-10",
  },
  {
    id: 18,
    name: "Koleksi Kemasan Kecantikan",
    category: "Cosmetic Packaging",
    sku: "CP-BC-003",
    material: "Mixed Materials",
    capacity: ["Assorted"],
    finish: "Matte Premium",
    moq: "100 sets",
    isPopular: true,
    rating: 4.8,
    reviewCount: 74,
    image:
      "https://images.unsplash.com/photo-1771329064159-33f758d91f4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwYWNrYWdpbmclMjBwcm9kdWN0JTIwZmxhdCUyMGxheSUyMG1pbmltYWx8ZW58MXx8fHwxNzc4NDI2OTE1fDA&ixlib=rb-4.1.0&q=80&w=400",
    description:
      "Koleksi kemasan kosmetik terkurasi yang menampilkan botol, toples, dan tube dalam estetika yang selaras. Ideal untuk peluncuran merek.",
    tags: ["collection", "curated", "launch"],
    dateAdded: "2025-03-15",
  },
];
