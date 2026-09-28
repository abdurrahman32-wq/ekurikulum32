import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ExternalLink, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Edit3, 
  RotateCcw, 
  AlertTriangle, 
  Check, 
  Copy, 
  Globe, 
  Info, 
  X, 
  HelpCircle,
  Eye,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileCode2,
  ArrowRight
} from 'lucide-react';

export type IframeType = 'kurikulum' | 'kalender' | 'struktur' | 'dataGuru' | 'dataRombel';

interface PresetItem {
  label: string;
  description: string;
  url: string;
}

interface IframeEmbedSectionProps {
  type: IframeType;
  title: string;
  subtitle: string;
  badgeText: string;
  nativeLabel: string;
  iframeLabel?: string;
  children: React.ReactNode; // The native / interactive content
  defaultViewMode?: 'native' | 'iframe';
  guidanceText?: string;
}

const PRESETS: Record<IframeType, PresetItem[]> = {
  kurikulum: [
    {
      label: "Google Drive Preview Format (Sematan Resmi)",
      description: "Format sematan resmi Google Drive (ganti ID file)",
      url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview"
    },
    {
      label: "FlipHTML5 E-Book Kurikulum",
      description: "Format buku digital flipbook interaktif",
      url: "https://online.fliphtml5.com/demo/kurikulum"
    },
    {
      label: "AnyFlip Flipbook Online",
      description: "Format publikasi dokumen madrasah AnyFlip",
      url: "https://online.anyflip.com/demo/kurikulum/index.html"
    }
  ],
  kalender: [
    {
      label: "Google Drive Preview Format (Sematan Resmi - Default)",
      description: "Format sematan resmi Google Drive: ganti ID file dengan berkas Kalender Anda",
      url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview"
    },
    {
      label: "Google Calendar Hari Libur Nasional & Islam Indonesia",
      description: "Kalender resmi nasional & keagamaan Kemenag/Kemenko PMK",
      url: "https://calendar.google.com/calendar/embed?src=id.indonesian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FJakarta"
    },
    {
      label: "Google Calendar Kalender Akademik Kemenag",
      description: "Kalender agenda pendidikan madrasah se-Jawa Timur (Mode Agenda)",
      url: "https://calendar.google.com/calendar/embed?src=id.indonesian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FJakarta&mode=AGENDA"
    }
  ],
  struktur: [
    {
      label: "Google Drive Preview Format (Sematan Resmi - Default)",
      description: "Format sematan resmi Google Drive: ganti ID file dengan berkas Struktur Anda",
      url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview"
    },
    {
      label: "Google Slides Bagan Struktur Organisasi (Embed)",
      description: "Format publikasi Google Slides (ganti ID presentasi Anda)",
      url: "https://docs.google.com/presentation/d/e/2PACX-1vR/embed?start=false&loop=false&delayms=3000"
    },
    {
      label: "Canva Infografis Struktur Organisasi",
      description: "Format embed desain infografis interaktif Canva",
      url: "https://www.canva.com/design/DAFexample/view?embed"
    }
  ],
  dataGuru: [
    {
      label: "Google Drive Preview Format (Sematan Resmi - Default)",
      description: "Format sematan resmi Google Drive: ganti ID file dengan spreadsheet Data Guru Anda",
      url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview"
    },
    {
      label: "Google Sheets Web Publikasi (PubHTML)",
      description: "Format tabel Google Spreadsheet resmi yang dipublikasikan ke web",
      url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT/pubhtml?widget=true&headers=false"
    },
    {
      label: "Portal Simpatika / Data Guru Madrasah",
      description: "Tautan embed sistem kepegawaian & beban JP mengajar Simpatika",
      url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ/pubhtml?widget=true&headers=false"
    }
  ],
  dataRombel: [
    {
      label: "Google Drive Preview Format (Sematan Resmi)",
      description: "Format sematan resmi Google Drive: ganti ID file dengan spreadsheet Rombel Anda",
      url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview"
    },
    {
      label: "Google Sheets Pembagian Rombel & Siswa (PubHTML)",
      description: "Format tabel Google Spreadsheet data rombel dan santri dipublikasikan ke web",
      url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-rombel/pubhtml?widget=true&headers=false"
    },
    {
      label: "Portal EMIS Kemenag Madrasah - Data Rombel",
      description: "Tautan integrasi sistem EMIS 4.0 data rombongan belajar Kemenag",
      url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-emis/pubhtml?widget=true&headers=false"
    }
  ]
};

