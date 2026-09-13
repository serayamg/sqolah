# Sqolah 🎓

**Sqolah** adalah platform pembelajaran edukatif interaktif dan inklusif berbasis web yang dirancang untuk mendukung peserta didik dari berbagai jenjang (SD, SMP, dan SMA) dengan penekanan khusus pada aksesibilitas (*dyslexia-friendly*, kontras tinggi, dan asistensi auditori).

---

## 🚀 Fitur Unggulan

- **♿ Aksesibilitas & Inklusivitas**:
  - **Mode Disleksia**: Opsi tampilan jenis huruf khusus (*dyslexic font*) untuk kenyamanan membaca peserta didik dengan disleksia.
  - **Kontras Tinggi (*High Contrast*)**: Memudahkan keterbacaan teks dan antarmuka.
  - **Dukungan Auditori**: *Audio engine* bawaan dengan efek suara interaktif dan panduan audio untuk materi serta kuis.
- **📚 Materi Kurikulum Terstruktur**:
  - Pilihan jenjang pendidikan: **SD**, **SMP**, dan **SMA**.
  - Pilihan kelas (contoh: SMA Kelas 10, 11, dan 12).
  - Dilengkapi modul **Handbook Kimia SMA (Bab 1 - 20)** beserta indeks lengkap yang siap diakses langsung.
- **🎯 Kuis Interaktif**:
  - Pemain kuis interaktif dengan timer, skor langsung, feedback seketika, dan perayaan (*confetti*).
  - Evaluasi pemahaman langsung per materi atau per mata pelajaran.
- **🛠️ Admin Panel**:
  - Antarmuka manajemen untuk menambah, memperbarui, dan mengelola materi serta bank soal.
  - Penyimpanan data lokal (*local storage*) yang persisten dan cepat.

---

## 📁 Struktur Direktori

```text
sqolah/
├── dist/                          # Artefak hasil build produksi (siap dideploy)
│   ├── assets/                    # File bundel JS, CSS, dan aset terkompilasi
│   ├── Handbook_Kimia_SMA_*.html  # Modul handbook interaktif
│   └── index.html                 # Entry point halaman web
├── public/                        # Aset publik statis
├── src/
│   ├── components/                # Komponen React (Header, Quiz, Admin, dll.)
│   ├── data/                      # Data kurikulum dan materi bawaan
│   ├── services/                  # Audio engine dan storage service
│   ├── types/                     # Definisi TypeScript
│   ├── App.tsx                    # Komponen utama aplikasi
│   └── main.tsx                   # Entry point aplikasi
├── package.json                   # Dependensi dan skrip proyek
├── tailwind.config.js             # Konfigurasi Tailwind CSS
├── tsconfig.json                  # Konfigurasi TypeScript
└── vite.config.ts                 # Konfigurasi Vite
```

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 💻 Panduan Instalasi & Menjalankan

### 1. Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi LTS direkomendasikan).

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di alamat yang tertera (biasanya `http://localhost:5173`).

### 4. Melakukan Build untuk Produksi
```bash
npm run build
```
File artefak produksi akan dihasilkan di dalam direktori `dist/`.

### 5. Pratinjau Build Produksi
```bash
npm run preview
```

---

## 📦 Artefak Produksi (`dist/`)
Folder `dist/` berisi seluruh bundel teroptimasi dan modul handbook yang siap di-host langsung ke layanan web hosting seperti GitHub Pages, Vercel, Netlify, atau web server statis lainnya.

---

## 📄 Lisensi & Hak Cipta
Repository: [https://github.com/serayamg/sqolah](https://github.com/serayamg/sqolah)
