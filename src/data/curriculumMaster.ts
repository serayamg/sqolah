export interface CurriculumConcept {
  id: string;
  name: string;
  description: string;
  prerequisiteConceptIds: string[]; // Root prerequisite concepts
  difficultyWeight: number; // 1 to 5
}

export interface CurriculumTopic {
  id: string;
  name: string;
  concepts: CurriculumConcept[];
}

export interface CurriculumChapter {
  id: string;
  babNumber: number;
  name: string;
  topics: CurriculumTopic[];
}

export interface CurriculumSubject {
  id: string;
  name: string;
  level: 'SD' | 'SMP' | 'SMA';
  grade: number;
  chapters: CurriculumChapter[];
}

export const MASTER_CURRICULUM: CurriculumSubject[] = [
  {
    id: 'sma-kimia-10',
    name: 'Kimia SMA',
    level: 'SMA',
    grade: 10,
    chapters: [
      {
        id: 'chap-kim-1',
        babNumber: 1,
        name: 'Struktur Atom & Sistem Periodik Unsur',
        topics: [
          {
            id: 'top-1-1',
            name: 'Partikel Penyusun & Notasi Atom',
            concepts: [
              {
                id: 'conc-partikel-atom',
                name: 'Proton, Neutron & Elektron',
                description: 'Memahami massa, muatan, dan letak partikel subatom dalam inti dan kulit atom.',
                prerequisiteConceptIds: [],
                difficultyWeight: 1
              },
              {
                id: 'conc-isotop-notasi',
                name: 'Nomor Atom, Nomor Massa & Isotop',
                description: 'Menghitung neutron, proton, dan muatan ion dari notasi nuklida.',
                prerequisiteConceptIds: ['conc-partikel-atom'],
                difficultyWeight: 2
              }
            ]
          },
          {
            id: 'top-1-2',
            name: 'Konfigurasi Elektron & Mekanika Kuantum',
            concepts: [
              {
                id: 'conc-konfig-elektron',
                name: 'Konfigurasi Bohr & Subkulit Aufbau',
                description: 'Menyusun elektron pada orbital s, p, d, f sesuai aturan Aufbau, Hund, dan Pauli.',
                prerequisiteConceptIds: ['conc-partikel-atom'],
                difficultyWeight: 3
              },
              {
                id: 'conc-bil-kuantum',
                name: 'Empat Bilangan Kuantum',
                description: 'Menentukan bilangan kuantum utama (n), azimuth (l), magnetik (m), dan spin (s).',
                prerequisiteConceptIds: ['conc-konfig-elektron'],
                difficultyWeight: 4
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-2',
        babNumber: 2,
        name: 'Ikatan Kimia & Bentuk Molekul',
        topics: [
          {
            id: 'top-2-1',
            name: 'Kestabilan Oktet & Ikatan Ion-Kovalen',
            concepts: [
              {
                id: 'conc-ikatan-ion',
                name: 'Ikatan Ion & Serah Terima Elektron',
                description: 'Pembentukan kation logam dan anion nonlogam dengan gaya elektrostatik kisi kristal.',
                prerequisiteConceptIds: ['conc-konfig-elektron'],
                difficultyWeight: 2
              },
              {
                id: 'conc-ikatan-kovalen',
                name: 'Ikatan Kovalen & Struktur Lewis',
                description: 'Pemakaian bersama pasangan elektron antar atom nonlogam dan sifat kepolaran.',
                prerequisiteConceptIds: ['conc-konfig-elektron'],
                difficultyWeight: 3
              }
            ]
          },
          {
            id: 'top-2-2',
            name: 'Geometri Molekul & Teori VSEPR',
            concepts: [
              {
                id: 'conc-vsepr-geometri',
                name: 'Teori Tolakan Domain Elektron (VSEPR)',
                description: 'Meramalkan bentuk molekul linear, tetrahedral, piramida, dan bengkok dari PEI dan PEB.',
                prerequisiteConceptIds: ['conc-ikatan-kovalen'],
                difficultyWeight: 4
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-3',
        babNumber: 3,
        name: 'Hakikat Ilmu Kimia & Metode Ilmiah',
        topics: [
          {
            id: 'top-3-1',
            name: 'Metode Ilmiah & Pengukuran Laboratorium',
            concepts: [
              {
                id: 'conc-metode-ilmiah',
                name: 'Tahapan Metode Ilmiah & Variabel',
                description: 'Mengidentifikasi variabel bebas, terikat, dan kontrol dalam percobaan kimia.',
                prerequisiteConceptIds: [],
                difficultyWeight: 1
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-4',
        babNumber: 4,
        name: 'Tata Nama Senyawa & Persamaan Reaksi Kimia',
        topics: [
          {
            id: 'top-4-1',
            name: 'Tata Nama IUPAC',
            concepts: [
              {
                id: 'conc-tata-nama',
                name: 'Tata Nama Senyawa Biner & Poliatomik',
                description: 'Menamai senyawa oksida, asam, basa, dan garam anorganik.',
                prerequisiteConceptIds: ['conc-ikatan-ion'],
                difficultyWeight: 2
              }
            ]
          },
          {
            id: 'top-4-2',
            name: 'Penyetaraan Persamaan Reaksi',
            concepts: [
              {
                id: 'conc-setara-reaksi',
                name: 'Penyetaraan Koefisien Reaksi',
                description: 'Menyetarakan jumlah atom reaktan dan produk sesuai hukum kekekalan massa.',
                prerequisiteConceptIds: ['conc-tata-nama'],
                difficultyWeight: 3
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-5',
        babNumber: 5,
        name: 'Hukum Dasar Kimia & Stoikiometri',
        topics: [
          {
            id: 'top-5-1',
            name: 'Hukum Dasar & Konsep Mol',
            concepts: [
              {
                id: 'conc-konsep-mol',
                name: 'Jembatan Mol & Massa Molar (Mr)',
                description: 'Mengonversi antara gram, mol, jumlah partikel (Avogadro), dan volume gas STP.',
                prerequisiteConceptIds: ['conc-isotop-notasi'],
                difficultyWeight: 3
              },
              {
                id: 'conc-pereaksi-pembatas',
                name: 'Stoikiometri & Pereaksi Pembatas',
                description: 'Menentukan zat pereaksi yang habis terlebih dahulu dan massa produk yang terbentuk.',
                prerequisiteConceptIds: ['conc-konsep-mol', 'conc-setara-reaksi'],
                difficultyWeight: 4
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-6',
        babNumber: 6,
        name: 'Senyawa Hidrokarbon & Minyak Bumi',
        topics: [
          {
            id: 'top-6-1',
            name: 'Alkana, Alkena, Alkuna & Isomer',
            concepts: [
              {
                id: 'conc-hidrokarbon-rantai',
                name: 'Kekhasan Karbon & Deret Homolog',
                description: 'Memahami rantai karbon jenuh, tak jenuh, dan keisomeran rangka serta posisi.',
                prerequisiteConceptIds: ['conc-ikatan-kovalen'],
                difficultyWeight: 3
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sma-kimia-11',
    name: 'Kimia SMA',
    level: 'SMA',
    grade: 11,
    chapters: [
      {
        id: 'chap-kim-7',
        babNumber: 7,
        name: 'Termokimia & Perubahan Entalpi',
        topics: [
          {
            id: 'top-7-1',
            name: 'Eksoterm, Endoterm & Hukum Hess',
            concepts: [
              {
                id: 'conc-termokimia-dasar',
                name: 'Reaksi Eksoterm & Endoterm (Delta H)',
                description: 'Menentukan tanda perubahan entalpi sistem dan lingkungan.',
                prerequisiteConceptIds: ['conc-konsep-mol'],
                difficultyWeight: 2
              },
              {
                id: 'conc-hukum-hess',
                name: 'Perhitungan Entalpi dengan Hukum Hess',
                description: 'Menghitung delta H reaksi dari diagram siklus dan data energi ikatan rata-rata.',
                prerequisiteConceptIds: ['conc-termokimia-dasar'],
                difficultyWeight: 4
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-8',
        babNumber: 8,
        name: 'Laju Reaksi & Teori Tumbukan',
        topics: [
          {
            id: 'top-8-1',
            name: 'Faktor Laju & Persamaan Orde',
            concepts: [
              {
                id: 'conc-teori-tumbukan',
                name: 'Faktor Laju & Energi Aktivasi (Ea)',
                description: 'Peran suhu, konsentrasi, luas permukaan, dan katalis dalam menurunkan Ea.',
                prerequisiteConceptIds: [],
                difficultyWeight: 2
              },
              {
                id: 'conc-orde-reaksi',
                name: 'Persamaan Laju & Orde Reaksi Eksperimen',
                description: 'Menentukan orde nol, satu, dua dari tabel laju awal percobaan.',
                prerequisiteConceptIds: ['conc-teori-tumbukan'],
                difficultyWeight: 4
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-10',
        babNumber: 10,
        name: 'Teori Asam Basa & Derajat Keasaman (pH)',
        topics: [
          {
            id: 'top-10-1',
            name: 'Konsep pH & Kekuatan Asam Basa',
            concepts: [
              {
                id: 'conc-teori-asambasa',
                name: 'Teori Arrhenius, Bronsted-Lowry & Lewis',
                description: 'Identifikasi donor-akseptor proton H+ dan pasangan asam-basa konjugasi.',
                prerequisiteConceptIds: ['conc-ikatan-kovalen'],
                difficultyWeight: 2
              },
              {
                id: 'conc-hitung-ph',
                name: 'Perhitungan pH Asam & Basa Kuat/Lemah',
                description: 'Menggunakan rumus -log[H+] dengan derajat ionisasi alfa dan tetapan Ka/Kb.',
                prerequisiteConceptIds: ['conc-teori-asambasa', 'conc-konsep-mol'],
                difficultyWeight: 3
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-11',
        babNumber: 11,
        name: 'Hidrolisis Garam & Larutan Penyangga (Buffer)',
        topics: [
          {
            id: 'top-11-1',
            name: 'Larutan Buffer & Penyangga Darah',
            concepts: [
              {
                id: 'conc-buffer-asam-basa',
                name: 'Mekanisme Larutan Penyangga (Buffer)',
                description: 'Menjelaskan daya tahan pH terhadap sedikit asam, basa, atau pengenceran.',
                prerequisiteConceptIds: ['conc-hitung-ph'],
                difficultyWeight: 4
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sma-kimia-12',
    name: 'Kimia SMA',
    level: 'SMA',
    grade: 12,
    chapters: [
      {
        id: 'chap-kim-14',
        babNumber: 14,
        name: 'Sifat Koligatif Larutan',
        topics: [
          {
            id: 'top-14-1',
            name: 'Empat Sifat Koligatif & Faktor Van\'t Hoff',
            concepts: [
              {
                id: 'conc-koligatif-nonelektrolit',
                name: 'Penurunan Titik Beku & Kenaikan Titik Didih',
                description: 'Menghitung delta Tb, delta Tf, dan tekanan osmosis pi larutan nonvolatil.',
                prerequisiteConceptIds: ['conc-konsep-mol'],
                difficultyWeight: 3
              },
              {
                id: 'conc-koligatif-elektrolit',
                name: 'Faktor Van\'t Hoff (i) pada Elektrolit',
                description: 'Mengoreksi sifat koligatif elektrolit dengan jumlah ion dan derajat disosiasi.',
                prerequisiteConceptIds: ['conc-koligatif-nonelektrolit', 'conc-ikatan-ion'],
                difficultyWeight: 4
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-15',
        babNumber: 15,
        name: 'Reaksi Reduksi Oksidasi (Redoks)',
        topics: [
          {
            id: 'top-15-1',
            name: 'Biloks & Penyetaraan Redoks',
            concepts: [
              {
                id: 'conc-biloks-aturan',
                name: 'Penentuan Bilangan Oksidasi & Oksidator/Reduktor',
                description: 'Menentukan atom yang mengalami oksidasi dan reduksi dalam reaksi kimia.',
                prerequisiteConceptIds: ['conc-setara-reaksi'],
                difficultyWeight: 2
              },
              {
                id: 'conc-setara-redoks',
                name: 'Metode Setengah Reaksi & Biloks (Asam/Basa)',
                description: 'Penyetaraan transfer elektron pada suasana larutan asam dan basa.',
                prerequisiteConceptIds: ['conc-biloks-aturan'],
                difficultyWeight: 4
              }
            ]
          }
        ]
      },
      {
        id: 'chap-kim-16',
        babNumber: 16,
        name: 'Sel Elektrokimia & Hukum Faraday',
        topics: [
          {
            id: 'top-16-1',
            name: 'Sel Volta & Potensial Sel Standar',
            concepts: [
              {
                id: 'conc-sel-volta',
                name: 'Sel Volta, Deret Volta & E° Sel',
                description: 'Menghitung potensial sel spontan dan reaksi di katode (+) dan anode (-).',
                prerequisiteConceptIds: ['conc-setara-redoks'],
                difficultyWeight: 3
              },
              {
                id: 'conc-hukum-faraday',
                name: 'Elektrolisis & Hukum Faraday I-II',
                description: 'Menghitung massa endapan logam pada katode dari kuat arus dan waktu (w = e.i.t / 96500).',
                prerequisiteConceptIds: ['conc-sel-volta', 'conc-konsep-mol'],
                difficultyWeight: 5
              }
            ]
          }
        ]
      }
    ]
  }
];

// Helper to look up any concept by ID
export function findConceptById(conceptId: string): { concept: CurriculumConcept; chapterName: string; subjectName: string } | null {
  for (const subj of MASTER_CURRICULUM) {
    for (const chap of subj.chapters) {
      for (const top of chap.topics) {
        for (const conc of top.concepts) {
          if (conc.id === conceptId) {
            return {
              concept: conc,
              chapterName: chap.name,
              subjectName: subj.name
            };
          }
        }
      }
    }
  }
  return null;
}
