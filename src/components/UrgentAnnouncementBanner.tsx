import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Bell, X, Send, Plus } from 'lucide-react';

export const UrgentAnnouncementBanner: React.FC = () => {
  const { announcements, addAnnouncement, currentUser } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(true);

  const urgentList = announcements.filter(a => a.isUrgent);
  const currentAnnouncement = urgentList[0] || announcements[0];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    await addAnnouncement({
      title: newTitle,
      content: newContent,
      isUrgent,
      author: currentUser.displayName,
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    });

    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const canBroadcast = ['ADMIN', 'KEPALA', 'WAKAKUR'].includes(currentUser.role);

  return (
    <>
      {currentAnnouncement && !isDismissed && (
        <div className={`px-4 py-2.5 flex items-center justify-between text-sm transition-all duration-300 shadow-sm ${
          currentAnnouncement.isUrgent 
            ? 'bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200' 
            : 'bg-emerald-600/10 border-b border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
        }`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              currentAnnouncement.isUrgent ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-600 text-white'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              {currentAnnouncement.isUrgent ? 'Pengumuman Penting' : 'Info Madrasah'}
            </span>
            <div className="truncate">
              <span className="font-bold mr-2">{currentAnnouncement.title}:</span>
              <span className="opacity-90">{currentAnnouncement.content}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {canBroadcast && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs px-2.5 py-1 rounded bg-slate-900/10 dark:bg-white/10 hover:bg-slate-900/20 font-medium transition"
              >
                + Buat Notifikasi
              </button>
            )}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-full hover:bg-slate-900/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100"
              title="Tutup banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Buat Pengumuman */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                Kirim Pengumuman Real-time
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengumpulan Perangkat Ajar STS Ganjil..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Isi Notifikasi / Informasi
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tuliskan pesan instruksi atau pengumuman penting bagi seluruh dewan guru dan santri..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="urgentCheck" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tandai sebagai Pengumuman Mendesak (Urgent)
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Kirim & Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
