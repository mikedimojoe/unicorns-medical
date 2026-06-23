import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Player, Status } from '../data/players';
import { statusColors } from '../data/players';

interface Props {
  players: Player[];
  onPlayerSelect: (p: Player) => void;
}

const SHORT: Record<Status, string> = {
  'Full Training': 'Fit',
  'Full Training (Monitored)': 'Monitored',
  'Return to Play (Physio/S+C)': 'RTP',
  'Out': 'Out',
};

const inputStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  padding: '8px 12px',
  fontSize: 13,
  outline: 'none',
  width: '100%',
};

export function SquadList({ players, onPlayerSelect }: Props) {
  const [search, setSearch] = useState('');
  const [unitFilter, setUnitFilter] = useState<'All' | 'Offense' | 'Defense'>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');

  const filtered = players.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.position.toLowerCase().includes(q) || (p.injury || '').toLowerCase().includes(q);
    return matchSearch && (unitFilter === 'All' || p.unit === unitFilter) && (statusFilter === 'All' || p.status === statusFilter);
  });

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Squad Liste</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>{players.length} Spieler · Saison 2026</p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Spieler, Position, Verletzung..."
            style={{ ...inputStyle, paddingLeft: 32 }}
          />
        </div>
        <select value={unitFilter} onChange={e => setUnitFilter(e.target.value as any)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="All">Alle Einheiten</option>
          <option value="Offense">Offense</option>
          <option value="Defense">Defense</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="All">Alle Status</option>
          <option value="Full Training">Fit</option>
          <option value="Full Training (Monitored)">Monitored</option>
          <option value="Return to Play (Physio/S+C)">RTP</option>
          <option value="Out">Out</option>
        </select>
      </div>

      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{filtered.length} Ergebnisse</div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg2)' }}>
                {['#', 'Spieler', 'Pos', 'Einheit', 'Status', 'Verletzung', 'ETR'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const col = statusColors[p.status];
                return (
                  <tr key={p.id} onClick={() => onPlayerSelect(p)} style={{ borderTop: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{p.number}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>{p.name}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: 'var(--surface2)', color: 'var(--text2)' }}>{p.position}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: 12, color: p.unit === 'Offense' ? 'var(--accent)' : 'var(--team-primary)' }}>{p.unit}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{SHORT[p.status]}</span>
                    </td>
                    <td style={{ padding: '10px 14px', maxWidth: 240 }}>
                      <span style={{ fontSize: 12, color: p.injury ? 'var(--text3)' : 'var(--border)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {p.injury || '–'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: 12, color: 'var(--accent)' }}>{p.etr || '–'}</span>
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
