import React, { useState } from 'react';
import { StudentProfile, StudentGoals, StudentPreferences } from '../../types/intelligence';
import { AuthService } from '../../services/authService';
import { IntelligenceService } from '../../services/intelligenceService';
import { DiagnosticPlayer } from './DiagnosticPlayer';

interface OnboardingWizardProps {
  currentProfile: StudentProfile;
  onFinishOnboarding: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentProfile,
  onFinishOnboarding
}) => {
  const [step, setStep] = useState<number>(currentProfile.currentOnboardingStep || 1);

  // Form State: Step 1 (Profile)
  const [profileData, setProfileData] = useState<StudentProfile>({ ...currentProfile });

  // Form State: Step 2 (Goals)
  const [goalsData, setGoalsData] = useState<StudentGoals>(() =>
    IntelligenceService.getGoals(currentProfile.studentId)
  );

  // Form State: Step 3 & 4 (Preferences)
  const [prefData, setPrefData] = useState<StudentPreferences>(() =>
    IntelligenceService.getPreferences(currentProfile.studentId)
  );

  // Save changes incrementally
  const saveProgress = (nextStep: number) => {
    // Update step in profile
    const updated = { ...profileData, currentOnboardingStep: nextStep };
    setProfileData(updated);
    AuthService.saveStudentProfile(updated);
    IntelligenceService.saveGoals(goalsData);
    IntelligenceService.savePreferences(prefData);
  };

  const handleNextStep = () => {
    const next = Math.min(5, step + 1);
    saveProgress(next);
    setStep(next);
  };

  const handlePrevStep = () => {
    const prev = Math.max(1, step - 1);
    saveProgress(prev);
    setStep(prev);
  };

  const handleDiagnosticFinished = (baselineScore: number) => {
    const updated = {
      ...profileData,
      onboardingCompleted: true,
      diagnosticCompleted: true,
      currentOnboardingStep: 5
    };
    AuthService.saveStudentProfile(updated);
    onFinishOnboarding();
  };

  const stepsList = [
    { num: 1, label: 'Profil Akademik' },
    { num: 2, label: 'Target Belajar' },
    { num: 3, label: 'Self-Assessment' },
    { num: 4, label: 'Gaya Belajar' },
    { num: 5, label: 'Asesmen Awal' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 md:p-8 mb-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100 mb-3 border border-white/10">
            <span>✨ Kenali Kondisi Belajarmu</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Selamat Datang di Sqolah, {profileData.nickname || profileData.fullName}!
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            Untuk menyajikan peta penguasaan materi (Mastery Map) dan rekomendasi belajar harian yang akurat, mohon lengkapi profil belajar awal kamu di bawah ini.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stepper Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 -z-0"
            style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
          />

          {stepsList.map(s => {
            const isPassed = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                    isPassed
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-white border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-100'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isPassed ? '✓' : s.num}
                </div>
                <span
                  className={`text-xs mt-2 font-medium hidden sm:block ${
                    isCurrent ? 'text-blue-600 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {/* ================= STEP 1: PROFIL AKADEMIK ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Langkah 1: Profil Akademik & Penugasan</h2>
              <p className="text-sm text-slate-600">
                Informasi dasar dan program bimbingan belajar yang terdaftar pada sistem Sqolah.
              </p>
            </div>

            {/* Admin-assigned locked fields */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                <span>🔒 Ditetapkan oleh Super Admin Sqolah</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nomor Induk Siswa (Student ID)</label>
                  <div className="bg-slate-200/70 text-slate-700 font-mono font-medium px-3 py-2 rounded-lg border border-slate-300">
                    {profileData.studentId}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Program Belajar</label>
                  <div className="bg-slate-200/70 text-slate-700 font-medium px-3 py-2 rounded-lg border border-slate-300">
                    {profileData.program}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Kurikulum</label>
                  <div className="bg-slate-200/70 text-slate-700 font-medium px-3 py-2 rounded-lg border border-slate-300">
                    {profileData.curriculum} ({profileData.academicYear})
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Jenjang & Tingkat Kelas</label>
                  <div className="bg-slate-200/70 text-slate-700 font-medium px-3 py-2 rounded-lg border border-slate-300">
                    {profileData.level} - Kelas {profileData.grade}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Mata Pelajaran Aktif</label>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      🧪 Kimia SMA (20 Bab Lengkap)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable student identity fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Panggilan</label>
                <input
                  type="text"
                  value={profileData.nickname}
                  onChange={e => setProfileData({ ...profileData, nickname: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Asal Sekolah</label>
                <input
                  type="text"
                  value={profileData.school}
                  onChange={e => setProfileData({ ...profileData, school: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">No. WhatsApp Siswa</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Orang Tua / Wali (Opsional)</label>
                <input
                  type="text"
                  value={profileData.parentName || ''}
                  onChange={e => setProfileData({ ...profileData, parentName: e.target.value })}
                  placeholder="Contoh: Hendra Santoso"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">No. Kontak Orang Tua (Opsional)</label>
                <input
                  type="text"
                  value={profileData.parentPhone || ''}
                  onChange={e => setProfileData({ ...profileData, parentPhone: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: TARGET BELAJAR ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Langkah 2: Target & Tujuan Belajar</h2>
              <p className="text-sm text-slate-600">
                Tentukan target yang ingin dicapai agar Sqolah dapat mengkalibrasi laju belajar kamu.
              </p>
            </div>

            {/* Target Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Tujuan Utama Belajar (Pilih yang relevan)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Persiapan UTBK / SNBT Masuk PTN',
                  'Meningkatkan Nilai Ujian & Rapor Sekolah',
                  'Persiapan Seleksi Mandiri & Kedokteran',
                  'Persiapan Olimpiade Sains Nasional (OSN)',
                  'Memperbaiki Pemahaman Konsep Dasar yang Tertinggal'
                ].map((item, idx) => {
                  const isChecked = goalsData.primaryGoals.includes(item);
                  return (
                    <label
                      key={idx}
                      className={`flex items-start space-x-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${
                        isChecked ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          let updatedList = [...goalsData.primaryGoals];
                          if (isChecked) updatedList = updatedList.filter(g => g !== item);
                          else updatedList.push(item);
                          setGoalsData({ ...goalsData, primaryGoals: updatedList });
                        }}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 font-medium leading-snug">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Target Grade for Chemistry */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Target Nilai Mata Pelajaran Kimia SMA</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Nilai Rata-rata Sekolah Saat Ini (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={goalsData.targetGrades['sma-kimia-10']?.currentGrade || 70}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setGoalsData({
                        ...goalsData,
                        targetGrades: {
                          ...goalsData.targetGrades,
                          'sma-kimia-10': {
                            currentGrade: val,
                            targetGrade: goalsData.targetGrades['sma-kimia-10']?.targetGrade || 85
                          }
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Target Nilai yang Diharapkan (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={goalsData.targetGrades['sma-kimia-10']?.targetGrade || 90}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setGoalsData({
                        ...goalsData,
                        targetGrades: {
                          ...goalsData.targetGrades,
                          'sma-kimia-10': {
                            currentGrade: goalsData.targetGrades['sma-kimia-10']?.currentGrade || 70,
                            targetGrade: val
                          }
                        }
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Target Campus */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Kampus / Jurusan Impian (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Institut Teknologi Bandung - Teknik Kimia"
                value={goalsData.targetCampusOrSchool || ''}
                onChange={e => setGoalsData({ ...goalsData, targetCampusOrSchool: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
              />
            </div>
          </div>
        )}

        {/* ================= STEP 3: SELF-ASSESSMENT AWAL ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Langkah 3: Self-Assessment Awal</h2>
              <p className="text-sm text-slate-600">
                Ungkapkan penilaian mandiri terhadap materi Kimia SMA sejauh pengalaman belajarmu.
              </p>
            </div>

            {/* Likert Scale */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Secara umum, seberapa yakin kamu dengan pemahaman konsep kimia saat ini?
              </label>
              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  { val: 1, label: 'Sangat Kurang' },
                  { val: 2, label: 'Kurang Paham' },
                  { val: 3, label: 'Cukup' },
                  { val: 4, label: 'Paham Baik' },
                  { val: 5, label: 'Sangat Mahir' }
                ].map(item => {
                  const isSelected = prefData.selfAssessmentUnderstanding['sma-kimia-10'] === item.val;
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => {
                        setPrefData({
                          ...prefData,
                          selfAssessmentUnderstanding: {
                            ...prefData.selfAssessmentUnderstanding,
                            'sma-kimia-10': item.val
                          }
                        });
                      }}
                      className={`p-3 rounded-xl border-2 transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="text-lg font-bold">{item.val}</div>
                      <div className="text-[11px] leading-tight mt-1">{item.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Easiest vs Hardest Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bab / Konsep yang Paling Kamu Kuasai
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Struktur Atom, Notasi Unsur"
                  value={prefData.easiestSubjectId || ''}
                  onChange={e => setPrefData({ ...prefData, easiestSubjectId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bab / Konsep yang Paling Menantang & Bikin Bingung
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Stoikiometri, Ikatan Kimia & Geometri Molekul"
                  value={prefData.hardestSubjectId || ''}
                  onChange={e => setPrefData({ ...prefData, hardestSubjectId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Catatan Hambatan Belajar Khusus (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Sering keliru saat menghitung pereaksi pembatas pada stoikiometri..."
                value={prefData.challengingTopics || ''}
                onChange={e => setPrefData({ ...prefData, challengingTopics: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
              />
            </div>
          </div>
        )}

        {/* ================= STEP 4: GAYA BELAJAR & PREFERENSI ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Langkah 4: Gaya Belajar & Preferensi</h2>
              <p className="text-sm text-slate-600">
                Sesuaikan fitur auditori dan jadwal terbaik agar belajar terasa lebih menyenangkan.
              </p>
            </div>

            {/* Preferred Study Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Waktu Belajar Paling Efektif</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'pagi', label: 'Pagi Hari', time: '06.00 - 09.00', icon: '🌅' },
                  { id: 'siang', label: 'Siang Hari', time: '12.00 - 15.00', icon: '☀️' },
                  { id: 'sore', label: 'Sore Hari', time: '16.00 - 18.00', icon: '🌇' },
                  { id: 'malam', label: 'Malam Hari', time: '19.00 - 22.00', icon: '🌙' }
                ].map(t => {
                  const isSelected = prefData.studyTimePreference === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPrefData({ ...prefData, studyTimePreference: t.id as any })}
                      className={`p-3 rounded-xl border-2 text-left transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{t.icon}</div>
                      <div className="text-sm font-bold text-slate-800">{t.label}</div>
                      <div className="text-xs text-slate-500">{t.time}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Learning Style Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Gaya Belajar Utama</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'auditory',
                    title: 'Auditori (Mendengarkan Narasi Suara)',
                    desc: 'Lebih mudah paham materi melalui suara narator, penjelasan audio, dan efek suara.',
                    badge: 'Rekomendasi Sqolah 🎧'
                  },
                  {
                    id: 'reading_writing',
                    title: 'Membaca Rangkuman & Teks',
                    desc: 'Fokus membaca buku ringkasan materi, tabel berkala, dan rumus tertulis.',
                    badge: 'Klasik 📖'
                  },
                  {
                    id: 'practice',
                    title: 'Banyak Latihan Soal Langsung',
                    desc: 'Langsung menguji kemampuan lewat kuis interaktif dan pembahasan soal.',
                    badge: 'Aplikatif ✍️'
                  },
                  {
                    id: 'visual',
                    title: 'Visual & Diagram Interaktif',
                    desc: 'Menghafal konfigurasi elektron dan bentuk molekul melalui visual 2D/3D.',
                    badge: 'Visual 👁️'
                  }
                ].map(s => {
                  const isSelected = prefData.learningStylePreference === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPrefData({ ...prefData, learningStylePreference: s.id as any })}
                      className={`p-4 rounded-xl border-2 text-left transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-800">{s.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          {s.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auditory Accessibility Prompt */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
              <span className="text-2xl mt-0.5">🎧</span>
              <div>
                <h4 className="text-sm font-bold text-amber-900 mb-0.5">Fitur Pendukung Siswa Auditori Aktif</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Sqolah telah menyediakan tombol dengar suara (Text-to-Speech bahasa Indonesia), efek audio jawaban, dan pembacaan soal otomatis untuk membantu siswa auditori atau berkebutuhan khusus.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 5: ASESMEN DIAGNOSTIK AWAL ================= */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Langkah 5: Asesmen Diagnostik Awal Adaptif</h2>
              <p className="text-sm text-slate-600">
                12 Soal singkat untuk memetakan level penguasaan konsep awalmu sebelum memulai materi.
              </p>
            </div>

            <DiagnosticPlayer
              studentId={profileData.studentId}
              onFinished={handleDiagnosticFinished}
            />
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        {step < 5 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                step === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ← Kembali
            </button>

            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
            >
              Lanjutkan ke Langkah {step + 1} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
