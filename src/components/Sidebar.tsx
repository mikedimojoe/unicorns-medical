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
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex`}
        style={{ background: '#120B22', borderRight: '1px solid #2D1F4E' }}
      >
        <div className="flex items-center justify-between p-5 pb-4" style={{ borderBottom: '1px solid #2D1F4E' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🦄</span>
              <span className="font-bold text-white text-sm leading-tight">SCHWÄBISCH HALL<br/>UNICORNS</span>
            </div>
            <span className="text-xs" style={{ color: '#D4A017' }}>Medical Dashboard</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-white/10" style={{ color: '#9B8FBF' }}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onNavigate(id); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                current === id ? 'text-white' : 'hover:bg-white/5'
              }`}
              style={current === id
                ? { background: 'linear-gradient(135deg, #5B2D8E, #7B3DB8)', color: '#fff' }
                : { color: '#9B8FBF' }
              }
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid #2D1F4E' }}>
          <div className="text-xs" style={{ color: '#6B5F8F' }}>Season 2026</div>
        </div>
      </aside>
    </>
  );
}
