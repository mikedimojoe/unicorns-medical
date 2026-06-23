import { X, LayoutDashboard, Users, PlusCircle, BarChart3 } from 'lucide-react';

type Page = 'dashboard' | 'squad' | 'player' | 'injury-tracker' | 'fitness';

interface Props {
  open: boolean;
  onClose: () => void;
  current: Page;
  onNavigate: (p: Page) => void;
}

const nav = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'squad' as Page, label: 'Squad Liste', icon: Users },
  { id: 'injury-tracker' as Page, label: 'Verletzungs-Tracker', icon: PlusCircle },
  { id: 'fitness' as Page, label: 'Fitness Übersicht', icon: BarChart3 },
];

export function Sidebar({ open, onClose, current, onNavigate }: Props) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-60 z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex`}
        style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.svg" alt="Unicorns" style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, lineHeight: 1.3, color: 'var(--text)' }}>
                SCHWÄBISCH HALL<br/>UNICORNS
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, color: '#5CBF8A', marginTop: 2 }}>Medical Dashboard</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-white/10" style={{ color: 'var(--text3)' }}>
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ id, label, icon: Icon }) => {
            const active = current === id;
            return (
              <button
                key={id}
                onClick={() => { onNavigate(id); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={active
                  ? { background: 'var(--team-primary)', color: '#fff' }
                  : { color: 'var(--text2)' }
                }
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs" style={{ color: 'var(--text3)' }}>Season 2026</div>
        </div>
      </aside>
    </>
  );
}
