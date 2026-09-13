import React, { useState } from 'react';
import { 
  Subject, 
  Materi, 
  Question, 
  EducationLevel 
} from '../types';
import { StorageService } from '../services/storageService';
import { audioEngine } from '../services/audioEngine';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Sparkles,
  Volume2,
  FolderPlus,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  subjects: Subject[];
  materiList: Materi[];
  questions: Question[];
  onDataChanged: () => void;
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  subjects,
  materiList,
  questions,
  onDataChanged,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'materi' | 'questions' | 'backup'>('materi');

  // Form Modals / Forms state
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isAddingSubject, setIsAddingSubject] = useState<boolean>(false);

  const [editingMateri, setEditingMateri] = useState<Materi | null>(null);
  const [isAddingMateri, setIsAddingMateri] = useState<boolean>(false);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    audioEngine.playSound('notification');
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // ---------------------------------------------------------
  // Subject Form Logic
  // ---------------------------------------------------------
  const [subFormLevel, setSubFormLevel] = useState<EducationLevel>('SD');
  const [subFormName, setSubFormName] = useState('');
  const [subFormDesc, setSubFormDesc] = useState('');
  const [subFormKelas, setSubFormKelas] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  const openNewSubject = () => {
    setEditingSubject(null);
    setSubFormLevel('SD');
    setSubFormName('');
    setSubFormDesc('');
    setSubFormKelas([1, 2, 3, 4, 5, 6]);
    setIsAddingSubject(true);
  };

  const openEditSubject = (s: Subject) => {
    setEditingSubject(s);
    setSubFormLevel(s.level);
    setSubFormName(s.name);
    setSubFormDesc(s.description);
    setSubFormKelas(s.kelas);
    setIsAddingSubject(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subFormName.trim()) return;

    if (editingSubject) {
      const updated: Subject = {
        ...editingSubject,
        name: subFormName,
        level: subFormLevel,
        description: subFormDesc,
        kelas: subFormKelas.length > 0 ? subFormKelas : [1]
      };
      StorageService.updateSubject(updated);
      showNotification(`Mata pelajaran ${updated.name} berhasil diperbarui.`);
    } else {
      const newSub: Subject = {
        id: `subj-${Date.now()}`,
        name: subFormName,
        level: subFormLevel,
        description: subFormDesc,
        kelas: subFormKelas.length > 0 ? subFormKelas : [1],
        icon: 'BookOpen',
        color: subFormLevel === 'SD' ? 'from-amber-500 to-orange-500' : subFormLevel === 'SMP' ? 'from-blue-500 to-indigo-600' : 'from-indigo-600 to-purple-700'
      };
      StorageService.addSubject(newSub);
      showNotification(`Mata pelajaran baru ${newSub.name} berhasil ditambahkan!`);
    }

    setIsAddingSubject(false);
    onDataChanged();
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (window.confirm(`Hapus mata pelajaran "${name}" beserta materi dan soal terkait?`)) {
      StorageService.deleteSubject(id);
      showNotification(`Mata pelajaran ${name} telah dihapus.`);
      onDataChanged();
    }
  };

  // ---------------------------------------------------------
  // Materi Form Logic
  // ---------------------------------------------------------
  const [matFormSubjectId, setMatFormSubjectId] = useState(subjects[0]?.id || '');
  const [matFormKelas, setMatFormKelas] = useState<number>(4);
  const [matFormTitle, setMatFormTitle] = useState('');
  const [matFormSummary, setMatFormSummary] = useState('');
  const [matFormParagraphs, setMatFormParagraphs] = useState('');
  const [matFormKeyPoints, setMatFormKeyPoints] = useState('');
  const [matFormAuditoryNotes, setMatFormAuditoryNotes] = useState('');
  const [matFormEstMinutes, setMatFormEstMinutes] = useState<number>(10);

  const openNewMateri = () => {
    setEditingMateri(null);
    setMatFormSubjectId(subjects[0]?.id || '');
    setMatFormKelas(4);
    setMatFormTitle('');
    setMatFormSummary('');
    setMatFormParagraphs('');
    setMatFormKeyPoints('');
    setMatFormAuditoryNotes('');
    setMatFormEstMinutes(10);
    setIsAddingMateri(true);
  };

  const openEditMateri = (m: Materi) => {
    setEditingMateri(m);
    setMatFormSubjectId(m.subjectId);
    setMatFormKelas(m.kelas);
    setMatFormTitle(m.title);
    setMatFormSummary(m.summary);
    setMatFormParagraphs(m.contentParagraphs.join('\n\n'));
    setMatFormKeyPoints(m.keyPoints.join('\n'));
    setMatFormAuditoryNotes(m.auditoryNotes || '');
    setMatFormEstMinutes(m.estimatedMinutes);
    setIsAddingMateri(true);
  };

  const handleSaveMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matFormTitle.trim()) return;

    const paragraphs = matFormParagraphs
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const keyPoints = matFormKeyPoints
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (editingMateri) {
      const updated: Materi = {
        ...editingMateri,
        subjectId: matFormSubjectId,
        kelas: Number(matFormKelas),
        title: matFormTitle,
        summary: matFormSummary,
        contentParagraphs: paragraphs.length > 0 ? paragraphs : [matFormSummary],
        keyPoints: keyPoints,
        auditoryNotes: matFormAuditoryNotes,
        estimatedMinutes: Number(matFormEstMinutes)
      };
      StorageService.updateMateri(updated);
      showNotification(`Materi "${updated.title}" berhasil diperbarui.`);
    } else {
      const newMat: Materi = {
        id: `mat-${Date.now()}`,
        subjectId: matFormSubjectId,
        kelas: Number(matFormKelas),
        title: matFormTitle,
        summary: matFormSummary,
        contentParagraphs: paragraphs.length > 0 ? paragraphs : [matFormSummary],
        keyPoints: keyPoints,
        auditoryNotes: matFormAuditoryNotes,
        estimatedMinutes: Number(matFormEstMinutes),
        createdAt: new Date().toISOString().split('T')[0]
      };
      StorageService.addMateri(newMat);
      showNotification(`Materi baru "${newMat.title}" berhasil ditambahkan!`);
    }

    setIsAddingMateri(false);
    onDataChanged();
  };

  const handleDeleteMateri = (id: string, title: string) => {
    if (window.confirm(`Hapus materi "${title}"?`)) {
      StorageService.deleteMateri(id);
      showNotification(`Materi ${title} telah dihapus.`);
      onDataChanged();
    }
  };

  // ---------------------------------------------------------
  // Question Form Logic
  // ---------------------------------------------------------
  const [qFormSubjectId, setQFormSubjectId] = useState(subjects[0]?.id || '');
  const [qFormKelas, setQFormKelas] = useState<number>(4);
  const [qFormMateriId, setQFormMateriId] = useState('');
  const [qFormText, setQFormText] = useState('');
  const [qFormOptA, setQFormOptA] = useState('');
  const [qFormOptB, setQFormOptB] = useState('');
  const [qFormOptC, setQFormOptC] = useState('');
  const [qFormOptD, setQFormOptD] = useState('');
  const [qFormCorrect, setQFormCorrect] = useState('a');
  const [qFormExplanation, setQFormExplanation] = useState('');

  const openNewQuestion = () => {
    setEditingQuestion(null);
    setQFormSubjectId(subjects[0]?.id || '');
    setQFormKelas(4);
    setQFormMateriId('');
    setQFormText('');
    setQFormOptA('');
    setQFormOptB('');
    setQFormOptC('');
    setQFormOptD('');
    setQFormCorrect('a');
    setQFormExplanation('');
    setIsAddingQuestion(true);
  };

  const openEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQFormSubjectId(q.subjectId);
    setQFormKelas(q.kelas);
    setQFormMateriId(q.materiId || '');
    setQFormText(q.questionText);
    setQFormOptA(q.options[0]?.text || '');
    setQFormOptB(q.options[1]?.text || '');
    setQFormOptC(q.options[2]?.text || '');
    setQFormOptD(q.options[3]?.text || '');
    setQFormCorrect(q.correctOptionId);
    setQFormExplanation(q.explanation);
    setIsAddingQuestion(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qFormText.trim()) return;

    const options = [
      { id: 'a', text: qFormOptA.trim() },
      { id: 'b', text: qFormOptB.trim() },
      { id: 'c', text: qFormOptC.trim() },
      { id: 'd', text: qFormOptD.trim() }
    ];

    if (editingQuestion) {
      const updated: Question = {
        ...editingQuestion,
        subjectId: qFormSubjectId,
        kelas: Number(qFormKelas),
        materiId: qFormMateriId || undefined,
        questionText: qFormText,
        options,
        correctOptionId: qFormCorrect,
        explanation: qFormExplanation
      };
      StorageService.updateQuestion(updated);
      showNotification('Soal latihan berhasil diperbarui.');
    } else {
      const newQ: Question = {
        id: `q-${Date.now()}`,
        subjectId: qFormSubjectId,
        kelas: Number(qFormKelas),
        materiId: qFormMateriId || undefined,
        questionText: qFormText,
        options,
        correctOptionId: qFormCorrect,
        explanation: qFormExplanation
      };
      StorageService.addQuestion(newQ);
      showNotification('Soal latihan baru berhasil ditambahkan!');
    }

    setIsAddingQuestion(false);
    onDataChanged();
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Hapus soal latihan ini?')) {
      StorageService.deleteQuestion(id);
      showNotification('Soal latihan telah dihapus.');
      onDataChanged();
    }
  };

  // ---------------------------------------------------------
  // Backup & Restore
  // ---------------------------------------------------------
  const handleExportJSON = () => {
    const json = StorageService.exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sqolah_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showNotification('Backup data Sqolah berhasil diunduh.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (StorageService.importDataJSON(content)) {
        showNotification('Data berhasil diimpor!');
        onDataChanged();
      } else {
        alert('Format file JSON tidak valid!');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefault = () => {
    if (window.confirm('Reset semua data ke data kurikulum bawaan SD, SMP, SMA? Semua perubahan Anda akan digantikan.')) {
      StorageService.resetToDefault();
      showNotification('Data berhasil direset ke bawaan.');
      onDataChanged();
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
            Panel Administrator
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Manajemen Konten Sqolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-700">
            Kelola tingkatan SD, SMP, SMA, kelas, mata pelajaran, materi edukasi, dan bank soal latihan.
          </p>
        </div>

        <button
          onClick={onExitAdmin}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs sm:text-sm self-start sm:self-auto"
        >
          Kembali ke Tampilan Siswa
        </button>
      </div>

      {/* Notification Banner */}
      {feedbackMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-sm font-semibold animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('materi')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'materi'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kelola Materi ({materiList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'questions'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Kelola Soal Latihan ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'subjects'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Mata Pelajaran ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'backup'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Backup & Reset Data</span>
        </button>
      </div>

      {/* -------------------------------------------------------------
          TAB 1: MATERI
      ------------------------------------------------------------- */}
      {activeTab === 'materi' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daftar Materi Pembelajaran</h2>
              <p className="text-xs text-slate-700">Materi dengan dukungan narasi suara dan penanda audio</p>
            </div>
            <button
              onClick={openNewMateri}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-500 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Materi Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...materiList].sort((a, b) => {
              if (a.kelas !== b.kelas) return a.kelas - b.kelas;
              const babA = a.babNumber ?? (parseInt(a.title.match(/bab\s*(\d+)/i)?.[1] || '999', 10));
              const babB = b.babNumber ?? (parseInt(b.title.match(/bab\s*(\d+)/i)?.[1] || '999', 10));
              return babA - babB;
            }).map((mat) => {
              const subj = subjects.find(s => s.id === mat.subjectId);
              const qCount = questions.filter(q => q.materiId === mat.id).length;

              return (
                <div key={mat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                        {subj?.name || mat.subjectId} — Kelas {mat.kelas}
                      </span>
                      <span className="text-[11px] text-slate-700 font-medium">
                        {qCount} Latihan Soal
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                      {mat.title}
                    </h3>
                    <p className="text-xs text-slate-700 line-clamp-2 mb-3">
                      {mat.summary}
                    </p>

                    {mat.auditoryNotes && (
                      <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 mb-3 flex items-start gap-1.5 text-[11px] text-indigo-900">
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span className="truncate">Tips Auditori: {mat.auditoryNotes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => openEditMateri(mat)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteMateri(mat.id, mat.title)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: QUESTIONS
      ------------------------------------------------------------- */}
      {activeTab === 'questions' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bank Soal & Kuis</h2>
              <p className="text-xs text-slate-700">Soal latihan interaktif dengan audio narasi soal dan opsi jawaban</p>
            </div>
            <button
              onClick={openNewQuestion}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-500 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Soal Baru</span>
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const subj = subjects.find(s => s.id === q.subjectId);
              const relatedMateri = materiList.find(m => m.id === q.materiId);

              return (
                <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">#{idx + 1}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {subj?.name || q.subjectId} — Kelas {q.kelas}
                      </span>
                      {relatedMateri && (
                        <span className="text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-medium">
                          Materi: {relatedMateri.title}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditQuestion(q)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-sky-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-900 mb-3">
                    {q.questionText}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrect = opt.id === q.correctOptionId;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-[11px]">
                            {letter}
                          </span>
                          <span>{opt.text}</span>
                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800">Pembahasan:</span> {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: SUBJECTS
      ------------------------------------------------------------- */}
      {activeTab === 'subjects' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mata Pelajaran & Jenjang</h2>
              <p className="text-xs text-slate-700">Atur ketersediaan mata pelajaran untuk tingkatan SD, SMP, SMA dan kelasnya</p>
            </div>
            <button
              onClick={openNewSubject}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-500 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mata Pelajaran</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => {
              const countM = materiList.filter(m => m.subjectId === sub.id).length;
              const countQ = questions.filter(q => q.subjectId === sub.id).length;

              return (
                <div key={sub.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        sub.level === 'SD' ? 'bg-red-100 text-red-700' : sub.level === 'SMP' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        Jenjang {sub.level}
                      </span>
                      <span className="text-[11px] text-slate-700 font-medium">
                        Kelas: {sub.kelas.join(', ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1">{sub.name}</h3>
                    <p className="text-xs text-slate-700 mb-4 line-clamp-2">{sub.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-700">
                      {countM} Materi • {countQ} Soal
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditSubject(sub)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(sub.id, sub.name)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: BACKUP & RESTORE
      ------------------------------------------------------------- */}
      {activeTab === 'backup' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Backup & Pemulihan Data</h2>
            <p className="text-xs sm:text-sm text-slate-700">
              Simpan cadangan konten materi, soal, dan konfigurasi kurikulum secara aman di komputermu, atau pulihkan kapan saja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Export */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <Download className="w-6 h-6 text-sky-600 mb-2" />
                <h3 className="font-bold text-slate-900 text-sm mb-1">Unduh Backup Data</h3>
                <p className="text-xs text-slate-700 mb-4">
                  Simpan semua materi, kuis, dan mata pelajaran dalam bentuk file JSON.
                </p>
              </div>
              <button
                onClick={handleExportJSON}
                className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <Upload className="w-6 h-6 text-indigo-600 mb-2" />
                <h3 className="font-bold text-slate-900 text-sm mb-1">Impor File Data</h3>
                <p className="text-xs text-slate-700 mb-4">
                  Unggah file JSON backup untuk memulihkan materi dan soal pembelajaran.
                </p>
              </div>
              <label className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center">
                <Upload className="w-4 h-4" />
                <span>Pilih File JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset */}
            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between">
              <div>
                <RotateCcw className="w-6 h-6 text-rose-600 mb-2" />
                <h3 className="font-bold text-rose-900 text-sm mb-1">Reset ke Data Asli</h3>
                <p className="text-xs text-rose-700 mb-4">
                  Kembalikan kurikulum bawaan SD, SMP, dan SMA standar Sqolah.
                </p>
              </div>
              <button
                onClick={handleResetDefault}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Kurikulum</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: ADD / EDIT SUBJECT
      ------------------------------------------------------------- */}
      {isAddingSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
            </h3>
            <form onSubmit={handleSaveSubject} className="space-y-4 text-sm overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tingkatan Sekolah</label>
                <select
                  value={subFormLevel}
                  onChange={(e) => {
                    const lvl = e.target.value as EducationLevel;
                    setSubFormLevel(lvl);
                    if (lvl === 'SD') setSubFormKelas([1, 2, 3, 4, 5, 6]);
                    if (lvl === 'SMP') setSubFormKelas([7, 8, 9]);
                    if (lvl === 'SMA') setSubFormKelas([10, 11, 12]);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                >
                  <option value="SD">SD (Sekolah Dasar)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Matematika Ceria, Sains Terapan"
                  value={subFormName}
                  onChange={(e) => setSubFormName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan singkat mata pelajaran..."
                  value={subFormDesc}
                  onChange={(e) => setSubFormDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelas yang Berhak Mengakses</label>
                <div className="flex flex-wrap gap-2">
                  {(subFormLevel === 'SD' ? [1, 2, 3, 4, 5, 6] : subFormLevel === 'SMP' ? [7, 8, 9] : [10, 11, 12]).map(k => {
                    const isChecked = subFormKelas.includes(k);
                    return (
                      <button
                        type="button"
                        key={k}
                        onClick={() => {
                          if (isChecked) {
                            setSubFormKelas(subFormKelas.filter(c => c !== k));
                          } else {
                            setSubFormKelas([...subFormKelas, k].sort((a,b) => a-b));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          isChecked
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        Kelas {k}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingSubject(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Simpan Mata Pelajaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: ADD / EDIT MATERI
      ------------------------------------------------------------- */}
      {isAddingMateri && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 my-auto max-h-[92vh] flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex-shrink-0">
              {editingMateri ? 'Edit Materi Pembelajaran' : 'Tambah Materi Pembelajaran Baru'}
            </h3>
            <form onSubmit={handleSaveMateri} className="space-y-4 text-sm overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={matFormSubjectId}
                    onChange={(e) => setMatFormSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        [{s.level}] {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={matFormKelas}
                    onChange={(e) => setMatFormKelas(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bab / Materi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengenalan Ekosistem Hutan"
                  value={matFormTitle}
                  onChange={(e) => setMatFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Materi (Untuk Suara Pengantar)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan singkat yang akan dibacakan sebelum materi utama..."
                  value={matFormSummary}
                  onChange={(e) => setMatFormSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Paragraf Materi (Pisahkan tiap paragraf dengan dua kali Enter / baris baru)
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tulis paragraf 1...&#10;&#10;Tulis paragraf 2..."
                  value={matFormParagraphs}
                  onChange={(e) => setMatFormParagraphs(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Poin-Poin Penting (1 baris untuk 1 poin)
                </label>
                <textarea
                  rows={3}
                  placeholder="Poin penting pertama&#10;Poin penting kedua"
                  value={matFormKeyPoints}
                  onChange={(e) => setMatFormKeyPoints(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  Catatan Khusus Siswa Auditori & Berkebutuhan Khusus
                </label>
                <input
                  type="text"
                  placeholder="Tips suara, jembatan keledai, atau penekanan kata..."
                  value={matFormAuditoryNotes}
                  onChange={(e) => setMatFormAuditoryNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Waktu Baca (Menit)</label>
                <input
                  type="number"
                  min={1}
                  value={matFormEstMinutes}
                  onChange={(e) => setMatFormEstMinutes(Number(e.target.value))}
                  className="w-32 p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingMateri(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: ADD / EDIT QUESTION
      ------------------------------------------------------------- */}
      {isAddingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 my-auto max-h-[92vh] flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex-shrink-0">
              {editingQuestion ? 'Edit Soal Latihan' : 'Tambah Soal Latihan Baru'}
            </h3>
            <form onSubmit={handleSaveQuestion} className="space-y-4 text-sm overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={qFormSubjectId}
                    onChange={(e) => setQFormSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        [{s.level}] {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={qFormKelas}
                    onChange={(e) => setQFormKelas(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kaitkan dengan Materi (Opsional)</label>
                <select
                  value={qFormMateriId}
                  onChange={(e) => setQFormMateriId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value="">-- Soal Umum / Tanpa Materi Khusus --</option>
                  {materiList.map(m => (
                    <option key={m.id} value={m.id}>
                      Kelas {m.kelas} — {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan pertanyaan soal..."
                  value={qFormText}
                  onChange={(e) => setQFormText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Pilihan Jawaban</label>
                <div className="flex items-center gap-2">
                  <span className="w-6 font-bold text-center text-xs">A</span>
                  <input
                    type="text"
                    required
                    placeholder="Pilihan A"
                    value={qFormOptA}
                    onChange={(e) => setQFormOptA(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 font-bold text-center text-xs">B</span>
                  <input
                    type="text"
                    required
                    placeholder="Pilihan B"
                    value={qFormOptB}
                    onChange={(e) => setQFormOptB(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 font-bold text-center text-xs">C</span>
                  <input
                    type="text"
                    required
                    placeholder="Pilihan C"
                    value={qFormOptC}
                    onChange={(e) => setQFormOptC(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 font-bold text-center text-xs">D</span>
                  <input
                    type="text"
                    required
                    placeholder="Pilihan D"
                    value={qFormOptD}
                    onChange={(e) => setQFormOptD(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kunci Jawaban Benar</label>
                <select
                  value={qFormCorrect}
                  onChange={(e) => setQFormCorrect(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 font-bold"
                >
                  <option value="a">Pilihan A</option>
                  <option value="b">Pilihan B</option>
                  <option value="c">Pilihan C</option>
                  <option value="d">Pilihan D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pembahasan (Akan dibacakan suara saat menjawab)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Penjelasan mengapa jawaban tersebut benar..."
                  value={qFormExplanation}
                  onChange={(e) => setQFormExplanation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
