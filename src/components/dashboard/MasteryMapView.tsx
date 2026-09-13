import React, { useState } from 'react';
import { MASTER_CURRICULUM, CurriculumConcept } from '../../data/curriculumMaster';
import { IntelligenceService } from '../../services/intelligenceService';
import { ConceptMastery, MasteryLevel } from '../../types/intelligence';

interface MasteryMapViewProps {
  studentId: string;
  onNavigateToMateri: (babNumber: number) => void;
  onNavigateToQuiz: (babNumber: number) => void;
}

export const MasteryMapView: React.FC<MasteryMapViewProps> = ({
  studentId,
  onNavigateToMateri,
  onNavigateToQuiz
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedConceptModal, setSelectedConceptModal] = useState<{
    concept: CurriculumConcept;
    mastery?: ConceptMastery;
    babNumber: number;
    chapterName: string;
  } | null>(null);

  const masteries = IntelligenceService.getStudentMasteries(studentId);
  const masteryMap = new Map<string, ConceptMastery>();
  masteries.forEach(m => masteryMap.set(m.conceptId, m));

  const overall = IntelligenceService.calculateOverallMastery(studentId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Peta Penguasaan Materi (Mastery Map)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualisasi hierarki silabus Kimia SMA: Bab → Topik → Konsep dengan status ketuntasan berjenjang.
          </p>
        </div>

        {/* Level Legend */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold bg-white p-2 rounded-2xl border border-slate-200">
          <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-800">Lvl 5: Mastered</span>
          <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800">Lvl 4: Strong</span>
          <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-800">Lvl 3: Developing</span>
          <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800">Lvl 2: Needs Review</span>
          <span className="px-2 py-1 rounded-lg bg-red-100 text-red-800">Lvl 1: Gap</span>
          <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600">Lvl 0: Untouched</span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'mastered', label: 'Mahir (Lvl 4-5)' },
            { id: 'developing', label: 'Berkembang (Lvl 3)' },
            { id: 'gap', label: 'Perlu Penguatan (Lvl 1-2)' },
            { id: 'not_started', label: 'Belum Dimulai (Lvl 0)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedStatusFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedStatusFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Cari konsep atau bab..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-blue-500 w-full sm:w-60"
        />
      </div>

      {/* Curriculum Chapters List */}
      <div className="space-y-6">
        {MASTER_CURRICULUM[0].chapters.map(chap => {
          // Check if any concept inside chapter matches filters
          const filteredTopics = chap.topics.map(top => {
            const matchedConcepts = top.concepts.filter(c => {
              const m = masteryMap.get(c.id);
              const score = m ? m.score : 0;
              const lvl = m ? m.level : 0;

              // Filter by status
              if (selectedStatusFilter === 'mastered' && lvl < 4) return false;
              if (selectedStatusFilter === 'developing' && lvl !== 3) return false;
              if (selectedStatusFilter === 'gap' && (lvl < 1 || lvl > 2)) return false;
              if (selectedStatusFilter === 'not_started' && lvl !== 0) return false;

              // Filter by search
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                  c.name.toLowerCase().includes(q) ||
                  c.description.toLowerCase().includes(q) ||
                  top.name.toLowerCase().includes(q) ||
                  chap.name.toLowerCase().includes(q)
                );
              }
              return true;
            });

            return { ...top, concepts: matchedConcepts };
          }).filter(top => top.concepts.length > 0);

          if (filteredTopics.length === 0) return null;

          return (
            <div key={chap.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              {/* Chapter Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {chap.babNumber}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Bab {chap.babNumber}: {chap.name}
                    </h3>
                    <p className="text-xs text-slate-500">Materi Silabus Kimia SMA</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigateToMateri(chap.babNumber)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-xl transition"
                  >
                    Buka Rangkuman Materi
                  </button>
                  <button
                    onClick={() => onNavigateToQuiz(chap.babNumber)}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm"
                  >
                    Uji Pemahaman Kuis
                  </button>
                </div>
              </div>

              {/* Topics & Concepts Grid */}
              <div className="space-y-4">
                {filteredTopics.map(topic => (
                  <div key={topic.id} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                      Topik: {topic.name}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {topic.concepts.map(concept => {
                        const m = masteryMap.get(concept.id);
                        const score = m ? m.score : 0;
                        const levelObj = IntelligenceService.getLevelFromScore(score);

                        return (
                          <div
                            key={concept.id}
                            onClick={() =>
                              setSelectedConceptModal({
                                concept,
                                mastery: m,
                                babNumber: chap.babNumber,
                                chapterName: chap.name
                              })
                            }
                            className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  Bobot {concept.difficultyWeight}/5
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    levelObj.level === 5
                                      ? 'bg-purple-100 text-purple-800'
                                      : levelObj.level === 4
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : levelObj.level === 3
                                      ? 'bg-blue-100 text-blue-800'
                                      : levelObj.level === 2
                                      ? 'bg-amber-100 text-amber-800'
                                      : levelObj.level === 1
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  Lvl {levelObj.level} • {levelObj.label}
                                </span>
                              </div>

                              <h5 className="text-sm font-bold text-slate-800 line-clamp-1">
                                {concept.name}
                              </h5>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {concept.description}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-slate-700">{score}%</span>
                                <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      score >= 75 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : score > 0 ? 'bg-amber-500' : 'bg-slate-300'
                                    }`}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-blue-600">Detail →</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Concept Drilldown Modal */}
      {selectedConceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  Bab {selectedConceptModal.babNumber} • {selectedConceptModal.chapterName}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-0.5">
                  {selectedConceptModal.concept.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedConceptModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedConceptModal.concept.description}
            </p>

            {/* Score & Component Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Tingkat Penguasaan
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {selectedConceptModal.mastery?.score || 0}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Soal Dicoba</span>
                  <span className="font-semibold text-slate-800">
                    {selectedConceptModal.mastery?.questionsAttempted || 0} Soal
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Akurasi Jawaban</span>
                  <span className="font-semibold text-emerald-600">
                    {selectedConceptModal.mastery?.questionsCorrect || 0} Benar
                  </span>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            {selectedConceptModal.concept.prerequisiteConceptIds.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Konsep Prasyarat Kunci:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedConceptModal.concept.prerequisiteConceptIds.map(prereqId => (
                    <span
                      key={prereqId}
                      className="px-3 py-1 rounded-xl text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200"
                    >
                      🔗 {prereqId.replace('conc-', '').replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  const b = selectedConceptModal.babNumber;
                  setSelectedConceptModal(null);
                  onNavigateToMateri(b);
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition text-center"
              >
                Baca Materi Bab
              </button>
              <button
                onClick={() => {
                  const b = selectedConceptModal.babNumber;
                  setSelectedConceptModal(null);
                  onNavigateToQuiz(b);
                }}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition text-center shadow-sm"
              >
                Kerjakan Latihan Kuis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
