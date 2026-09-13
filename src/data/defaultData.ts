import { Subject, Materi, Question } from '../types';

export const DEFAULT_SUBJECTS: Subject[] = [
  // =================== SD ===================
  {
    id: 'sd-matematika',
    name: 'Matematika SD',
    level: 'SD',
    kelas: [1, 2, 3, 4, 5, 6],
    icon: 'Calculator',
    color: 'from-amber-500 to-orange-500',
    description: 'Belajar berhitung, pecahan, geometri dasar, dan logika angka dengan metode interaktif.'
  },
  {
    id: 'sd-ipas',
    name: 'IPAS (Sains & Lingkungan)',
    level: 'SD',
    kelas: [3, 4, 5, 6],
    icon: 'Leaf',
    color: 'from-emerald-500 to-teal-600',
    description: 'Mengenal makhluk hidup, ekosistem, sifat wujud benda, dan energi di sekitar kita.'
  },
  {
    id: 'sd-indo',
    name: 'Bahasa Indonesia SD',
    level: 'SD',
    kelas: [1, 2, 3, 4, 5, 6],
    icon: 'BookOpen',
    color: 'from-rose-500 to-pink-600',
    description: 'Membaca nyaring, memahami dongeng, kosa kata baru, dan struktur kalimat sederhana.'
  },

  // =================== SMP ===================
  {
    id: 'smp-matematika',
    name: 'Matematika SMP',
    level: 'SMP',
    kelas: [7, 8, 9],
    icon: 'Divide',
    color: 'from-blue-500 to-indigo-600',
    description: 'Aljabar, persamaan linier, teorema Pythagoras, relasi fungsi, dan statistika dasar.'
  },
  {
    id: 'smp-ipa',
    name: 'IPA Terpadu SMP',
    level: 'SMP',
    kelas: [7, 8, 9],
    icon: 'Atom',
    color: 'from-cyan-500 to-blue-600',
    description: 'Eksplorasi sistem peredaran darah, gaya & gerak, tata surya, dan gelombang bunyi.'
  },
  {
    id: 'smp-inggris',
    name: 'Bahasa Inggris SMP',
    level: 'SMP',
    kelas: [7, 8, 9],
    icon: 'Languages',
    color: 'from-purple-500 to-pink-600',
    description: 'Listening comprehension, narrative texts, daily conversations, and grammar essentials.'
  },

  // =================== SMA ===================
  {
    id: 'sma-kimia',
    name: 'Kimia SMA',
    level: 'SMA',
    kelas: [10, 11, 12],
    icon: 'FlaskConical',
    color: 'from-emerald-600 to-teal-700',
    description: 'Handbook Kimia SMA 20 Bab mandiri: struktur atom, ikatan kimia, stoikiometri, asam basa, redoks, hingga makromolekul.'
  },
  {
    id: 'sma-fisika',
    name: 'Fisika SMA',
    level: 'SMA',
    kelas: [10, 11, 12],
    icon: 'Zap',
    color: 'from-violet-600 to-indigo-700',
    description: 'Mekanika klasik, termodinamika, gelombang elektromagnetik, dan fisika modern.'
  },
  {
    id: 'sma-biologi',
    name: 'Biologi SMA',
    level: 'SMA',
    kelas: [10, 11, 12],
    icon: 'Dna',
    color: 'from-green-600 to-emerald-700',
    description: 'Struktur sel, genetika & pewarisan sifat, metabolisme enzim, serta keanekaragaman hayati.'
  },
  {
    id: 'sma-matematika',
    name: 'Matematika SMA',
    level: 'SMA',
    kelas: [10, 11, 12],
    icon: 'Calculator',
    color: 'from-sky-600 to-blue-700',
    description: 'Kalkulus, trigonometri, vektor, eksponen dan logaritma, matriks, serta probabilitas.'
  }
];

// =========================================================================
// MATERI: HANYA KIMIA SMA (20 BAB LENGKAP DARI HANDBOOK KIMIA SMA)
// Pelajaran lain dikosongkan terlebih dahulu sesuai instruksi.
// =========================================================================

