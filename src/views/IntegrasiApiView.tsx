import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Code2, 
  Key, 
  Send, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  Webhook, 
  RefreshCw, 
  ExternalLink, 
  Terminal,
  Globe,
  BellRing,
  Layers
} from 'lucide-react';

export const IntegrasiApiView: React.FC = () => {
  const { students, teachers, announcements, protaList, canEdit } = useApp();

  // API Key State
  const [apiKey, setApiKey] = useState('mtsnj_live_sk_7aa3f686eeed4f6f9abe706e543762d2_2026');
  const [copiedKey, setCopiedKey] = useState(false);

  // Webhooks Config State
  const [webhooks, setWebhooks] = useState([
    {
      id: 'wh-1',
      name: 'EMIS Kemenag 4.0 Sync',
      url: 'https://emis.kemenag.go.id/api/v4/madrasah/sync',
      event: 'Data Siswa & Guru Updated',
      status: 'Aktif',
      lastTrigger: '22 September 2026 09:15 WIB'
    },
    {
      id: 'wh-2',
      name: 'WhatsApp Gateway Pengumuman Mendesak',
      url: 'https://api.pesantren-wa.id/v1/messages/broadcast',
      event: 'Urgent Announcement Broadcast',
      status: 'Aktif',
      lastTrigger: '20 September 2026 14:00 WIB'
    },
    {
      id: 'wh-3',
      name: 'Simpatika Kepegawaian Kemenag',
      url: 'https://simpatika.kemenag.go.id/api/v2/ptk/sync',
      event: 'SK Tugas Guru Updated',
      status: 'Terhubung',
      lastTrigger: '18 September 2026 10:30 WIB'
    }
  ]);

  // API Tester State
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/students');
  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleGenerateKey = () => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`mtsnj_live_sk_${randomHex}`);
  };

  const handleRunApiTest = () => {
    setIsLoading(true);
    setTimeout(() => {
      let data: any = {};
      if (selectedEndpoint === '/api/v1/students') {
        data = {
          status: 'success',
          code: 200,
          total: students.length,
          data: students.slice(0, 3)
        };
      } else if (selectedEndpoint === '/api/v1/teachers') {
        data = {
          status: 'success',
          code: 200,
          total: teachers.length,
          data: teachers.slice(0, 3)
        };
      } else if (selectedEndpoint === '/api/v1/announcements') {
        data = {
          status: 'success',
          code: 200,
          total: announcements.length,
          data: announcements
        };
      } else if (selectedEndpoint === '/api/v1/curriculum/prota') {
        data = {
          status: 'success',
          code: 200,
          total: protaList.length,
          data: protaList.slice(0, 3)
        };
      } else {
        data = {
          status: 'success',
          code: 200,
          message: 'MTs. Nurul Jadid Open API v1.0 Service is Healthy & Online',
          timestamp: new Date().toISOString()
        };
      }

      setTestResult(JSON.stringify(data, null, 2));
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-inner">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                Developer Integration
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                RESTful API v1.0
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Integrasi API Pihak Ketiga & Webhooks
            </h3>
            <p className="text-xs text-slate-500">
              Koneksi terenkripsi untuk EMIS Kemenag 4.0, Simpatika, RDM, dan Layanan Bot Notifikasi WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* API Key Management */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-600" />
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Kunci API Rahasia (Secret Key)
            </h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            Authorization: Bearer {'<token>'}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Gunakan kunci ini untuk mengautentikasi setiap permintaan HTTP dari backend pihak ketiga. Lindungi kunci ini dan jangan bagikan di repositori publik.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 font-mono text-xs bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 overflow-x-auto truncate">
            {apiKey}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyKey}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copiedKey ? 'Disalin' : 'Salin Kunci'}
            </button>

            {canEdit('integrasi-api') && (
              <button
                onClick={handleGenerateKey}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Key
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Webhook className="w-4 h-4 text-emerald-600" />
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Webhook Event Triggers
            </h4>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
            Real-Time Push
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-3.5 py-3">Layanan Pihak Ketiga</th>
                <th className="px-3.5 py-3">Target Payload URL</th>
                <th className="px-3.5 py-3">Peristiwa (Event Trigger)</th>
                <th className="px-3.5 py-3 text-center">Status</th>
                <th className="px-3.5 py-3 text-right">Terakhir Dipicu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {webhooks.map((wh) => (
                <tr key={wh.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                  <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">{wh.name}</td>
                  <td className="px-3.5 py-3 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">{wh.url}</td>
                  <td className="px-3.5 py-3">{wh.event}</td>
                  <td className="px-3.5 py-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {wh.status}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-right text-slate-400 text-[11px]">{wh.lastTrigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive API Tester Console */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" />
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Konsol Pengujian API Interaktif (Live API Tester)
            </h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            Simulasi Permintaan Data
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedMethod}
            onChange={e => setSelectedMethod(e.target.value)}
            className="w-24 px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-emerald-600 font-mono"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>

          <select
            value={selectedEndpoint}
            onChange={e => setSelectedEndpoint(e.target.value)}
            className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-mono"
          >
            <option value="/api/v1/students">/api/v1/students (Data Siswa & Rombel)</option>
            <option value="/api/v1/teachers">/api/v1/teachers (Data Pendidik & NIUP)</option>
            <option value="/api/v1/announcements">/api/v1/announcements (Pengumuman Mendesak)</option>
            <option value="/api/v1/curriculum/prota">/api/v1/curriculum/prota (Program Tahunan KBC)</option>
            <option value="/api/v1/health">/api/v1/health (Status Server MTsNJ)</option>
          </select>

          <button
            onClick={handleRunApiTest}
            disabled={isLoading}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {isLoading ? 'Mengirim...' : 'Kirim Permintaan'}
          </button>
        </div>

        {/* Response Display */}
        {testResult && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Hasil Respons Server:</span>
              <span className="font-bold text-emerald-600">HTTP 200 OK (application/json)</span>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 max-h-72">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
