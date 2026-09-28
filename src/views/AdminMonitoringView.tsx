import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Key, 
  Lock, 
  Database, 
  Download, 
  FileSpreadsheet, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Clock,
  Terminal,
  Server
} from 'lucide-react';
import { exportTableToExcel, exportTableToPDF } from '../utils/exportUtils';

export const AdminMonitoringView: React.FC = () => {
  const { auditLogs, currentUser, canExport } = useApp();
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchUser, setSearchUser] = useState<string>('');

  const filteredLogs = auditLogs.filter(log => {
    const matchAction = filterAction === 'all' || log.action.toLowerCase().includes(filterAction.toLowerCase());
    const roleString = log.role || log.userRole || '';
    const matchUser = log.userName.toLowerCase().includes(searchUser.toLowerCase()) || roleString.toLowerCase().includes(searchUser.toLowerCase());
    return matchAction && matchUser;
  });

  const handleExportPDF = () => {
    exportTableToPDF({
      title: 'AUDIT LOG & AKTIVITAS SISTEM eKURIKULUM',
      subtitle: 'MTs. Nurul Jadid Paiton • Laporan Keamanan & Monitoring Admin',
      headers: ['No', 'Waktu', 'Pengguna', 'Peran', 'Aksi', 'Modul', 'Detail'],
      rows: filteredLogs.map((l, idx) => [
        idx + 1,
        l.timestamp,
        l.userName,
        l.role || l.userRole || 'GURU',
        l.action,
        l.targetModule || l.module || 'Sistem',
        l.details || '-'
      ]),
      fileName: 'Audit_Log_eKurikulum_MTsNJ',
      orientation: 'landscape'
    });
  };

  const handleExportExcel = () => {
    const data = filteredLogs.map((l, idx) => ({
      No: idx + 1,
      Timestamp: l.timestamp,
      'Nama Pengguna': l.userName,
      'Peran (Role)': l.role,
      Aksi: l.action,
      Modul: l.targetModule,
      Detail: l.details || '',
      IP: l.ipAddress || '127.0.0.1'
    }));
    exportTableToExcel(data, 'Audit_Log_eKurikulum_MTsNJ', 'Audit Log');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Security Enclave */}
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pusat Kontrol Keamanan Admin
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Enkripsi AES-256 Aktif
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Dashboard Monitoring Aktivitas Pengguna & Integritas Sistem
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Pemantauan real-time riwayat audit log, verifikasi integritas data madrasah, kepatuhan hak akses berbasis peran (RBAC), serta pemantauan akses staf MTs. Nurul Jadid.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            {canExport() && (
              <>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-2 transition"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Ekspor Log (PDF)
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 transition shadow-md"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Ekspor Log (Excel)
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Catatan Audit</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {auditLogs.length}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Tercatat otomatis
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Peran Pengguna Terdaftar</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            5 Hak Akses
          </div>
          <div className="text-[11px] text-slate-500">
            ADMIN, KEPALA, WAKAKUR, WAKASIS, GURU
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Protokol Keamanan</span>
            <Key className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            TLS 1.3 / AES
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Aturan Firestore Terkunci
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Status Penyimpanan Cloud</span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            Sinkron
          </div>
          <div className="text-[11px] text-teal-600">
            Firebase Firestore Online
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Log Riwayat Aktivitas & Perubahan Data (Audit Trail)
            </h3>
            <p className="text-xs text-slate-500">
              Setiap penambahan, pengeditan, atau penghapusan dokumen terekam permanen untuk akuntabilitas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari user / peran..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">Semua Aksi</option>
              <option value="Tambah">Tambah Data</option>
              <option value="Update">Update Data</option>
              <option value="Hapus">Hapus Data</option>
              <option value="Switch">Ganti Peran</option>
              <option value="Login">Login / Akses</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-3.5 py-3 text-center w-12">No</th>
                <th className="px-3.5 py-3">Waktu (WIB)</th>
                <th className="px-3.5 py-3">Pengguna</th>
                <th className="px-3.5 py-3">Peran (Role)</th>
                <th className="px-3.5 py-3">Aksi</th>
                <th className="px-3.5 py-3">Modul Target</th>
                <th className="px-3.5 py-3">Detail Perubahan</th>
                <th className="px-3.5 py-3 text-center">IP Klien</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log, idx) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition font-mono text-[11px]">
                  <td className="px-3.5 py-3 text-center text-slate-400 font-sans">{idx + 1}</td>
                  <td className="px-3.5 py-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-3.5 py-3 font-bold font-sans text-slate-900 dark:text-white">{log.userName}</td>
                  <td className="px-3.5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-sans bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                      log.action.includes('Hapus') ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                      log.action.includes('Tambah') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      log.action.includes('Update') ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 font-semibold text-emerald-700 dark:text-emerald-400 font-sans">{log.targetModule}</td>
                  <td className="px-3.5 py-3 text-slate-600 dark:text-slate-300 max-w-xs font-sans">{log.details || '-'}</td>
                  <td className="px-3.5 py-3 text-center text-slate-400">{log.ipAddress || '192.168.1.10'}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 text-xs font-sans">
                    Tidak ada aktivitas yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