const TIPS_BY_TYPE: Record<IframeType, string[]> = {
  kurikulum: [
    "Format Sematan Resmi Google Drive: Gunakan format https://drive.google.com/file/d/[ID_FILE]/preview. Cukup ganti [ID_FILE] dengan ID berkas Google Drive Anda.",
    "Cara mendapatkan ID File: Buka file PDF di Google Drive > Bagikan > Atur 'Siapa saja yang memiliki link dapat melihat' > Salin tautan. ID file adalah kode unik di antara /d/ dan /view (contoh: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms).",
    "Penting: Jangan gunakan link Google Drive biasa yang berakhiran /view atau /edit, karena Google akan memblokir tampilan frame. Selalu gunakan tautan /preview."
  ],
  kalender: [
    "Format Sematan Resmi Google Drive: Gunakan format https://drive.google.com/file/d/[ID_FILE]/preview. Cukup ganti [ID_FILE] dengan ID berkas PDF/Dokumen Kalender Akademik Anda.",
    "Cara mendapatkan ID File Kalender: Buka berkas kalender di Google Drive > Bagikan > Atur 'Siapa saja yang memiliki link dapat melihat' > Salin tautan. Ambil kode ID di antara /d/ dan /view lalu masukkan pada form pengubah ID di atas.",
    "Alternatif Google Calendar: Buka Google Calendar di komputer > 'Setelan dan berbagi' > Jadikan tersedia untuk umum > Salin 'URL Sematan' (src='...')."
  ],
  struktur: [
    "Format Sematan Resmi Google Drive: Gunakan format https://drive.google.com/file/d/[ID_FILE]/preview. Cukup ganti [ID_FILE] dengan ID berkas gambar/PDF/Slide Struktur Organisasi Anda.",
    "Cara mendapatkan ID File Struktur: Buka file bagan struktur di Google Drive > Bagikan > Atur 'Siapa saja yang memiliki link dapat melihat' > Ambil kode ID di antara /d/ dan /view lalu klik 'Terapkan ID'.",
    "Penting: Pastikan hak akses file di Google Drive disetel ke 'Siapa saja yang memiliki link dapat melihat' (Viewer) agar dapat tertampil sempurna di dalam bingkai sematan tanpa terblokir izin login."
  ],
  dataGuru: [
    "Format Sematan Resmi Google Drive: Gunakan format https://drive.google.com/file/d/[ID_FILE]/preview. Cukup ganti [ID_FILE] dengan ID berkas spreadsheet/PDF Data Dewan Guru Anda.",
    "Cara mendapatkan ID File Guru: Buka spreadsheet dewan guru di Google Drive > Bagikan > Atur 'Siapa saja yang memiliki link dapat melihat' > Salin tautan dan ambil deretan kode ID filenya.",
    "Alternatif Google Sheets Publikasi: Anda juga bisa menggunakan menu File > Bagikan > Publikasikan ke web > Format 'Halaman Web' (/pubhtml)."
  ],
  dataRombel: [
    "Format Sematan Resmi Google Drive: Gunakan format https://drive.google.com/file/d/[ID_FILE]/preview. Cukup ganti [ID_FILE] dengan ID berkas spreadsheet data rombel/siswa Anda.",
    "Cara mendapatkan ID File: Buka spreadsheet rombel di Google Drive > Bagikan > Atur izin berbagi publik (Viewer) > Salin tautan dan masukkan ID-nya.",
    "Alternatif Google Sheets PubHTML: Buka spreadsheet data rombel > File > Bagikan > 'Publikasikan ke web' > Salin link yang diakhiri /pubhtml?widget=true&headers=false."
  ]
};