export const DEFAULT_MATERI: Materi[] = [
  // -------------------------------------------------------------
  // KELAS 10 (BAB 1 - 6)
  // -------------------------------------------------------------
  {
    id: 'kimia-sma-bab-1',
    subjectId: 'sma-kimia',
    kelas: 10,
    babNumber: 1,
    handbookFile: 'Handbook_Kimia_SMA_Bab1.html',
    title: 'Bab 1: Struktur Atom & Sistem Periodik Unsur',
    summary: 'Mempelajari partikel dasar penyusun atom (proton, neutron, elektron), notasi atom, isotop, perkembangan model atom dari Dalton hingga Mekanika Kuantum, serta konfigurasi elektron dan bilangan kuantum.',
    estimatedMinutes: 16,
    createdAt: '2026-09-02',
    keyPoints: [
      'Partikel subatom: Proton (+1) dan Neutron (0) berada di inti atom, Elektron (-1) bergerak mengelilingi inti.',
      'Nomor Atom (Z) menyatakan jumlah proton. Nomor Massa (A) menyatakan jumlah proton ditambah neutron.',
      'Isotop memiliki nomor atom sama tetapi nomor massa berbeda; isobar massa sama nomor atom beda; isoton neutron sama.',
      'Empat bilangan kuantum: utama (n), azimuth (l), magnetik (m), dan spin (s).'
    ],
    contentParagraphs: [
      'Atom adalah unit dasar penyusun seluruh unsur kimia di alam semesta. Di dalam setiap atom terdapat inti padat berukuran sangat kecil yang berisi proton bermuatan positif dan neutron yang netral, sementara elektron bermuatan negatif beredar di sekeliling inti.',
      'Pemahaman manusia mengenai atom berkembang dari model bola pejal John Dalton, bola bertabur kismis J.J. Thomson, model tata surya Rutherford dengan inti atom, model lintasan stasioner Niels Bohr, hingga Model Atom Mekanika Gelombang yang dirumuskan oleh Schrodinger dan Heisenberg.',
      'Posisi dan kemungkinan ditemukannya elektron dinyatakan melalui empat bilangan kuantum. Bilangan kuantum utama n menentukan tingkat energi lintasan. Bilangan azimuth l menentukan bentuk orbital (s, p, d, f). Bilangan magnetik m menentukan orientasi ruang, dan bilangan spin s menentukan arah putaran elektron searah atau berlawanan jarum jam.',
      'Sistem Periodik Unsur modern disusun berdasarkan kenaikan nomor atom dan kemiripan sifat kimia. Sifat periodik seperti jari-jari atom, energi ionisasi, afinitas elektron, dan keelektronegatifan memiliki pola keteraturan yang jelas sepanjang periode dan golongan.'
    ],
    auditoryNotes: 'Formula suara: Nomor Massa A di atas, Nomor Atom Z di bawah. Jumlah neutron selalu sama dengan A dikurangi Z.'
  },
  {
    id: 'kimia-sma-bab-2',
    subjectId: 'sma-kimia',
    kelas: 10,
    babNumber: 2,
    handbookFile: 'Handbook_Kimia_SMA_Bab2.html',
    title: 'Bab 2: Ikatan Kimia & Bentuk Molekul',
    summary: 'Kestabilan gas mulia, aturan oktet dan duplet, pembentukan ikatan ion, ikatan kovalen polar dan nonpolar, ikatan kovalen koordinasi, ikatan logam, serta prediksi geometri molekul dengan teori VSEPR dan gaya antarmolekul.',
    estimatedMinutes: 18,
    createdAt: '2026-09-03',
    keyPoints: [
      'Unsur berikatan untuk mencapai konfigurasi elektron stabil seperti gas mulia (aturan oktet 8 elektron valensi).',
      'Ikatan ion terbentuk karena serah terima elektron antara logam (melepas) dan nonlogam (menerima).',
      'Ikatan kovalen terbentuk karena pemakaian pasangan elektron bersama oleh sesama atom nonlogam.',
      'Teori VSEPR meramalkan bentuk molekul berdasarkan tolakan pasangan elektron ikatan (PEI) dan pasangan elektron bebas (PEB).'
    ],
    contentParagraphs: [
      'Semua atom di alam cenderung mencari kestabilan seperti unsur gas mulia golongan delapan A, yang memiliki delapan elektron pada kulit terluarnya. Untuk mencapai konfigurasi oktet ini, atom-atom saling berinteraksi membentuk ikatan kimia.',
      'Ikatan ion terjadi ketika atom logam dengan energi ionisasi rendah melepaskan elektron membentuk kation positif, lalu diterima oleh atom nonlogam yang memiliki afinitas elektron tinggi membentuk anion negatif. Gaya elektrostatik yang sangat kuat antar ion bermuatan berlawanan menghasilkan kristal garam dengan titik leleh tinggi.',
      'Sebaliknya, pada ikatan kovalen, dua atom nonlogam menyumbangkan elektron untuk digunakan bersama-sama. Jika kedua atom memiliki perbedaan keelektronegatifan, pasangan elektron akan tertarik lebih kuat ke salah satu atom sehingga menciptakan dipol dan menghasilkan ikatan kovalen polar seperti pada molekul air.',
      'Bentuk ruang suatu molekul ditentukan oleh tolakan pasangan-pasangan elektron valensi di sekitar atom pusat (teori VSEPR). Karena pasangan elektron bebas memiliki gaya tolak yang lebih besar daripada pasangan elektron ikatan, sudut ikatan dapat tertekan membentuk struktur molekul linear, segitiga datar, tetrahedral, piramida trigonal, maupun bentuk V.'
    ],
    auditoryNotes: 'Perhatikan irama suara: Ikatan ion serah terima elektron antara logam dan nonlogam; Ikatan kovalen pakai bersama oleh sesama nonlogam.'
  },
  {
    id: 'kimia-sma-bab-3',
    subjectId: 'sma-kimia',
    kelas: 10,
    babNumber: 3,
    handbookFile: 'Handbook_Kimia_SMA_Bab3.html',
    title: 'Bab 3: Hakikat Ilmu Kimia & Metode Ilmiah',
    summary: 'Mengenal hakikat ilmu kimia, klasifikasi materi, perubahan fisika dan kimia, tahapan metode ilmiah, sistem satuan pengukuran SI, serta prinsip keselamatan di laboratorium kimia.',
    estimatedMinutes: 14,
    createdAt: '2026-09-01',
    keyPoints: [
      'Ilmu Kimia adalah ilmu yang mempelajari susunan, struktur, sifat, dan perubahan materi serta energi yang menyertainya.',
      'Perubahan fisika tidak menghasilkan zat baru, sedangkan perubahan kimia selalu menghasilkan zat baru dengan sifat berbeda.',
      'Langkah metode ilmiah: Merumuskan masalah, menyusun hipotesis, merancang eksperimen, mengumpulkan data, dan menarik kesimpulan.',
      'Variabel penelitian mencakup variabel bebas (dimanipulasi), variabel terikat (diukur), dan variabel kontrol (dibuat konstan).'
    ],
    contentParagraphs: [
      'Selamat datang di pengantar ilmu kimia! Segala sesuatu di sekitar kita, mulai dari air yang kita minum, udara yang kita hirup, hingga zat penyusun tubuh kita, adalah materi. Ilmu kimia mempelajari bagaimana partikel-partikel terkecil materi saling berinteraksi dan berubah bentuk.',
      'Materi di alam semesta diklasifikasikan menjadi zat tunggal (unsur dan senyawa) serta campuran (homogen dan heterogen). Dalam kehidupan sehari-hari, kita sering melihat perubahan wujud seperti es mencair yang merupakan perubahan fisika, dan perkaratan besi atau pembakaran kayu yang merupakan perubahan kimia karena terbentuk zat baru.',
      'Untuk memecahkan masalah ilmiah secara objektif, para ilmuwan menggunakan metode ilmiah. Proses ini dimulai dari pengamatan fenomena, perumusan hipotesis sementara, uji eksperimen laboratorium dengan variabel yang terkontrol, hingga pengujian ulang untuk menarik kesimpulan yang sahih.',
      'Ketika bekerja di laboratorium kimia, keselamatan adalah prioritas nomor satu. Pengenalan simbol bahaya bahan kimia seperti korosif, mudah terbakar, beracun, dan pengoksidasi, serta penggunaan alat pelindung diri seperti jas lab dan kacamata keselamatan wajib dipatuhi.'
    ],
    auditoryNotes: 'Kunci auditori: Perubahan kimia menghasilkan zat baru, perubahan fisika hanya wujudnya yang berubah. Variabel bebas adalah penyebab, variabel terikat adalah akibat.'
  },
  {
    id: 'kimia-sma-bab-4',
    subjectId: 'sma-kimia',
    kelas: 10,
    babNumber: 4,
    handbookFile: 'Handbook_Kimia_SMA_Bab4.html',
    title: 'Bab 4: Tata Nama Senyawa & Persamaan Reaksi Kimia',
    summary: 'Aturan IUPAC tata nama senyawa biner, senyawa ion poliatomik, senyawa asam dan basa, serta teknik menyetarakan persamaan reaksi kimia secara matematis dan langsung.',
    estimatedMinutes: 15,
    createdAt: '2026-09-04',
    keyPoints: [
      'Tata nama senyawa ion: Nama kation disebut terlebih dahulu diikuti nama anion.',
      'Untuk logam bervalensi lebih dari satu, tuliskan bilangan oksidasinya dengan angka Romawi di dalam tanda kurung.',
      'Tata nama kovalen biner menggunakan awalan Yunani: mono, di, tri, tetra, penta, heksa.',
      'Persamaan reaksi setara apabila jumlah atom setiap unsur di ruas kiri sama dengan di ruas kanan.'
    ],
    contentParagraphs: [
      'Agar para ilmuwan di seluruh dunia dapat berkomunikasi dengan standar yang sama, International Union of Pure and Applied Chemistry (IUPAC) menetapkan tata nama sistematis bagi seluruh senyawa kimia.',
      'Untuk senyawa ionik biner yang terbentuk dari kation logam dan anion nonlogam, kita menyebutkan nama kation diikuti nama anion dengan akhiran ida, seperti natrium klorida. Jika logam memiliki lebih dari satu jenis muatan biloks, seperti besi dua dan besi tiga, kita menuliskan angka Romawinya, misalnya besi dua klorida atau besi tiga klorida.',
      'Untuk senyawa kovalen antara dua nonlogam, kita menggunakan awalan jumlah atom dalam bahasa Yunani, seperti karbon monoksida dan karbon dioksida. Sedangkan untuk senyawa asam, nama diawali dengan kata asam diikuti sisa anionnya, seperti asam klorida dan asam sulfat.',
      'Persamaan reaksi kimia menggambarkan reaktan yang bereaksi di sebelah kiri panah dan produk yang dihasilkan di sebelah kanan panah. Menurut hukum kekekalan massa, atom tidak dapat diciptakan atau dimusnahkan, sehingga kita harus menyetarakan jumlah atom di kedua ruas dengan menambahkan koefisien reaksi yang tepat di depan rumus kimia zat.'
    ],
    auditoryNotes: 'Tips suara: Koefisien reaksi adalah angka pengali di depan zat untuk menyamakan atom ruas kiri dan kanan, jangan pernah mengubah angka indeks kecil!'
  },
  {
    id: 'kimia-sma-bab-5',
    subjectId: 'sma-kimia',
    kelas: 10,
    babNumber: 5,
    handbookFile: 'Handbook_Kimia_SMA_Bab5.html',
    title: 'Bab 5: Hukum Dasar Kimia & Stoikiometri',
    summary: 'Hukum-hukum dasar kimia (Lavoisier, Proust, Dalton, Gay-Lussac, Avogadro), konsep mol sebagai jembatan kuantitatif partikel, perhitungan massa molar, volume gas molar, rumus empiris dan molekul, serta pereaksi pembatas.',
    estimatedMinutes: 20,
    createdAt: '2026-09-05',
    keyPoints: [
      'Hukum Lavoisier: Massa total zat sebelum reaksi sama dengan massa total zat sesudah reaksi dalam ruang tertutup.',
      'Satu mol zat mengandung 6,02 dikali 10 pangkat 23 partikel (bilangan Avogadro).',
      'Massa sama dengan mol dikali massa molar (Mr atau Ar).',
      'Pereaksi pembatas adalah zat pereaksi yang habis bereaksi terlebih dahulu dan membatasi jumlah produk yang terbentuk.'
    ],
    contentParagraphs: [
      'Stoikiometri adalah fondasi perhitungan dalam kimia yang mempelajari hubungan kuantitatif antara massa, volume, dan jumlah partikel zat yang terlibat dalam suatu reaksi kimia.',
      'Lima hukum dasar kimia mendasari konsep ini: Hukum Kekekalan Massa Lavoisier, Hukum Perbandingan Tetap Proust, Hukum Perbandingan Berganda Dalton, Hukum Perbandingan Volume Gay-Lussac, dan Hipotesis Avogadro yang menyatakan bahwa gas-gas bervolume sama pada suhu dan tekanan yang sama memiliki jumlah molekul yang sama.',
      'Konsep mol adalah jembatan utama perhitungan kimia. Satu mol zat didefinisikan sebagai jumlah zat yang mengandung 6,02 kali 10 pangkat 23 partikel. Melalui konsep mol, kita dapat dengan mudah mengonversi antara gram massa zat, jumlah atom atau molekul, dan volume gas pada kondisi standar STP sebesar 22,4 liter per mol.',
      'Dalam praktiknya di laboratorium, seringkali zat-zat yang dicampurkan tidak berada dalam perbandingan stoikiometri yang tepat. Zat yang habis bereaksi terlebih dahulu disebut pereaksi pembatas. Pereaksi pembatas inilah yang menentukan berapa banyak produk yang maksimal dapat dihasilkan.'
    ],
    auditoryNotes: 'Jembatan keledai mol: Ke gram dikali Mr, dari gram dibagi Mr. Ke volume STP dikali 22,4, dari volume dibagi 22,4.'
  },
  {
    id: 'kimia-sma-bab-6',
    subjectId: 'sma-kimia',
    kelas: 10,
    babNumber: 6,
    handbookFile: 'Handbook_Kimia_SMA_Bab6.html',
    title: 'Bab 6: Senyawa Hidrokarbon & Minyak Bumi',
    summary: 'Kekhasan atom karbon yang mampu membentuk 4 ikatan kovalen stabil dan rantai panjang, deret homolog alkana, alkena, alkuna, keisomeran rangka, posisi, dan geometri, serta proses distilasi bertingkat minyak bumi dan angka oktan.',
    estimatedMinutes: 16,
    createdAt: '2026-09-06',
    keyPoints: [
      'Atom karbon memiliki 4 elektron valensi sehingga mampu membentuk ikatan tunggal, rangkap dua, rangkap tiga, serta rantai karbon melingkar.',
      'Deret homolog: Alkana berumus CnH2n+2, Alkena CnH2n, Alkuna CnH2n-2.',
      'Minyak bumi dipisahkan berdasarkan perbedaan titik didih menggunakan distilasi bertingkat.',
      'Kualitas bensin dinyatakan dengan bilangan oktan (perbandingan isooktana terhadap n-heptana).'
    ],
    contentParagraphs: [
      'Karbon adalah unsur istimewa yang menjadi tulang punggung kimia organik dan kehidupan. Karena terletak di golongan 4A, atom karbon memiliki empat elektron valensi yang memungkinkannya membentuk empat ikatan kovalen yang sangat stabil dengan sesama atom karbon maupun atom lain.',
      'Hidrokarbon adalah senyawa organik paling sederhana yang hanya tersusun dari hidrogen dan karbon. Tiga kelompok utamanya adalah alkana dengan ikatan tunggal yang jenuh, alkena dengan ikatan rangkap dua yang tak jenuh, dan alkuna dengan ikatan rangkap tiga.',
      'Isomer adalah senyawa-senyawa yang memiliki rumus molekul sama persis tetapi rumus struktur atau susunan ruangnya berbeda. Kita membedakan isomer rangka, isomer posisi gugus atau ikatan rangkap, serta isomer geometri cis dan trans pada alkena.',
      'Minyak bumi yang ditambang dari perut bumi merupakan campuran kompleks ribuan jenis hidrokarbon. Melalui teknik distilasi bertingkat di kilang minyak, fraksi-fraksi minyak bumi dipisahkan berdasarkan titik didihnya menjadi elpiji, bensin, nafta, kerosin, solar, pelumas, dan aspal.'
    ],
    auditoryNotes: 'Formula hafalan deret suara: Alkana plus dua, Alkena pas dua n, Alkuna minus dua.'
  },

  // -------------------------------------------------------------
  // KELAS 11 (BAB 7 - 13)
  // -------------------------------------------------------------
  {
    id: 'kimia-sma-bab-7',
    subjectId: 'sma-kimia',
    kelas: 11,
    babNumber: 7,
    handbookFile: 'Handbook_Kimia_SMA_Bab7.html',
    title: 'Bab 7: Termokimia & Perubahan Entalpi',
    summary: 'Mempelajari perpindahan energi kalor antara sistem dan lingkungan, reaksi eksoterm dan endoterm, entalpi pembentukan standar, Hukum Hess, perhitungan kalorimetri, serta energi ikatan rata-rata.',
    estimatedMinutes: 17,
    createdAt: '2026-09-07',
    keyPoints: [
      'Reaksi eksoterm melepaskan kalor ke lingkungan (delta H bernilai negatif, suhu lingkungan naik).',
      'Reaksi endoterm menyerap kalor dari lingkungan (delta H bernilai positif, suhu lingkungan turun).',
      'Hukum Hess: Perubahan entalpi reaksi hanya bergantung pada keadaan awal dan keadaan akhir, tidak bergantung pada jalannya reaksi.',
      'Perhitungan delta H: Jumlah delta H pembentukan produk dikurangi jumlah delta H pembentukan reaktan.'
    ],
    contentParagraphs: [
      'Termokimia adalah cabang kimia yang mempelajari perubahan kalor dan energi yang menyertai reaksi kimia. Sistem adalah bagian yang menjadi pusat perhatian kita, sedangkan lingkungan adalah segala sesuatu di luar sistem.',
      'Berdasarkan arah aliran energinya, reaksi dibedakan menjadi dua. Reaksi eksoterm melepaskan kalor dari sistem ke lingkungan sehingga entalpi sistem berkurang dan delta H bernilai negatif, seperti pembakaran bensin atau reaksi penetralan asam-basa. Sebaliknya, reaksi endoterm menyerap kalor dari lingkungan ke sistem sehingga delta H bernilai positif dan wadah terasa dingin.',
      'Menurut Hukum Hess yang dirumuskan Germain Henri Hess, perubahan entalpi suatu reaksi bersifat fungsi keadaan. Artinya, jika suatu reaksi dapat berlangsung melalui beberapa tahapan, total perubahan entalpi reaksi sama dengan jumlah perubahan entalpi dari setiap tahapannya.',
      'Kita juga dapat memperkirakan nilai delta H reaksi menggunakan data energi ikatan rata-rata. Reaksi kimia pada dasarnya adalah pemutusan ikatan pada zat reaktan yang memerlukan energi, diikuti pembentukan ikatan baru pada zat produk yang melepaskan energi.'
    ],
    auditoryNotes: 'Tanda delta H: Eksoterm keluar panas tanda negatif; Endoterm masuk panas tanda positif.'
  },
  {
    id: 'kimia-sma-bab-8',
    subjectId: 'sma-kimia',
    kelas: 11,
    babNumber: 8,
    handbookFile: 'Handbook_Kimia_SMA_Bab8.html',
    title: 'Bab 8: Laju Reaksi & Teori Tumbukan',
    summary: 'Konsep kecepatan berkurangnya reaktan atau bertambahnya produk per satuan waktu, teori tumbukan efektif dan energi aktivasi, faktor penentu laju reaksi (suhu, konsentrasi, luas permukaan, katalis), persamaan laju dan penentuan orde reaksi.',
    estimatedMinutes: 16,
    createdAt: '2026-09-08',
    keyPoints: [
      'Laju reaksi menyatakan perubahan konsentrasi reaktan atau produk per satuan waktu (Molar per detik).',
      'Syarat tumbukan efektif: Partikel harus bertumbukan dengan orientasi yang tepat dan memiliki energi minimal sebesar energi aktivasi (Ea).',
      'Katalis mempercepat reaksi dengan cara memberikan jalur reaksi alternatif yang memiliki energi aktivasi lebih rendah.',
      'Orde reaksi ditentukan hanya melalui data eksperimen, bukan dari koefisien reaksi!'
    ],
    contentParagraphs: [
      'Ada reaksi kimia yang berlangsung secepat kilat seperti ledakan kembang api, namun ada pula reaksi yang berlangsung sangat lambat selama bertahun-tahun seperti perkaratan besi. Ilmu laju reaksi mempelajari seberapa cepat suatu reaksi berlangsung dan mekanisme di balik kecepatan tersebut.',
      'Menurut Teori Tumbukan, reaksi kimia hanya dapat terjadi jika partikel-partikel pereaksi saling bertumbukan secara efektif. Agar tumbukan menghasilkan reaksi, molekul harus bertabrakan dengan posisi orientasi yang tepat serta membawa energi kinetik yang cukup untuk melampaui energi aktivasi.',
      'Ada empat faktor utama yang memengaruhi laju reaksi: Pertama, konsentrasi pereaksi yang semakin pekat meningkatkan peluang tumbukan; Kedua, luas permukaan bidang sentuh zat padat; Ketiga, kenaikan suhu yang menaikkan energi kinetik molekul; dan Keempat, penambahan katalis.',
      'Katalisator adalah zat yang dapat mempercepat laju reaksi tanpa dirinya sendiri mengalami perubahan kimia permanen di akhir reaksi. Katalis bekerja dengan cara menurunkan ambang energi aktivasi, sehingga fraksi molekul yang memiliki cukup energi untuk bereaksi menjadi jauh lebih besar.'
    ],
    auditoryNotes: 'Ingat audio: Katalis menurunkan energi aktivasi! Setiap kenaikan suhu 10 derajat Celcius, laju reaksi umumnya berlipat ganda dua hingga tiga kali.'
  },
  {
    id: 'kimia-sma-bab-9',
    subjectId: 'sma-kimia',
    kelas: 11,
    babNumber: 9,
    handbookFile: 'Handbook_Kimia_SMA_Bab9.html',
    title: 'Bab 9: Kesetimbangan Kimia & Asas Le Chatelier',
    summary: 'Ciri-ciri reaksi bolak-balik (reversible) dan kesetimbangan dinamis, tetapan kesetimbangan konsentrasi (Kc) dan tekanan (Kp), faktor yang menggeser kesetimbangan menurut Asas Le Chatelier, dan sintesis amonia proses Haber-Bosch.',
    estimatedMinutes: 18,
    createdAt: '2026-09-09',
    keyPoints: [
      'Kesetimbangan dinamis tercapai ketika laju reaksi ke kanan sama besar dengan laju reaksi ke kiri dalam wadah tertutup.',
      'Hanya zat berfase larutan (aqueous) dan gas yang diperhitungkan dalam rumusan Kc; zat padat murni dan cairan murni diabaikan.',
      'Asas Le Chatelier: Jika pada sistem kesetimbangan diberikan aksi gangguan, sistem akan mengadakan reaksi pergeseran untuk meminimalkan aksi tersebut.',
      'Peningkatan tekanan atau pengecilan volume akan menggeser kesetimbangan ke arah yang jumlah koefisien gasnya lebih kecil.'
    ],
    contentParagraphs: [
      'Banyak reaksi kimia di alam tidak berlangsung satu arah hingga habis, melainkan bolak-balik atau reversibel. Ketika laju pembentukan produk ke arah kanan sama persis dengan laju pembentukan kembali reaktan ke arah kiri, sistem telah mencapai kondisi kesetimbangan dinamis.',
      'Secara makroskopis, pada saat setimbang konsentrasi setiap zat tampak konstan dan tidak ada perubahan visual. Namun secara mikroskopis, partikel-partikel zat terus bereaksi maju dan mundur dengan kecepatan yang seimbang secara konstan.',
      'Asas Le Chatelier menyatakan bahwa apabila suatu sistem kesetimbangan diberikan pengaruh dari luar seperti perubahan konsentrasi, suhu, tekanan, atau volume, maka kesetimbangan akan bergeser ke arah yang berlawanan untuk mengurangi dampak gangguan tersebut.',
      'Prinsip pergeseran kesetimbangan ini diterapkan secara masif dalam industri kimia dunia, contohnya pada proses Haber-Bosch untuk sintesis pupuk amonia dan proses Kontak untuk produksi asam sulfat, guna memaksimalkan hasil produksi dengan biaya energi seefisien mungkin.'
    ],
    auditoryNotes: 'Kunci audio Le Chatelier: Ditambah zat bergeser menjauh, dikurangi zat bergeser mendekat. Suhu naik geser ke endoterm, suhu turun geser ke eksoterm.'
  },
  {
    id: 'kimia-sma-bab-10',
    subjectId: 'sma-kimia',
    kelas: 11,
    babNumber: 10,
    handbookFile: 'Handbook_Kimia_SMA_Bab10.html',
    title: 'Bab 10: Teori Asam Basa & Derajat Keasaman (pH)',
    summary: 'Perbandingan tiga teori asam-basa (Arrhenius, Bronsted-Lowry, Lewis), pasangan asam-basa konjugasi, perhitungan konsentrasi ion H+ dan OH-, konsep skala logaritma pH dan pOH, serta trayek perubahan warna indikator.',
    estimatedMinutes: 18,
    createdAt: '2026-09-10',
    keyPoints: [
      'Arrhenius: Asam melepas ion H+ dalam air, Basa melepas ion OH- dalam air.',
      'Bronsted-Lowry: Asam adalah donor proton (H+), Basa adalah akseptor proton (H+).',
      'Lewis: Asam adalah akseptor pasangan elektron, Basa adalah donor pasangan elektron.',
      'Rumus pH sama dengan minus logaritma konsentrasi H+. Pada suhu 25 derajat Celcius, pH ditambah pOH sama dengan 14.'
    ],
    contentParagraphs: [
      'Senyawa asam dan basa merupakan kelompok zat yang sangat akrab dalam kehidupan kita, mulai dari asam cuka dan asam lambung hingga sabun dan detergen yang bersifat basa.',
      'Teori asam basa berkembang melalui tiga konsep utama: Svante Arrhenius mendefinisikan asam sebagai zat yang melepaskan ion hidrogen dalam air dan basa melepaskan ion hidroksida. Johannes Bronsted dan Thomas Lowry memperluas konsep ini tanpa ketergantungan pelarut air dengan teori transfer proton H+. Gilbert Newton Lewis melengkapinya lebih jauh lagi berdasarkan transfer pasangan elektron.',
      'Kekuatan suatu asam atau basa ditentukan oleh kemampuannya terionisasi. Asam dan basa kuat seperti asam klorida dan natrium hidroksida terionisasi sempurna dengan derajat ionisasi satu. Sementara asam dan basa lemah seperti asam asetat terionisasi sebagian dan memiliki tetapan ionisasi Ka atau Kb.',
      'Tingkat keasaman suatu larutan diukur menggunakan skala pH yang dirumuskan oleh Soren Sorensen. Skala pH bernilai dari 0 hingga 14. Larutan netral memiliki pH 7, larutan asam memiliki pH kurang dari 7, dan larutan basa memiliki pH lebih dari 7.'
    ],
    auditoryNotes: 'Formula suara logaritma: Konsentrasi H+ bernilai sepuluh pangkat minus lima memiliki pH sama dengan lima. Makin kecil angka pH, makin kuat asamnya.'
  },
  {
    id: 'kimia-sma-bab-11',
    subjectId: 'sma-kimia',
    kelas: 11,
    babNumber: 11,
    handbookFile: 'Handbook_Kimia_SMA_Bab11.html',
    title: 'Bab 11: Hidrolisis Garam & Larutan Penyangga (Buffer)',
    summary: 'Reaksi hidrolisis kation dan anion garam dalam air, garam pembentuk sifat asam, basa, atau netral, prinsip kerja larutan penyangga asam dan basa dalam mempertahankan kestabilan pH, serta sistem buffer karbonat dalam darah manusia.',
    estimatedMinutes: 19,
    createdAt: '2026-09-11',
    keyPoints: [
      'Hanya ion dari asam lemah atau basa lemah yang dapat mengalami hidrolisis bereaksi dengan air.',
      'Garam dari asam kuat dan basa lemah terhidrolisis sebagian menghasilkan sifat asam (pH < 7).',
      'Larutan penyangga (buffer) mampu mempertahankan pH terhadap penambahan sedikit asam, sedikit basa, atau pengenceran.',
      'Buffer asam tersusun atas asam lemah dan basa konjugasinya (garamnya).'
    ],
    contentParagraphs: [
      'Ketika larutan asam dan basa dicampurkan, terbentuk garam dan air. Namun, tidak semua larutan garam bersifat netral dengan pH 7. Peristiwa bereaksinya ion-ion garam dengan air disebut hidrolisis garam.',
      'Ion yang berasal dari asam kuat atau basa kuat seperti kation natrium atau anion klorida tidak akan bereaksi dengan air karena memiliki afinitas yang sangat lemah. Namun ion dari asam lemah atau basa lemah seperti ion amonium atau asetat akan bereaksi dengan molekul air menghasilkan ion H+ atau OH-, yang menentukan apakah larutan garam tersebut bersifat asam atau basa.',
      'Larutan penyangga atau buffer adalah larutan yang memiliki ketahanan luar biasa dalam menjaga kestabilan nilai pH-nya. Jika ke dalam larutan buffer ditambahkan sedikit asam kuat, sedikit basa kuat, ataupun diencerkan dengan banyak air, perubahan pH yang terjadi sangat kecil hingga hampir tidak terasa.',
      'Di dalam tubuh kita, larutan penyangga memainkan peran vital yang menentukan keselamatan jiwa. Darah manusia memiliki sistem penyangga asam karbonat dan bikarbonat yang menjaga pH darah selalu stabil pada rentang yang sangat sempit yaitu 7,35 hingga 7,45 agar enzim tubuh dapat bekerja normal.'
    ],
    auditoryNotes: 'Ingat audio: Yang kuat yang menang! Asam kuat + basa lemah menghasilkan garam asam. Penyangga menjaga pH darah manusia tetap 7,4.'
  },
  {
    id: 'kimia-sma-bab-12',
    subjectId: 'sma-kimia',
    kelas: 11,
    babNumber: 12,
    handbookFile: 'Handbook_Kimia_SMA_Bab12.html',
    title: 'Bab 12: Titrasi Asam Basa & Penentuan Kadar Zat',
    summary: 'Prinsip analisis kuantitatif volumetri titrasi asidimetri dan alkalimetri, fungsi buret dan erlenmeyer, kurva titrasi, titik ekivalen teoritis dan titik akhir titrasi praktis, serta pemilihan indikator pH yang tepat.',
    estimatedMinutes: 15,
    createdAt: '2026-09-12',
    keyPoints: [
      'Titrasi adalah metode analisis kuantitatif untuk menentukan konsentrasi suatu larutan analit menggunakan larutan standar yang telah diketahui konsentrasinya.',
      'Titik Ekivalen adalah kondisi saat mol ekuivalen asam tepat sama dengan mol ekuivalen basa.',
      'Titik Akhir Titrasi adalah kondisi saat indikator berubah warna sebagai tanda titrasi harus segera dihentikan.',
      'Rumus perhitungan titrasi: Va dikali Ma dikali valensi a sama dengan Vb dikali Mb dikali valensi b.'
    ],
    contentParagraphs: [
      'Titrasi asam basa adalah salah satu metode analisis volumetri paling populer di laboratorium kimia. Melalui titrasi, kita dapat mengetahui konsentrasi larutan sampel yang belum diketahui secara presisi dengan mereaksikannya secara bertahap bersama larutan standar.',
      'Peralatan penting titrasi meliputi buret tegak berskala yang menampung larutan peniter, labu erlenmeyer di bawahnya yang berisi larutan sampel analit, serta beberapa tetes indikator warna pH.',
      'Dua istilah penting yang sering dibahas adalah Titik Ekivalen dan Titik Akhir Titrasi. Titik ekivalen adalah titik teoritis saat jumlah mol asam tepat habis bereaksi dengan jumlah mol basa secara stoikiometri. Sedangkan titik akhir titrasi adalah saat kita menghentikan penetesan buret karena indikator telah menunjukkan perubahan warna yang tegas.',
      'Pemilihan indikator titrasi harus disesuaikan dengan kurva titrasi dan trayek pH titik ekivalen reaksi. Misalnya pada titrasi asam kuat dengan basa kuat di mana titik ekivalen berada di sekitar pH 7, indikator fenolftalein (PP) yang berubah dari tidak berwarna menjadi merah muda pudar sangat cocok digunakan.'
    ],
    auditoryNotes: 'Rumus suara titrasi: V dikali M dikali valensi asam sama dengan V dikali M dikali valensi basa. Titik akhir titrasi ditandai perubahan warna pertama yang tidak hilang!'
  },
  {
    id: 'kimia-sma-bab-13',
    subjectId: 'sma-kimia',
    kelas: 11,
    babNumber: 13,
    handbookFile: 'Handbook_Kimia_SMA_Bab13.html',
    title: 'Bab 13: Kelarutan & Hasil Kali Kelarutan (Ksp)',
    summary: 'Definisi kelarutan zat (s) dalam satuan mol per liter, tetapan hasil kali kelarutan (Ksp), pengaruh penambahan ion senama yang memperkecil kelarutan zat, pengaruh pH, serta cara memprediksi pembentukan endapan melalui perbandingan Qsp dan Ksp.',
    estimatedMinutes: 17,
    createdAt: '2026-09-13',
    keyPoints: [
      'Kelarutan (s) adalah jumlah maksimum zat terlarut yang dapat larut dalam satu liter pelarut membentuk larutan jenuh.',
      'Ksp adalah tetapan kesetimbangan untuk senyawa ionik yang sukar larut dalam larutan jenuhnya.',
      'Penambahan ion senama akan menggeser kesetimbangan ke arah zat padat sehingga kelarutan zat semakin mengecil.',
      'Prediksi endapan: Jika Qsp < Ksp larutan belum jenuh; jika Qsp = Ksp larutan tepat jenuh; jika Qsp > Ksp terjadi endapan.'
    ],
    contentParagraphs: [
      'Tidak semua garam mudah larut dalam air seperti garam dapur. Garam-garam seperti perak klorida atau barium sulfat sangat sukar larut dalam air. Namun demikian, sebagian sangat kecil dari senyawa tersebut tetap larut dan terurai menjadi ion-ionnya dalam larutan.',
      'Kelarutan yang dilambangkan dengan huruf s menyatakan konsentrasi molar tertinggi yang dapat larut pada suhu tertentu membentuk larutan jenuh. Hasil kali konsentrasi ion-ion dalam larutan jenuh tersebut yang masing-masing dipangkatkan dengan koefisien reaksinya dinamakan Tetapan Hasil Kali Kelarutan atau Ksp.',
      'Salah satu fenomena penting dalam Ksp adalah pengaruh ion sejenis atau ion senama. Jika kita menambahkan suatu zat yang mengandung ion yang sama ke dalam larutan jenuh garam yang sukar larut, maka menurut asas Le Chatelier kesetimbangan akan terdorong kembali ke arah reaktan padat, sehingga kelarutan garam tersebut menjadi jauh lebih kecil.',
      'Untuk meramalkan apakah pencampuran dua larutan elektrolit akan menghasilkan endapan atau tidak, kita membandingkan nilai hasil kali ion kuosien reaksi Qsp dengan nilai Ksp. Apabila nilai Qsp melebihi Ksp, larutan telah melewati batas lewat jenuh dan endapan kristal padat pasti akan terbentuk.'
    ],
    auditoryNotes: 'Hafalan aturan endapan: Qsp lebih besar dari Ksp pasti mengendap. Ada ion senama, kelarutan makin kecil dan susah larut!'
  },

  // -------------------------------------------------------------
  // KELAS 12 (BAB 14 - 20)
  // -------------------------------------------------------------
  {
    id: 'kimia-sma-bab-14',
    subjectId: 'sma-kimia',
    kelas: 12,
    babNumber: 14,
    handbookFile: 'Handbook_Kimia_SMA_Bab14.html',
    title: 'Bab 14: Sifat Koligatif Larutan',
    summary: 'Mempelajari sifat larutan yang hanya bergantung pada jumlah partikel zat terlarut: penurunan tekanan uap (Hukum Raoult), kenaikan titik didih, penurunan titik beku, tekanan osmosis, serta faktor Van\'t Hoff (i) pada elektrolit.',
    estimatedMinutes: 18,
    createdAt: '2026-09-14',
    keyPoints: [
      'Sifat koligatif hanya bergantung pada jumlah partikel zat terlarut, bukan pada jenis zatnya.',
      'Empat sifat koligatif: Penurunan tekanan uap (delta P), Kenaikan titik didih (delta Tb), Penurunan titik beku (delta Tf), Tekanan osmosis (pi).',
      'Faktor Van\'t Hoff i = 1 + (n - 1) dikali alfa, digunakan untuk menghitung sifat koligatif larutan elektrolit.',
      'Penerapan: Penggunaan garam untuk mencairkan salju di jalan dan etilen glikol sebagai cairan antibeku radiator.'
    ],
    contentParagraphs: [
      'Sifat koligatif larutan adalah kelompok sifat fisika larutan yang istimewa karena nilainya hanya ditentukan oleh banyaknya jumlah partikel zat terlarut di dalam pelarut, sama sekali tidak dipengaruhi oleh ukuran maupun jenis partikelnya.',
      'Kehadiran partikel zat terlarut nonvolatil akan menghalangi molekul pelarut untuk menguap di permukaan cairan, menyebabkan penurunan tekanan uap jenuh larutan sesuai Hukum Francois Marie Raoult. Dampak langsungnya, larutan membutuhkan suhu yang lebih tinggi untuk mendidih (kenaikan titik didih delta Tb) dan suhu yang lebih dingin untuk membeku (penurunan titik beku delta Tf).',
      'Tekanan osmosis adalah tekanan hidrostatik yang dibutuhkan untuk menghentikan aliran molekul pelarut murni melewati membran semipermeabel menuju larutan yang lebih pekat. Rumusan tekanan osmosis mirip dengan persamaan gas ideal, yaitu pi sama dengan Molaritas dikali tetapan gas R dikali suhu mutlak Kelvin T.',
      'Untuk larutan elektrolit yang terurai menjadi ion-ion di dalam air seperti NaCl atau BaCl2, jumlah partikel yang dihasilkan berlipat ganda sesuai jumlah ionnya. Oleh karena itu, perhitungan sifat koligatif larutan elektrolit selalu dikalikan dengan faktor koreksi Van\'t Hoff i.'
    ],
    auditoryNotes: 'Kunci suara koligatif: Titik didih naik (delta Tb), titik beku turun (delta Tf), tekanan uap turun (delta P). Larutan elektrolit selalu dikali faktor i!'
  },
  {
    id: 'kimia-sma-bab-15',
    subjectId: 'sma-kimia',
    kelas: 12,
    babNumber: 15,
    handbookFile: 'Handbook_Kimia_SMA_Bab15.html',
    title: 'Bab 15: Reaksi Reduksi Oksidasi (Redoks)',
    summary: 'Konsep bilangan oksidasi unsur, identifikasi zat oksidator dan reduktor, penyetaraan persamaan reaksi redoks kompleks menggunakan metode perubahan bilangan oksidasi (PBO) dan metode setengah reaksi (ion-elektron) dalam suasana asam dan basa.',
    estimatedMinutes: 18,
    createdAt: '2026-09-15',
    keyPoints: [
      'Oksidasi adalah peristiwa kenaikan bilangan oksidasi (pelepasan elektron).',
      'Reduksi adalah peristiwa penurunan bilangan oksidasi (penerimaan elektron).',
      'Oksidator adalah zat yang mengalami reduksi; Reduktor adalah zat yang mengalami oksidasi.',
      'Penyetaraan reaksi redoks metode setengah reaksi: Samakan atom selain O dan H, samakan O dengan H2O, samakan H dengan H+, lalu samakan muatan dengan elektron.'
    ],
    contentParagraphs: [
      'Reaksi reduksi dan oksidasi atau redoks adalah jenis reaksi kimia yang melibatkan perpindahan elektron antar partikel pereaksi. Reaksi redoks mendasari berbagai proses krusial seperti metabolisme sel pernapasan, pembakaran bahan bakar, perkaratan logam, hingga cara kerja baterai ponsel.',
      'Bilangan oksidasi atau biloks adalah muatan hipotesis suatu atom dalam senyawa jika seluruh ikatan kovalen dianggap sebagai ikatan ion. Peningkatan nilai biloks menandakan atom tersebut mengalami oksidasi karena melepaskan elektron. Sebaliknya, penurunan nilai biloks menandakan reduksi karena menerima elektron.',
      'Zat yang menyebabkan zat lain teroksidasi sementara dirinya sendiri mengalami reduksi disebut agen pengoksidasi atau oksidator. Sebaliknya, zat yang mereduksi zat lain sementara dirinya sendiri teroksidasi disebut reduktor.',
      'Reaksi redoks kompleks seringkali tidak dapat disetarakan hanya dengan menebak koefisien. Kita memerlukan metode sistematis seperti metode setengah reaksi atau metode perubahan bilangan oksidasi, dengan memperhatikan apakah reaksi berlangsung dalam suasana larutan asam atau basa.'
    ],
    auditoryNotes: 'Pola hafalan: Oksidasi lepas elektron biloks naik; Reduksi terima elektron biloks turun. Oksidator zatnya justru tereduksi!'
  },
  {
    id: 'kimia-sma-bab-16',
    subjectId: 'sma-kimia',
    kelas: 12,
    babNumber: 16,
    handbookFile: 'Handbook_Kimia_SMA_Bab16.html',
    title: 'Bab 16: Sel Elektrokimia & Hukum Faraday',
    summary: 'Perbedaan mendasar Sel Volta (energi kimia menjadi listrik spontan) dan Sel Elektrolisis (energi listrik memicu reaksi tak spontan), deret volta dan potensial sel standar, reaksi di katode dan anode, Hukum Faraday I dan II, serta proteksi katodik korosi.',
    estimatedMinutes: 20,
    createdAt: '2026-09-16',
    keyPoints: [
      'Sel Volta: Reaksi redoks spontan menghasilkan arus listrik (Katode positif reduksi, Anode negatif oksidasi).',
      'Sel Elektrolisis: Arus listrik luar menggerakkan reaksi redoks tak spontan (Katode negatif reduksi, Anode positif oksidasi).',
      'Di kedua jenis sel, Katode selalu tempat terjadinya Reduksi, dan Anode selalu tempat Oksidasi (KRAO).',
      'Hukum Faraday I: Massa zat yang diendapkan pada elektrode sebanding dengan muatan listrik yang dialirkan (w = e dikali i dikali t dibagi 96.500).'
    ],
    contentParagraphs: [
      'Elektrokimia adalah cabang ilmu yang mempelajari interaksi timbal balik antara energi kimia dan energi listrik. Terdapat dua jenis sel elektrokimia utama dengan fungsi yang berkebalikan: Sel Volta dan Sel Elektrolisis.',
      'Pada Sel Volta atau Sel Galvani, reaksi redoks berlangsung secara spontan dan melepaskan energi bebas yang diubah menjadi arus listrik searah. Baterai alkalin, akumulator aki mobil, dan baterai ion litium pada gawai modern adalah contoh nyata penerapan sel volta.',
      'Sebaliknya, pada Sel Elektrolisis, energi listrik dari sumber daya luar dipaksa masuk ke dalam larutan atau lelehan elektrolit untuk memicu reaksi kimia yang secara alami tidak dapat berlangsung spontan. Proses penyepuhan perhiasan emas dan pemurnian logam aluminium dilakukan menggunakan prinsip elektrolisis.',
      'Kuantitas zat yang dihasilkan selama elektrolisis dihitung secara presisi menggunakan Hukum Michael Faraday. Satu Faraday setara dengan satu mol elektron yang membawa muatan listrik sebesar 96.500 Coulomb.'
    ],
    auditoryNotes: 'Jembatan keledai abadi elektrokimia: KRAO — Katode Reduksi, Anode Oksidasi. Sel Volta katodenya positif, Sel Elektrolisis katodenya negatif!'
  },
  {
    id: 'kimia-sma-bab-17',
    subjectId: 'sma-kimia',
    kelas: 12,
    babNumber: 17,
    handbookFile: 'Handbook_Kimia_SMA_Bab17.html',
    title: 'Bab 17: Kimia Unsur Golongan Utama & Transisi',
    summary: 'Kelimpahan unsur di kerak bumi, sifat fisika dan kimia gas mulia (8A), halogen (7A), logam alkali (1A), logam alkali tanah (2A), unsur-unsur periode ketiga, serta karakteristik unik logam transisi periode keempat (warna senyawa, bilangan oksidasi ganda, dan sifat magnetik).',
    estimatedMinutes: 19,
    createdAt: '2026-09-17',
    keyPoints: [
      'Gas mulia adalah unsur paling stabil di alam dengan konfigurasi elektron valensi penuh duplet atau oktet.',
      'Halogen adalah unsur nonlogam paling reaktif yang sangat mudah membentuk garam dengan menarik 1 elektron.',
      'Logam alkali adalah reduktor sangat kuat yang bereaksi hebat dengan air menghasilkan gas hidrogen dan larutan basa.',
      'Unsur transisi periode 4 memiliki orbital 3d yang belum terisi penuh, menyebabkan senyawanya memiliki warna-warni khas dan bersifat paramagnetik.'
    ],
    contentParagraphs: [
      'Bumi kita menyimpan ragam unsur kimia yang luar biasa. Unsur-unsur dalam sistem periodik dikelompokkan ke dalam keluarga golongan utama dan golongan transisi berdasarkan kemiripan konfigurasi elektron valensinya.',
      'Gas mulia golongan delapan A memiliki konfigurasi elektron yang sangat stabil dan inert sehingga sangat sukar bereaksi. Sebaliknya, halogen golongan tujuh A adalah keluarga nonlogam yang paling agresif bereaksi karena hanya memerlukan tambahan satu elektron lagi untuk menjadi oktet stabil.',
      'Logam alkali golongan satu A dan alkali tanah golongan dua A memiliki energi ionisasi yang sangat rendah sehingga sangat mudah melepaskan elektron. Karena reaktivitasnya yang tinggi terhadap air dan oksigen, logam alkali seperti natrium dan kalium harus disimpan terendam di dalam minyak tanah.',
      'Unsur transisi periode keempat seperti besi, tembaga, nikel, dan kromium memiliki keistimewaan yang mempesona. Adanya subkulit d yang belum terisi penuh memungkinkan terjadinya eksitasi elektron yang memancarkan spektrum cahaya tampak, menghasilkan senyawa dengan aneka warna yang indah serta memiliki sifat katalis dan kemagnetan yang kuat.'
    ],
    auditoryNotes: 'Karakteristik suara: Halogen paling oksidator kuat (F-Cl-Br-I), Alkali paling reduktor kuat (Li-Na-K-Rb-Cs). Unsur transisi senyawanya berwarna!'
  },
  {
    id: 'kimia-sma-bab-18',
    subjectId: 'sma-kimia',
    kelas: 12,
    babNumber: 18,
    handbookFile: 'Handbook_Kimia_SMA_Bab18.html',
    title: 'Bab 18: Senyawa Karbon Turunan Alkana (Gugus Fungsi)',
    summary: 'Struktur, tata nama IUPAC dan trivial, isomer fungsi, sifat fisika-kimia, reaksi identifikasi, dan kegunaan dari alkohol & eter, aldehid & keton, serta asam karboksilat & ester.',
    estimatedMinutes: 20,
    createdAt: '2026-09-18',
    keyPoints: [
      'Gugus fungsi adalah atom atau gugus atom yang menentukan sifat kimia khas suatu senyawa karbon.',
      'Pasangan isomer fungsi: Alkohol berisomer fungsi dengan Eter; Aldehid berisomer fungsi dengan Keton; Asam Karboksilat berisomer fungsi dengan Ester.',
      'Reaksi identifikasi: Aldehid bereaksi positif dengan pereaksi Fehling (endapan merah bata) dan Tollens (cermin perak), sedangkan keton tidak bereaksi.',
      'Ester memiliki aroma buah-buahan yang harum dan digunakan luas sebagai zat perisa sintetik.'
    ],
    contentParagraphs: [
      'Keanekaragaman jutaan senyawa karbon di alam ditentukan oleh adanya gugus fungsi, yaitu gugus atom aktif yang terikat pada rantai karbon dan menjadi pusat reaksi kimia senyawa tersebut.',
      'Alkohol memiliki gugus hidroksil OH dan berisomer fungsional dengan eter yang memiliki gugus oksi O di antara dua rantai karbon. Meskipun memiliki rumus molekul yang sama yaitu CnH2n+2O, alkohol memiliki titik didih yang jauh lebih tinggi daripada eter karena alkohol mampu membentuk ikatan hidrogen antarmolekul.',
      'Aldehid dan keton sama-sama mengandung gugus karbonil C rangkap dua O dengan rumus molekul CnH2nO. Perbedaannya, pada aldehid gugus karbonil terletak di ujung rantai terikat pada atom H, sedangkan pada keton diapit oleh dua atom karbon. Untuk membedakan keduanya di lab, kita menggunakan reagen Tollens yang menghasilkan endapan cermin perak khas pada aldehid.',
      'Asam karboksilat dengan gugus karboksil COOH berisomer fungsi dengan ester yang memiliki gugus karboalkoksi COOR. Reaksi antara asam karboksilat dan alkohol dengan katalis asam sulfat disebut reaksi esterifikasi, yang menghasilkan ester beraroma wangi seperti aroma pisang, apel, dan melati.'
    ],
    auditoryNotes: 'Hafalan pasangan isomer fungsi: Alkohol pasangan Eter, Aldehid pasangan Keton, Asam Karboksilat pasangan Ester. Tollens menghasilkan cermin perak untuk aldehid!'
  },
  {
    id: 'kimia-sma-bab-19',
    subjectId: 'sma-kimia',
    kelas: 12,
    babNumber: 19,
    handbookFile: 'Handbook_Kimia_SMA_Bab19.html',
    title: 'Bab 19: Benzena & Senyawa Turunan Aromatik',
    summary: 'Struktur cincin enam karbon Kekule dan resonansi awan elektron benzena, sifat aroma dan stabilitas cincin benzena, reaksi substitusi elektrofilik (halogenasi, nitrasi, sulfonasi, alkilasi), tata nama senyawa turunan benzena, isomer orto-meta-para, serta kegunaan dan bahaya senyawa aromatik.',
    estimatedMinutes: 17,
    createdAt: '2026-09-19',
    keyPoints: [
      'Benzena memiliki rumus molekul C6H6 dengan struktur cincin heksagonal lingkar terdelokalisasi (resonansi).',
      'Meskipun memiliki tiga ikatan rangkap, benzena sukar mengalami reaksi adisi dan lebih mudah mengalami reaksi substitusi elektrofilik.',
      'Posisi substituen pada cincin benzena: Orto (posisi 1,2), Meta (posisi 1,3), Para (posisi 1,4).',
      'Turunan benzena penting: Toluena (pelarut & bahan peledak TNT), Anilina (zat warna diazo), Fenol (desinfektan), Asam Benzoat (pengawet makanan).'
    ],
    contentParagraphs: [
      'Benzena adalah senyawa hidrokarbon siklik dengan rumus molekul C6H6 yang menjadi induk dari seluruh kelompok senyawa aromatik. Struktur cincin enam karbon lingkar benzena pertama kali diusulkan oleh Friedrich August Kekule.',
      'Keunikan terbesar benzena terletak pada fenomena resonansi elektron. Tiga ikatan rangkap dua dan tiga ikatan tunggalnya tidak berdiam di satu posisi melainkan elektron pi terdelokalisasi merata melingkari seluruh cincin. Hal ini menyebabkan cincin benzena sangat stabil secara termodinamika.',
      'Akibat kestabilan aromatik tersebut, benzena menolak reaksi adisi yang umumnya dialami alkena biasa, melainkan lebih memilih reaksi substitusi elektrofilik di mana atom H pada cincin digantikan oleh gugus lain tanpa merusak kestabilan cincin aromatiknya.',
      'Senyawa turunan benzena banyak dimanfaatkan dalam peradaban modern: Asam benzoat dan natrium benzoat digunakan sebagai pengawet makanan; fenol sebagai antiseptik pembersih; anilina sebagai bahan baku industri pewarna kain; dan asam asetilsalisilat atau aspirin sebagai obat pereda nyeri.'
    ],
    auditoryNotes: 'Urutan posisi suara turunan benzena: Orto berdampingan satu dua; Meta berselang satu tiga; Para berseberangan satu empat.'
  },
  {
    id: 'kimia-sma-bab-20',
    subjectId: 'sma-kimia',
    kelas: 12,
    babNumber: 20,
    handbookFile: 'Handbook_Kimia_SMA_Bab20.html',
    title: 'Bab 20: Polimer, Makromolekul & Biomolekul',
    summary: 'Klasifikasi polimer sintetis dan alami, reaksi polimerisasi adisi dan kondensasi, struktur dan fungsi biomolekul utama: karbohidrat (monosakarida hingga polisakarida), protein dan ikatan peptida, lipid dan trigliserida, serta reaksi uji identifikasi biokimia (Biuret, Ninhidrin, Xanthoproteat, Benedict, Iodin).',
    estimatedMinutes: 20,
    createdAt: '2026-09-20',
    keyPoints: [
      'Polimer adalah makromolekul rantai panjang yang terbentuk dari penggabungan berulang molekul-molekul kecil yang disebut monomer.',
      'Polimerisasi adisi terjadi pada monomer berikatan rangkap tanpa melepas molekul kecil; Polimerisasi kondensasi melepas molekul kecil seperti air.',
      'Protein tersusun atas asam-asam amino yang saling terhubung melalui ikatan peptida.',
      'Uji identifikasi: Uji Biuret menghasilkan warna ungu untuk ikatan peptida protein; Uji Iodin menghasilkan warna biru tua untuk amilum; Uji Benedict menghasilkan endapan merah bata untuk gula pereduksi.'
    ],
    contentParagraphs: [
      'Makromolekul adalah molekul raksasa dengan massa molekul sangat besar yang menyusun bahan-bahan modern seperti plastik dan nilon, sekaligus membangun struktur tubuh makhluk hidup sebagai biomolekul.',
      'Berdasarkan proses pembentukannya, polimerisasi dibagi menjadi dua: Polimerisasi adisi di mana monomer berikatan rangkap saling membuka ikatannya menyambung menjadi rantai panjang seperti pada polietilena kantong plastik; serta Polimerisasi kondensasi di mana penggabungan monomer menghasilkan molekul sampingan sederhana seperti air pada pembentukan nilon dan protein.',
      'Tiga biomolekul utama penunjang kehidupan adalah karbohidrat, protein, dan lipid. Karbohidrat seperti glukosa dan amilum berfungsi sebagai sumber energi primer. Protein yang tersusun dari dua puluh jenis asam amino berperan sebagai pembangun struktur jaringan tubuh dan enzim pengatur metabolisme.',
      'Untuk menguji keberadaan biomolekul di laboratorium, kita menggunakan reagen spesifik: Uji Biuret menghasilkan warna ungu cerah menandakan adanya ikatan peptida; Uji Xanthoproteat menghasilkan warna kuning jingga untuk protein berinti benzena; dan Uji Benedict menghasilkan endapan merah bata jika terdapat gula pereduksi glukosa.'
    ],
    auditoryNotes: 'Kunci audio uji biokimia: Biuret ungu tanda protein berikatan peptida; Iodin biru tua tanda amilum; Benedict merah bata tanda gula glukosa!'
  }
];

