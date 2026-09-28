import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  CalendarRange, 
  UserCheck, 
  GraduationCap, 
  Eye, 
  ClipboardCheck, 
  Trophy, 
  BookOpenCheck, 
  Database, 
  Settings, 
  Terminal, 
  Share2, 
  Activity,
  HeartHandshake,
  LogOut,
  UserPlus,
  User,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Calendar,
  Network,
  Users
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeMenu: string;
  onSelectMenu: (menuKey: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface SubMenuItem {
  key: string;
  label: string;
  icon: any;
  badge?: string | null;
  restrictedRoles?: UserRole[];
}

interface MenuItem {
  key: string;
  label: string;
  icon: any;
  badge: string | null;
  adminOnly?: boolean;
  hasSubmenu?: boolean;
  subItems?: SubMenuItem[];
}

interface MenuSection {
  groupTitle: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  isOpen,
  onClose
}) => {
  const { canAccessMenu, currentUser, logout } = useApp();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    pengaturan: true
  });

  const toggleSubmenu = (key: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuSections: MenuSection[] = [
    {
      groupTitle: "MENU UTAMA",
      items: [
        {
          key: "dashboard",
          label: "1. Dashboard",
          icon: LayoutDashboard,
          badge: null
        },
        {
          key: "dokumen-induk",
          label: "2. Dokumen Induk Madrasah",
          icon: FileText,
          badge: "5 Sub",
          hasSubmenu: true,
          subItems: [
            {
              key: "dokumen-kurikulum",
              label: "Dokumen Kurikulum",
              icon: BookOpen,
              badge: null
            },
            {
              key: "kalender-pendidikan",
              label: "Kalender Pendidikan",
              icon: Calendar,
              badge: null
            },
            {
              key: "struktur-organisasi",
              label: "Struktur Organisasi",
              icon: Network,
              badge: null
            },
            {
              key: "data-guru",
              label: "Data Guru",
              icon: GraduationCap,
              badge: null
            },
            {
              key: "data-rombel",
              label: "Data Rombel",
              icon: Users,
              badge: null
            }
          ]
        },
        {
          key: "perencanaan-kurikulum",
          label: "3. Perencanaan Kurikulum",
          icon: CalendarRange,
          badge: "KBC"
        },
        {
          key: "administrasi-guru",
          label: "4. Administrasi Guru",
          icon: UserCheck,
          badge: null
        },
        {
          key: "penilaian-asesmen",
          label: "5. Penilaian & Asesmen",
          icon: GraduationCap,
          badge: null
        },
        {
          key: "supervisi-akademik",
          label: "6. Supervisi Akademik",
          icon: Eye,
          badge: "Supervisi"
        },
        {
          key: "evaluasi-monitoring",
          label: "7. Evaluasi & Monitoring",
          icon: ClipboardCheck,
          badge: null
        },
        {
          key: "prestasi-siswa",
          label: "8. Prestasi Siswa",
          icon: Trophy,
          badge: "Juara"
        },
        {
          key: "pelatihan-guru",
          label: "9. Pelatihan & Guru",
          icon: BookOpenCheck,
          badge: "IHT"
        },
        {
          key: "rdm-nilai",
          label: "10. RDM & Database Nilai",
          icon: Database,
          badge: "RDM"
        }
      ]
    },
    {
      groupTitle: "SISTEM & MANAJEMEN",
      items: [
        {
          key: "admin-monitoring",
          label: "Dashboard Admin & Log",
          icon: Activity,
          badge: "Admin",
          adminOnly: true
        },
        {
          key: "integrasi-api",
          label: "Integrasi API Eksternal",
          icon: Share2,
          badge: "API",
          adminOnly: true
        },
        {
          key: "dokumentasi-dev",
          label: "Dokumentasi Teknis",
          icon: Terminal,
          badge: "Dev"
        },
        {
          key: "pengaturan",
          label: "Pengaturan & Akun",
          icon: Settings,
          badge: null,
          hasSubmenu: true,
          subItems: [
            {
              key: "pengaturan-profil",
              label: "Profil Saya & Sesi",
              icon: User,
              badge: null
            },
            {
              key: "tambah-akun",
              label: "Tambah Akun",
              icon: UserPlus,
              badge: "Role",
              // JANGAN berikan akses menu ini ketika user Guru, Waka Kesiswaan, dan Waka Humas login
              restrictedRoles: ['GURU', 'WAKASIS', 'HUMAS']
            }
          ]
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Madrasah Profile Subheader Banner */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-linear-to-r from-emerald-800 to-teal-700 text-white shadow-md relative overflow-hidden shrink-0">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-sm pointer-events-none"></div>
          <div className="flex items-center gap-2 mb-1">
            <HeartHandshake className="w-4 h-4 text-emerald-300" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              Kurikulum Berbasis Cinta
            </span>
          </div>
          <div className="font-extrabold text-sm tracking-tight leading-tight">
            MTs. Nurul Jadid Paiton
          </div>
          <div className="text-[11px] text-emerald-100 opacity-90 mt-1">
            Tahun Ajaran 2026/2027 • Terakreditasi A
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 custom-scrollbar">
          {menuSections.map((section, idx) => {
            const accessibleItems = section.items.filter(item => {
              if (item.adminOnly && currentUser.role !== 'ADMIN' && currentUser.role !== 'WAKAKUR') {
                return false;
              }
              return canAccessMenu(item.key);
            });

            if (accessibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] font-extrabold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
                  {section.groupTitle}
                </div>
                {accessibleItems.map(item => {
                  const Icon = item.icon;
                  const isCurrentParentActive = 
                    activeMenu === item.key || 
                    (item.subItems && item.subItems.some(sub => sub.key === activeMenu));
                  
                  // Filter sub-items based on role restrictions
                  // "jangan berikan akses menu ini ketika user Guru, Waka Kesiswaan, dan Waka Humas melakukan login aplikasi"
                  const accessibleSubItems = item.subItems?.filter(sub => {
                    if (sub.restrictedRoles && sub.restrictedRoles.includes(currentUser.role)) {
                      return false;
                    }
                    return canAccessMenu(sub.key);
                  }) || [];

                  const hasAccessibleSubItems = item.hasSubmenu && accessibleSubItems.length > 0;
                  const isExpanded = expandedMenus[item.key] ?? false;

                  if (hasAccessibleSubItems) {
                    return (
                      <div key={item.key} className="space-y-1">
                        {/* Parent Menu with Submenu */}
                        <div
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                            isCurrentParentActive && activeMenu === item.key
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                              : isCurrentParentActive
                              ? 'bg-slate-100 dark:bg-slate-800/80 text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                          }`}
                          onClick={() => {
                            toggleSubmenu(item.key);
                            onSelectMenu(item.key);
                          }}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <Icon className={`w-4 h-4 shrink-0 ${
                              isCurrentParentActive && activeMenu === item.key
                                ? 'text-white'
                                : 'text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                            }`} />
                            <span className="truncate">{item.label}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {accessibleSubItems.some(s => s.key === 'tambah-akun') && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                RBAC
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubmenu(item.key);
                              }}
                              className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Submenu Items List */}
                        {isExpanded && (
                          <div className="ml-4 pl-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-1 py-0.5">
                            {accessibleSubItems.map(sub => {
                              const SubIcon = sub.icon;
                              const isSubActive = activeMenu === sub.key;

                              return (
                                <button
                                  key={sub.key}
                                  onClick={() => {
                                    onSelectMenu(sub.key);
                                    onClose();
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all group ${
                                    isSubActive
                                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <SubIcon className={`w-3.5 h-3.5 shrink-0 ${
                                      isSubActive 
                                        ? 'text-white' 
                                        : 'text-slate-400 group-hover:text-emerald-500'
                                    }`} />
                                    <span className="truncate">{sub.label}</span>
                                  </div>

                                  {sub.badge && (
                                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                                      isSubActive
                                        ? 'bg-white/20 text-white'
                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    }`}>
                                      {sub.badge}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Standard item without submenus
                  const isActive = activeMenu === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onSelectMenu(item.key);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Logout action */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Keluar dari Aplikasi</span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 text-center">
          <div className="text-[10px] text-slate-400 dark:text-slate-500">
            eKurikulum v2.6.0 • MTsNJ
          </div>
          <div className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
            Amanah • Unggul • Modern
          </div>
        </div>
      </aside>
    </>
  );
};
