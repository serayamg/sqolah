import { DiagnosticQuestion } from '../types/intelligence';

export const DIAGNOSTIC_QUESTION_BANK: DiagnosticQuestion[] = [
  // Bab 1 - Struktur Atom & Notasi
  {
    id: 'diag-q1-atom-partikel',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-1',
    topicId: 'top-1-1',
    conceptId: 'conc-partikel-atom',
    conceptName: 'Proton, Neutron & Elektron',
    difficulty: 'easy',
    questionText: 'Manakah pernyataan yang BENAR mengenai partikel penyusun inti atom?',
    options: [
      { id: 'A', text: 'Inti atom terdiri atas proton bermuatan positif dan neutron yang tidak bermuatan.' },
      { id: 'B', text: 'Inti atom terdiri atas proton dan elektron yang mengorbit di sekitarnya.' },
      { id: 'C', text: 'Neutron bermuatan negatif dan berada di kulit atom.' },
      { id: 'D', text: 'Massa elektron jauh lebih besar daripada massa proton dalam inti.' }
    ],
    correctOptionId: 'A',
    explanation: 'Inti atom (nukleus) tersusun atas proton yang bermuatan positif (+1) dan neutron yang bersifat netral/tidak bermuatan (0). Elektron berada pada kulit di luar inti atom.',
    audioPrompt: 'Pertanyaan satu: Manakah pernyataan yang benar mengenai partikel penyusun inti atom?'
  },
  {
    id: 'diag-q2-atom-isotop',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-1',
    topicId: 'top-1-1',
    conceptId: 'conc-isotop-notasi',
    conceptName: 'Nomor Atom, Nomor Massa & Isotop',
    difficulty: 'medium',
    questionText: 'Suatu ion X²⁺ memiliki nomor atom 12 dan nomor massa 24. Berapakah jumlah proton, neutron, dan elektron dalam ion tersebut?',
    options: [
      { id: 'A', text: '12 proton, 12 neutron, dan 10 elektron' },
      { id: 'B', text: '12 proton, 12 neutron, dan 14 elektron' },
      { id: 'C', text: '10 proton, 12 neutron, dan 12 elektron' },
      { id: 'D', text: '12 proton, 24 neutron, dan 10 elektron' }
    ],
    correctOptionId: 'A',
    explanation: 'Nomor atom = proton = 12. Neutron = nomor massa - nomor atom = 24 - 12 = 12. Karena bermuatan 2+ (melepaskan 2 elektron), maka elektron = 12 - 2 = 10 elektron.',
    audioPrompt: 'Pertanyaan dua: Suatu ion X dua positif memiliki nomor atom 12 dan nomor massa 24. Berapakah jumlah proton, neutron, dan elektron dalam ion tersebut?'
  },
  {
    id: 'diag-q3-atom-konfig',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-1',
    topicId: 'top-1-2',
    conceptId: 'conc-konfig-elektron',
    conceptName: 'Prinsip Aufbau & Konfigurasi spdf',
    difficulty: 'medium',
    questionText: 'Konfigurasi elektron atom unsur Besi (₂₆Fe) dalam keadaan dasar adalah...',
    options: [
      { id: 'A', text: '[Ar] 4s² 3d⁶' },
      { id: 'B', text: '[Ar] 4s¹ 3d⁷' },
      { id: 'C', text: '[Ar] 3d⁸' },
      { id: 'D', text: '[Ne] 3s² 3p⁶ 4s² 3d⁶' }
    ],
    correctOptionId: 'A',
    explanation: '₂₆Fe memiliki 26 elektron: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶. Bagian 1s² 2s² 2p⁶ 3s² 3p⁶ disingkat sebagai gas mulia Argon [Ar], sehingga konfigurasinya adalah [Ar] 4s² 3d⁶.',
    audioPrompt: 'Pertanyaan tiga: Konfigurasi elektron atom unsur Besi nomor atom 26 dalam keadaan dasar adalah?'
  },
  {
    id: 'diag-q4-atom-kuantum',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-1',
    topicId: 'top-1-2',
    conceptId: 'conc-bil-kuantum',
    conceptName: 'Bilangan Kuantum n, l, m, s',
    difficulty: 'hard',
    questionText: 'Empat bilangan kuantum untuk elektron terakhir dari atom unsur ₁₇Cl (klorin) adalah...',
    options: [
      { id: 'A', text: 'n = 3, l = 1, m = 0, s = -1/2' },
      { id: 'B', text: 'n = 3, l = 1, m = +1, s = +1/2' },
      { id: 'C', text: 'n = 3, l = 0, m = 0, s = -1/2' },
      { id: 'D', text: 'n = 2, l = 1, m = 0, s = -1/2' }
    ],
    correctOptionId: 'A',
    explanation: 'Konfigurasi ₁₇Cl: [Ne] 3s² 3p⁵. Elektron terakhir di 3p⁵: n = 3, l = 1 (subkulit p). Tiga orbital p (m = -1, 0, +1): elektron ke-1 (-1, +1/2), ke-2 (0, +1/2), ke-3 (+1, +1/2), ke-4 (-1, -1/2), ke-5 (0, -1/2). Jadi n=3, l=1, m=0, s=-1/2.',
    audioPrompt: 'Pertanyaan empat: Empat bilangan kuantum untuk elektron terakhir dari atom unsur klorin nomor atom 17 adalah?'
  },

  // Bab 2 - Ikatan Kimia
  {
    id: 'diag-q5-ikatan-ion',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-2',
    topicId: 'top-2-1',
    conceptId: 'conc-ikatan-ion',
    conceptName: 'Karakteristik & Pembentukan Senyawa Ion',
    difficulty: 'easy',
    questionText: 'Pasangan unsur berikut yang paling mudah membentuk ikatan ion melalui serah terima elektron adalah...',
    options: [
      { id: 'A', text: '₁₁Na dan ₁₇Cl' },
      { id: 'B', text: '₆C dan ₈O' },
      { id: 'C', text: '₁H dan ₈O' },
      { id: 'D', text: '₇N dan ₁H' }
    ],
    correctOptionId: 'A',
    explanation: 'Ikatan ion terbentuk antara unsur logam dengan keelektronegatifan rendah (Na golongan IA) dan non-logam dengan keelektronegatifan tinggi (Cl golongan VIIA) melalui transfer elektron.',
    audioPrompt: 'Pertanyaan lima: Pasangan unsur berikut yang paling mudah membentuk ikatan ion melalui serah terima elektron adalah?'
  },
  {
    id: 'diag-q6-ikatan-kovalen',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-2',
    topicId: 'top-2-1',
    conceptId: 'conc-ikatan-kovalen',
    conceptName: 'Ikatan Kovalen Tunggal, Rangkap & Koordinasi',
    difficulty: 'medium',
    questionText: 'Molekul di bawah ini yang memiliki ikatan kovalen koordinasi adalah...',
    options: [
      { id: 'A', text: 'NH₄⁺ (Ion amonium)' },
      { id: 'B', text: 'CH₄ (Metana)' },
      { id: 'C', text: 'H₂O (Air)' },
      { id: 'D', text: 'NaCl (Natrium klorida)' }
    ],
    correctOptionId: 'A',
    explanation: 'Pada ion NH₄⁺, pasangan elektron bebas dari atom N pada molekul NH₃ didonorkan secara sepihak kepada ion H⁺ membentuk ikatan kovalen koordinasi.',
    audioPrompt: 'Pertanyaan enam: Molekul di bawah ini yang memiliki ikatan kovalen koordinasi adalah?'
  },
  {
    id: 'diag-q7-vsepr-geometri',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-2',
    topicId: 'top-2-2',
    conceptId: 'conc-vsepr-geometri',
    conceptName: 'VSEPR & Domain Elektron Bentuk Molekul',
    difficulty: 'hard',
    questionText: 'Molekul XeF₄ memiliki bentuk molekul dan tipe hibridisasi...',
    options: [
      { id: 'A', text: 'Segiempat datar (Square planar), sp³d²' },
      { id: 'B', text: 'Tetrahedral, sp³' },
      { id: 'C', text: 'Bipiramida trigonal, sp³d' },
      { id: 'D', text: 'Oktahedral sempurna, sp³d²' }
    ],
    correctOptionId: 'A',
    explanation: 'Xe memiliki 8 elektron valensi, 4 berikatan dengan F dan 2 pasang elektron bebas (PEI = 4, PEB = 2 -> tipe AX₄E₂). Geometri molekulnya adalah segiempat datar dengan hibridisasi sp³d².',
    audioPrompt: 'Pertanyaan tujuh: Molekul XeF empat memiliki bentuk molekul dan tipe hibridisasi apa?'
  },

  // Bab 4 - Tata Nama & Persamaan Reaksi
  {
    id: 'diag-q8-reaksi-setara',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-4',
    topicId: 'top-4-2',
    conceptId: 'conc-setara-reaksi',
    conceptName: 'Penyetaraan Persamaan Reaksi Kimia',
    difficulty: 'medium',
    questionText: 'Koefisien a, b, c, dan d untuk menyetarakan reaksi: a C₃H₈ + b O₂ → c CO₂ + d H₂O berturut-turut adalah...',
    options: [
      { id: 'A', text: '1, 5, 3, 4' },
      { id: 'B', text: '1, 3, 3, 4' },
      { id: 'C', text: '2, 5, 6, 8' },
      { id: 'D', text: '1, 10, 3, 4' }
    ],
    correctOptionId: 'A',
    explanation: 'C: di kiri 3, maka c = 3. H: di kiri 8, maka d = 8/2 = 4. O: di kanan ada 3×2 + 4×1 = 10, maka b = 10/2 = 5. Jadi perbandingan koefisien adalah 1, 5, 3, 4.',
    audioPrompt: 'Pertanyaan delapan: Koefisien a, b, c, dan d untuk menyetarakan reaksi pembakaran propana C tiga H delapan adalah?'
  },

  // Bab 5 - Stoikiometri
  {
    id: 'diag-q9-stoikiometri-mol',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-5',
    topicId: 'top-5-1',
    conceptId: 'conc-konsep-mol',
    conceptName: 'Mol, Massa Molar & Volume Molar STP',
    difficulty: 'medium',
    questionText: 'Berapa liter volume dari 4,4 gram gas CO₂ pada kondisi standar (STP, 0°C, 1 atm)? (Diketahui Ar C = 12, O = 16)',
    options: [
      { id: 'A', text: '2,24 Liter' },
      { id: 'B', text: '22,4 Liter' },
      { id: 'C', text: '4,48 Liter' },
      { id: 'D', text: '1,12 Liter' }
    ],
    correctOptionId: 'A',
    explanation: 'Mr CO₂ = 12 + 2(16) = 44 g/mol. Jumlah mol = 4,4 g / 44 g/mol = 0,1 mol. Volume STP = mol × 22,4 L = 0,1 × 22,4 L = 2,24 Liter.',
    audioPrompt: 'Pertanyaan sembilan: Berapa liter volume dari empat koma empat gram gas CO dua pada kondisi standar STP? Ar C dua belas dan O enam belas.'
  },
  {
    id: 'diag-q10-pereaksi-pembatas',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-5',
    topicId: 'top-5-2',
    conceptId: 'conc-pereaksi-pembatas',
    conceptName: 'Pereaksi Pembatas & Rendemen Reaksi',
    difficulty: 'hard',
    questionText: 'Sebanyak 2 mol N₂ direaksikan dengan 3 mol H₂ sesuai reaksi: N₂ + 3 H₂ → 2 NH₃. Zat yang bertindak sebagai pereaksi pembatas dan jumlah mol NH₃ yang terbentuk adalah...',
    options: [
      { id: 'A', text: 'H₂ sebagai pereaksi pembatas, terbentuk 2 mol NH₃' },
      { id: 'B', text: 'N₂ sebagai pereaksi pembatas, terbentuk 4 mol NH₃' },
      { id: 'C', text: 'H₂ sebagai pereaksi pembatas, terbentuk 3 mol NH₃' },
      { id: 'D', text: 'Keduanya habis bereaksi bersamaan' }
    ],
    correctOptionId: 'A',
    explanation: 'Bandingkan mol / koefisien: N₂ = 2/1 = 2; H₂ = 3/3 = 1. Nilai terkecil adalah H₂, sehingga H₂ adalah pereaksi pembatas. Mol NH₃ = (2/3) × 3 mol H₂ = 2 mol NH₃.',
    audioPrompt: 'Pertanyaan sepuluh: Sebanyak dua mol nitrogen direaksikan dengan tiga mol hidrogen. Manakah pereaksi pembatas dan berapa mol amonia yang terbentuk?'
  },

  // Bab 10 - Asam Basa
  {
    id: 'diag-q11-asam-basa-ph',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-10',
    topicId: 'top-10-1',
    conceptId: 'conc-hitung-ph',
    conceptName: 'Perhitungan pH Asam Basa Kuat & Lemah',
    difficulty: 'easy',
    questionText: 'Larutan HCl 0,001 M memiliki nilai pH sebesar...',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '4' },
      { id: 'C', text: '11' },
      { id: 'D', text: '1' }
    ],
    correctOptionId: 'A',
    explanation: 'HCl merupakan asam kuat valensi 1 ([H⁺] = 1 × 10⁻³ M). pH = -log [H⁺] = -log (10⁻³) = 3.',
    audioPrompt: 'Pertanyaan sebelas: Larutan asam klorida nol koma nol nol satu Molar memiliki nilai pH sebesar berapa?'
  },

  // Bab 15 - Redoks & Biloks
  {
    id: 'diag-q12-redoks-biloks',
    subjectId: 'sma-kimia-10',
    chapterId: 'chap-kim-15',
    topicId: 'top-15-1',
    conceptId: 'conc-biloks-aturan',
    conceptName: 'Penentuan Bilangan Oksidasi & Identifikasi Redoks',
    difficulty: 'medium',
    questionText: 'Bilangan oksidasi atom Mangan (Mn) dalam senyawa Kalium Permanganat (KMnO₄) adalah...',
    options: [
      { id: 'A', text: '+7' },
      { id: 'B', text: '+6' },
      { id: 'C', text: '+4' },
      { id: 'D', text: '+2' }
    ],
    correctOptionId: 'A',
    explanation: 'Biloks K = +1, Biloks O = -2 (total 4 O = -8). Total biloks senyawa netral = 0. Maka (+1) + Biloks Mn + (-8) = 0 -> Biloks Mn = +7.',
    audioPrompt: 'Pertanyaan dua belas: Bilangan oksidasi atom Mangan dalam senyawa Kalium Permanganat KMnO empat adalah?'
  }
];