// =========================================================================
// BANK SOAL: HANYA KIMIA SMA DARI TOPIK HANDBOOK KIMIA
// Pelajaran lain dikosongkan terlebih dahulu sesuai instruksi.
// =========================================================================

export const DEFAULT_QUESTIONS: Question[] = [
  // --- SOAL KELAS 10 KIMIA ---
  {
    id: 'q-kim-bab1-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-1',
    kelas: 10,
    questionText: 'Sebuah isotop klorin memiliki nomor atom 17 dan nomor massa 35. Berapakah jumlah proton, elektron, dan neutron yang terdapat pada ion klorida (Cl minus) dari isotop tersebut?',
    options: [
      { id: 'a', text: '17 proton, 18 elektron, dan 18 neutron' },
      { id: 'b', text: '17 proton, 17 elektron, dan 18 neutron' },
      { id: 'c', text: '18 proton, 17 elektron, dan 18 neutron' },
      { id: 'd', text: '17 proton, 16 elektron, dan 35 neutron' }
    ],
    correctOptionId: 'a',
    explanation: 'Nomor atom = 17, berarti proton = 17. Karena merupakan ion negatif satu (Cl-), ion tersebut menerima 1 elektron tambahan sehingga jumlah elektron = 17 + 1 = 18 elektron. Jumlah neutron = nomor massa dikurangi nomor atom = 35 - 17 = 18 neutron.',
    audioTip: 'Ion negatif berarti ada tambahan elektron. Kurangi 35 dengan 17 untuk mendapatkan jumlah neutron.'
  },
  {
    id: 'q-kim-bab2-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-2',
    kelas: 10,
    questionText: 'Molekul metana (CH4) memiliki 4 pasangan elektron ikatan (PEI) dan 0 pasangan elektron bebas (PEB) pada atom pusat karbonnya. Bagaimanakah bentuk geometri molekul metana menurut teori VSEPR?',
    options: [
      { id: 'a', text: 'Linear' },
      { id: 'b', text: 'Tetrahedral' },
      { id: 'c', text: 'Segitiga planar' },
      { id: 'd', text: 'Oktahedral' }
    ],
    correctOptionId: 'b',
    explanation: 'Atom pusat dengan tipe molekul AX4 (4 PEI dan 0 PEB) memiliki gaya tolak menolak yang simetris menghasilkan bentuk ruang Tetrahedral dengan sudut ikatan sebesar 109,5 derajat.',
    audioTip: 'Empat ikatan simetris tanpa pasangan bebas membentuk tetrahedral.'
  },
  {
    id: 'q-kim-bab5-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-5',
    kelas: 10,
    questionText: 'Berapakah massa dari 0,5 mol gas karbon dioksida (CO2) jika diketahui Ar Karbon = 12 dan Ar Oksigen = 16?',
    options: [
      { id: 'a', text: '22 gram' },
      { id: 'b', text: '44 gram' },
      { id: 'c', text: '28 gram' },
      { id: 'd', text: '88 gram' }
    ],
    correctOptionId: 'a',
    explanation: 'Mr CO2 = 12 + (2 dikali 16) = 44 gram per mol. Massa = mol dikali Mr = 0,5 mol dikali 44 gram per mol = 22 gram.',
    audioTip: 'Hitung Mr CO2 terlebih dahulu yaitu 44, lalu kalikan dengan 0,5.'
  },

  // --- SOAL KELAS 11 KIMIA ---
  {
    id: 'q-kim-bab7-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-7',
    kelas: 11,
    questionText: 'Jika suatu reaksi kimia melepaskan kalor ke lingkungan sebesar 250 kiloJoule, bagaimanakah tanda delta H reaksi dan apakah jenis reaksi tersebut?',
    options: [
      { id: 'a', text: 'Delta H = -250 kJ, reaksi eksoterm' },
      { id: 'b', text: 'Delta H = +250 kJ, reaksi eksoterm' },
      { id: 'c', text: 'Delta H = +250 kJ, reaksi endoterm' },
      { id: 'd', text: 'Delta H = -250 kJ, reaksi endoterm' }
    ],
    correctOptionId: 'a',
    explanation: 'Reaksi yang melepaskan kalor dari sistem ke lingkungan dinamakan reaksi eksoterm dan memiliki perubahan entalpi delta H bertanda negatif (-250 kJ).',
    audioTip: 'Melepaskan kalor artinya eksoterm dan bertanda minus.'
  },
  {
    id: 'q-kim-bab10-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-10',
    kelas: 11,
    questionText: 'Berapakah nilai pH dari larutan asam kuat asam klorida (HCl) yang memiliki konsentrasi ion H+ sebesar 0,001 Molar (10 pangkat minus 3)?',
    options: [
      { id: 'a', text: 'pH = 1' },
      { id: 'b', text: 'pH = 3' },
      { id: 'c', text: 'pH = 11' },
      { id: 'd', text: 'pH = 7' }
    ],
    correctOptionId: 'b',
    explanation: 'pH dirumuskan sebagai minus logaritma konsentrasi H+. Konsentrasi 0,001 M = 10 pangkat minus 3 M, sehingga pH = -log(10^-3) = 3.',
    audioTip: 'Minus log dari 10 pangkat minus 3 adalah 3.'
  },
  {
    id: 'q-kim-bab11-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-11',
    kelas: 11,
    questionText: 'Pasangan larutan berikut yang dapat membentuk larutan penyangga (buffer) yang bersifat asam adalah ...',
    options: [
      { id: 'a', text: 'Asam asetat (CH3COOH) dan Natrium asetat (CH3COONa)' },
      { id: 'b', text: 'Asam klorida (HCl) dan Natrium klorida (NaCl)' },
      { id: 'c', text: 'Natrium hidroksida (NaOH) dan Kalium hidroksida (KOH)' },
      { id: 'd', text: 'Asam sulfat (H2SO4) dan Natrium sulfat (Na2SO4)' }
    ],
    correctOptionId: 'a',
    explanation: 'Larutan buffer asam terdiri dari campuran asam lemah (CH3COOH) dan basa konjugasinya (ion CH3COO- dari garam CH3COONa). Asam kuat seperti HCl tidak dapat membentuk buffer.',
    audioTip: 'Penyangga asam memerlukan asam lemah bersama garamnya.'
  },

  // --- SOAL KELAS 12 KIMIA ---
  {
    id: 'q-kim-bab14-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-14',
    kelas: 12,
    questionText: 'Mengapa penambahan garam dapur ke dalam air murni menyebabkan kenaikan titik didih larutan (delta Tb)?',
    options: [
      { id: 'a', text: 'Karena partikel garam menghalangi molekul air untuk menguap sehingga tekanan uap turun' },
      { id: 'b', text: 'Karena garam mempercepat penguapan air di permukaan' },
      { id: 'c', text: 'Karena garam bereaksi secara kimia membentuk zat baru yang mudah terbakar' },
      { id: 'd', text: 'Karena air bereaksi melepaskan panas dingin secara spontan' }
    ],
    correctOptionId: 'a',
    explanation: 'Zat terlarut nonvolatil seperti garam menghalangi molekul pelarut air untuk melepaskan diri menjadi fase uap di permukaan. Akibatnya tekanan uap jenuh turun dan dibutuhkan suhu yang lebih tinggi agar tekanan uap sama dengan tekanan udara luar.',
    audioTip: 'Partikel terlarut menghalangi penguapan pelarut di permukaan larutan.'
  },
  {
    id: 'q-kim-bab16-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-16',
    kelas: 12,
    questionText: 'Pada sel elektrokimia (baik Sel Volta maupun Sel Elektrolisis), pada elektrode manakah reaksi reduksi selalu berlangsung?',
    options: [
      { id: 'a', text: 'Katode' },
      { id: 'b', text: 'Anode' },
      { id: 'c', text: 'Jembatan garam' },
      { id: 'd', text: 'Voltmeter' }
    ],
    correctOptionId: 'a',
    explanation: 'Berdasarkan konvensi IUPAC, Katode selalu merupakan elektrode tempat berlangsungnya reaksi Reduksi, sedangkan Anode tempat terjadinya Oksidasi (ingat singkatan KRAO).',
    audioTip: 'KRAO: Katode Reduksi, Anode Oksidasi.'
  },
  {
    id: 'q-kim-bab18-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-18',
    kelas: 12,
    questionText: 'Suatu senyawa karbon dengan rumus molekul C3H6O diuji dengan pereaksi Tollens dan menghasilkan cermin perak di dinding tabung reaksi. Senyawa karbon apakah tersebut?',
    options: [
      { id: 'a', text: 'Propanal (suatu aldehid)' },
      { id: 'b', text: 'Propanon (suatu keton)' },
      { id: 'c', text: 'Propanol (suatu alkohol)' },
      { id: 'd', text: 'Asam propanoat' }
    ],
    correctOptionId: 'a',
    explanation: 'Pereaksi Tollens menghasilkan uji cermin perak positif secara spesifik pada golongan Aldehid (propanal) karena aldehid mudah dioksidasi. Keton (propanon) tidak dapat dioksidasi oleh pereaksi Tollens.',
    audioTip: 'Uji cermin perak Tollens adalah ciri khas gugus fungsi aldehid.'
  },
  {
    id: 'q-kim-bab20-1',
    subjectId: 'sma-kimia',
    materiId: 'kimia-sma-bab-20',
    kelas: 12,
    questionText: 'Ketika larutan sampel putih telur ditetesi pereaksi Biuret, terbentuk warna ungu pekat yang indah. Hal ini membuktikan bahwa putih telur mengandung ...',
    options: [
      { id: 'a', text: 'Ikatan peptida pada protein' },
      { id: 'b', text: 'Gula pereduksi glukosa' },
      { id: 'c', text: 'Amilum pati' },
      { id: 'd', text: 'Asam lemak jenuh' }
    ],
    correctOptionId: 'a',
    explanation: 'Uji Biuret menggunakan ion tembaga (II) dalam suasana basa bereaksi positif dengan ikatan peptida (ikatan antar asam amino) membentuk kompleks koordinasi berwarna ungu.',
    audioTip: 'Biuret warna ungu adalah tanda adanya ikatan peptida protein.'
  }
];
