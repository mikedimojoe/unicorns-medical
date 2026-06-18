import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Player, Status } from '../data/players';
import { statusColors } from '../data/players';

interface Props {
  players: Player[];
  onPlayerSelect: (p: Player) => void;
}

const shortLabel: Record<Status, string> = {
  'Full Training': 'Fit',
  'Full Training (Monitored)': 'Monitored',
  'Return to Play (Physio/S+C)': 'RTP',
  'Out': 'Out',
};

export function SquadList({ players, onPlayerSelect }: Props) {
  const [search, setSearch] = useState('');
  const [unitFilter, setUnitFilter] = useState<'All' | 'Offense' | 'Defense'>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');

  const filtered = players.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.position.toLowerCase().includes(search.toLowerCase()) ||
      (p.injury || '').toLowerCase().includes(search.toLowerCase());
    const matchUnit = unitFilter === 'All' || p.unit === unitFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchUnit && matchStatus;
  });

  const inputStyle = { background: '#150D24', border: '1px solid #2A1A4A' };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Squad Liste</h1>
        <p className="text-sm mt-1" style={{ color: '#9B8FBF' }}>{players.length} Spieler · Saison 2026</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6A5F8F' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Spieler, Position, Verletzung..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
            style={inputStyle}
          />
        </div>
        <select value={unitFilter} onChange={e => setUnitFilter(e.target.value as 'All' | 'Offense' | 'Defense')}
          className="px-3 py-2.5 rounded-lg text-sm text-white outline-none" style={inputStyle}>
          <option value="All">Alle Einheiten</option>
          <option value="Offense">Offense</option>
          <option value="Defense">Defense</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as Status | 'All')}
          className="px-3 py-2.5 rounded-lg text-sm text-white outline-none" style={inputStyle}>
          <option value="All">Alle Status</option>
          <option value="Full Training">Fit</option>
          <option value="Full Training (Monitored)">Monitored</option>
          <option value="Return to Play (Physio/S+C)">RTP</option>
          <option value="Out">Out</option>
        </select>
      </div>

      <div className="text-xs" style={{ color: '#6A5F8F' }}>{filtered.length} Ergebnisse</div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2A1A4A' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#0E0820' }}>
                {['#', 'Spieler', 'Pos', 'Einheit', 'Status', 'Verletzung', 'ETR'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: '#6A5F8F' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const col = statusColors[p.status];
                return (
                  <tr
                    key={p.id}
                    onClick={() => onPlayerSelect(p)}
                    className="cursor-pointer transition-colors hover:bg-white/5"
                    style={{ borderTop: '1px solid #2A1A4A', background: i % 2 === 0 ? '#150D24' : '#120A20' }}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold" style={{ color: '#F0A500' }}>{p.number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-white">{p.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#2A1A4A', color: '#BB6FFA' }}>{p.position}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: p.unit === 'Offense' ? '#F0A500' : '#7B2DB8' }}>{p.unit}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{shortLabel[p.status]}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="text-xs truncate block" style={{ color: p.injury ? '#9B8FBF' : '#3A2860', maxWidth: 200 }}>
                        {p.injury || '–'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs" style={{ color: '#F0A500' }}>{p.etr || '–'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
