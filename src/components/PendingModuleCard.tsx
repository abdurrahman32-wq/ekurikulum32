import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, FileText, Send } from 'lucide-react';

interface PendingModuleCardProps {
  title: string;
  category: string;
  description: string;
  expectedDate?: string;
  regulasiRef?: string;
  draftFields?: string[];
}

export const PendingModuleCard: React.FC<PendingModuleCardProps> = ({
  title,
  category,
  description,
  expectedDate = "Semester Berjalan (Menunggu Sinkronisasi Biro Pendidikan)",
  regulasiRef = "KMA 1503 Tahun 2025 & Juknis Kemenag RI",
  draftFields
}) => {
  const [draftNote, setDraftNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftNote.trim()) return;
    setNotes(prev => [draftNote, ...prev]);
    setDraftNote('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Status: Pending
            </span>
            <span className="text-xs text-slate-400">• {category}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
            {title}
          </h3>
        </div>
        <div className="text-right sm:text-right">
          <div className="text-[11px] text-slate-400">Dasar Regulasi:</div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{regulasiRef}</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <p>{description}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Estimasi integrasi data: {expectedDate}
        </div>
      </div>

      {draftFields && draftFields.length > 0 && (
        <div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Rancangan Struktur Data Mendatang:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {draftFields.map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catatan Sementara / Draft Pengusulan */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Catatan Awal / Draft Usulan Guru & Staf:
          </span>
          {isSaved && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
              Tersimpan di sistem!
            </span>
          )}
        </div>
        <form onSubmit={handleSaveDraft} className="flex gap-2">
          <input
            type="text"
            placeholder={`Tulis catatan usulan atau draft data untuk ${title}...`}
            value={draftNote}
            onChange={e => setDraftNote(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            Simpan
          </button>
        </form>

        {notes.length > 0 && (
          <div className="mt-3 space-y-1.5 max-h-36 overflow-y-auto">
            {notes.map((n, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex justify-between items-center">
                <span>{n}</span>
                <span className="text-[10px] text-slate-400 ml-2">Tersimpan</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
