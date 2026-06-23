import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SquadList } from './components/SquadList';
import { PlayerDetail } from './components/PlayerDetail';
import { InjuryTracker } from './components/InjuryTracker';
import { FitnessOverview } from './components/FitnessOverview';
import { initialPlayers } from './data/players';
import type { Player } from './data/players';

type Page = 'dashboard' | 'squad' | 'player' | 'injury-tracker' | 'fitness';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState<Page>('dashboard');
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  function updatePlayer(updated: Player) {
    setPlayers(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (selectedPlayer?.id === updated.id) setSelectedPlayer(updated);
  }

  function handlePlayerSelect(p: Player) {
    setSelectedPlayer(p);
    setPage('player');
  }

  function navigate(p: Page) {
    if (p !== 'player') setSelectedPlayer(null);
    setPage(p);
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg2)' }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        current={page === 'player' ? 'squad' : page}
        onNavigate={navigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 px-5 py-3 flex-shrink-0 lg:hidden"
          style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text2)' }}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🦄</span>
            <span className="font-semibold text-white text-sm">Unicorns Medical</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {page === 'dashboard' && (
            <Dashboard players={players} onPlayerSelect={handlePlayerSelect} />
          )}
          {page === 'squad' && (
            <SquadList players={players} onPlayerSelect={handlePlayerSelect} />
          )}
          {page === 'player' && selectedPlayer && (
            <PlayerDetail
              player={selectedPlayer}
              onBack={() => setPage('squad')}
              onUpdate={updatePlayer}
            />
          )}
          {page === 'injury-tracker' && (
            <InjuryTracker players={players} onUpdate={updatePlayer} />
          )}
          {page === 'fitness' && (
            <FitnessOverview players={players} onPlayerSelect={handlePlayerSelect} />
          )}
        </main>
      </div>
    </div>
  );
}