export const IframeEmbedSection: React.FC<IframeEmbedSectionProps> = ({
  type,
  title,
  subtitle,
  badgeText,
  nativeLabel,
  iframeLabel = "Tampilan Iframe Embed (Web Eksternal)",
  children,
  defaultViewMode = 'native',
  guidanceText
}) => {
  const { iframeUrls, setIframeUrl, resetIframeUrl, canEdit } = useApp();

  const currentUrl = iframeUrls[type] || '';
  const [viewMode, setViewMode] = useState<'native' | 'iframe'>(defaultViewMode);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [driveFileIdInput, setDriveFileIdInput] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);
  const [iframeHeight, setIframeHeight] = useState<'normal' | 'tall' | 'extra'>('normal');

  const presets = PRESETS[type] || [];
  const tips = TIPS_BY_TYPE[type] || [];

  // Listen for Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Extract ID from full URL or return ID string
  const extractDriveId = (val: string): string => {
    const trimmed = val.trim();
    if (!trimmed) return '';
    // Look for /d/FILE_ID
    const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) return matchD[1];
    // Look for id=FILE_ID
    const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) return matchId[1];
    // Otherwise return clean string
    return trimmed.replace(/["'\s]/g, '');
  };

  const handleOpenEdit = () => {
    setInputUrl(currentUrl);
    const existingId = extractDriveId(currentUrl);
    setDriveFileIdInput(existingId || '');
    setIsEditingModalOpen(true);
  };

  const handleApplyDriveId = () => {
    const id = extractDriveId(driveFileIdInput);
    if (!id) return;
    const generatedUrl = `https://drive.google.com/file/d/${id}/preview`;
    setInputUrl(generatedUrl);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setIframeUrl(type, inputUrl.trim());
    setIsEditingModalOpen(false);
    setRefreshKey(prev => prev + 1);
    setIsLoadingIframe(true);
  };

  const handleResetUrl = () => {
    resetIframeUrl(type);
    setIsEditingModalOpen(false);
    setRefreshKey(prev => prev + 1);
    setIsLoadingIframe(true);
  };

  const handleRefresh = () => {
    setIsLoadingIframe(true);
    setRefreshKey(prev => prev + 1);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHeightClass = () => {
    if (isFullscreen) return 'h-[calc(100vh-210px)] min-h-[500px]';
    switch (iframeHeight) {
      case 'tall':
        return 'h-[800px] min-h-[600px]';
      case 'extra':
        return 'h-[1000px] min-h-[750px]';
      default:
        return 'h-[650px] min-h-[540px]';
    }
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-6 overflow-y-auto' : ''}`}>
      {/* Header Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/50">
                {badgeText}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                MTs. Nurul Jadid 2026/2027
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('native')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === 'native'
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{nativeLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('iframe')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === 'iframe'
                    ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{iframeLabel}</span>
              </button>
            </div>

            {/* If in Iframe Mode, show direct actions */}
            {viewMode === 'iframe' && (
              <div className="flex items-center gap-1.5">
                {canEdit() && (
                  <button
                    onClick={handleOpenEdit}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer transition"
                    title="Ubah tautan iframe atau ganti ID file Google Drive"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ubah URL / ID</span>
                  </button>
                )}

                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center gap-1.5 cursor-pointer transition"
                  title="Buka dokumen langsung di tab baru browser"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buka di Tab Baru</span>
                </a>

                {/* Height Selector Buttons */}
                {!isFullscreen && (
                  <div className="hidden md:flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setIframeHeight('normal')}
                      className={`px-2 py-1 rounded-lg transition ${iframeHeight === 'normal' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-500'}`}
                      title="Tinggi Standar (650px)"
                    >
                      650px
                    </button>
                    <button
                      type="button"
                      onClick={() => setIframeHeight('tall')}
                      className={`px-2 py-1 rounded-lg transition ${iframeHeight === 'tall' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-500'}`}
                      title="Tinggi Ekstra (800px)"
                    >
                      800px
                    </button>
                    <button
                      type="button"
                      onClick={() => setIframeHeight('extra')}
                      className={`px-2 py-1 rounded-lg transition ${iframeHeight === 'extra' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-500'}`}
                      title="Tinggi Maksimal (1000px)"
                    >
                      1000px
                    </button>
                  </div>
                )}

                <button
                  onClick={handleRefresh}
                  className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition"
                  title="Muat ulang tampilan iframe"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition"
                  title={isFullscreen ? "Keluar Layar Penuh (ESC)" : "Layar Penuh"}
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Mode 1: NATIVE / INTERACTIVE CONTENT */}
        {viewMode === 'native' && (
          <div className="space-y-4">
            {/* Quick Banner suggesting Iframe option */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Menampilkan data terpadu bawaan sistem madrasah. Ingin melihat dokumen asli via Google Drive, Slides, Spreadsheet, atau Portal luar?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('iframe')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
              >
                Beralih ke Iframe Embed <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* RENDER NATIVE CHILDREN (Buku Digital / Kalender Interaktif / Bagan Visual / Tabel Guru / Data Rombel) */}
            <div>{children}</div>
          </div>
        )}

        {/* View Mode 2: IFRAME EMBED */}
        {viewMode === 'iframe' && (
          <div className="space-y-4">
            {/* Iframe Top Bar / Address Box */}
            <div className="bg-slate-900 text-slate-300 rounded-2xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shrink-0">
                  IFRAME EMBED
                </span>
                <span className="font-mono text-[11px] truncate text-slate-300" title={currentUrl}>
                  {currentUrl}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                  title="Salin tautan URL embed"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin!' : 'Salin URL'}</span>
                </button>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 transition"
                  title="Buka dokumen di tab baru peramban"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka Tab Baru</span>
                </a>
              </div>
            </div>

            {/* IFRAME CONTAINER */}
            <div className="relative w-full rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 shadow-inner">
              {isLoadingIframe && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10 text-white text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                  <span className="font-medium">Memuat bingkai embed dari Google Drive / penyedia...</span>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] underline flex items-center gap-1"
                  >
                    Buka langsung di tab baru jika lambat <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <div className={`w-full ${getHeightClass()} relative transition-all duration-200`}>
                <iframe
                  key={refreshKey}
                  src={currentUrl}
                  title={title}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0 bg-white"
                  loading="lazy"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  onLoad={() => setIsLoadingIframe(false)}
                />
              </div>
            </div>

            {/* SECURITY & X-FRAME NOTICE CARD (Why iframes can show blank & how to solve) */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-extrabold text-amber-900 dark:text-amber-300">
                    Panduan Jika Tampilan Iframe Kosong atau Menolak Koneksi (Refused to Connect):
                  </div>
                  <p className="text-amber-800/90 dark:text-amber-400/90 leading-relaxed">
                    Beberapa layanan eksternal (seperti Google Drive/Docs/Sheets/Slides, Flipbook, atau Portal Web) menerapkan kebijakan keamanan ketat <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[10px]">X-Frame-Options: SAMEORIGIN</code> atau memblokir penyematan iframe lintas domain jika hak akses berkas belum disetel ke publik.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-xs transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      1. Buka Langsung Dokumen di Tab Baru
                    </a>
                    <button
                      type="button"
                      onClick={() => setViewMode('native')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-lg font-bold text-xs transition cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      2. Beralih ke {nativeLabel}
                    </button>
                    {canEdit() && (
                      <button
                        type="button"
                        onClick={handleOpenEdit}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-lg font-bold text-xs transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        3. Perbaiki / Ganti ID File Google Drive
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL / DIALOG: EDIT IFRAME URL & GOOGLE DRIVE ID REPLACER */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  Konfigurasi Iframe
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  Atur Tautan Embed Iframe: {title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUrl} className="space-y-4">
              {/* GOOGLE DRIVE ID QUICK GENERATOR */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Format Sematan Resmi Google Drive:</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                    https://drive.google.com/file/d/ID_FILE/preview
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
                  Cukup masukkan <strong>ID File Google Drive</strong> Anda (atau tempel tautan berbagi Google Drive lengkap), lalu klik <strong>Terapkan ID</strong> untuk langsung menghasilkan format sematan resmi.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
                  <input
                    type="text"
                    value={driveFileIdInput}
                    onChange={(e) => setDriveFileIdInput(e.target.value)}
                    placeholder="Contoh ID: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDriveId}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Terapkan ID File</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* DIRECT EMBED URL INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tautan Sumber Iframe Aktif (Embed URL):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../preview"
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  {inputUrl.trim() && (
                    <a
                      href={inputUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0 transition"
                      title="Tes buka tautan di tab baru peramban"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Uji URL</span>
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Format resmi yang didukung peramban adalah tautan berakhiran <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[10px]">/preview</code>, bukan /view atau /edit.
                </p>
              </div>

              {/* URL Presets & Templates */}
              {presets.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Pilihan Contoh & Template Tautan:
                  </label>
                  <div className="space-y-1.5">
                    {presets.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setInputUrl(p.url);
                          const extracted = extractDriveId(p.url);
                          if (extracted) setDriveFileIdInput(extracted);
                        }}
                        className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-3 text-xs cursor-pointer ${
                          inputUrl === p.url
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                            : 'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 hover:border-emerald-400'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                            {inputUrl === p.url && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            <span>{p.label}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{p.description}</div>
                          <div className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 truncate mt-0.5">{p.url}</div>
                        </div>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] shrink-0 hover:bg-emerald-600 hover:text-white transition"
                        >
                          Pilih
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpful Tips for Setting up Embed */}
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1.5 text-xs text-blue-900 dark:text-blue-300">
                <div className="font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Tips Cara Mendapatkan & Mengganti ID File Google Drive:
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-blue-800 dark:text-blue-300/90 leading-relaxed">
                  {tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetUrl}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset ke Nilai Bawaan
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
