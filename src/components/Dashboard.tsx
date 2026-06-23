import type { Player, Status } from '../data/players';
import { statusColors, statusWeight } from '../data/players';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  players: Player[];
  onPlayerSelect: (p: Player) => void;
}

const STATUS_ORDER: Status[] = ['Full Training', 'Full Training (Monitored)', 'Return to Play (Physio/S+C)', 'Out'];
const SHORT: Record<Status, string> = {
  'Full Training': 'Fit',
  'Full Training (Monitored)': 'Monitored',
  'Return to Play (Physio/S+C)': 'RTP',
  'Out': 'Out',
};
const PIE_COLORS = ['#4CAF82', 'var(--accent)', '#f97316', '#ef4444'];

const card = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 };
const card2 = { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8 };

export function Dashboard({ players, onPlayerSelect }: Props) {
  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = players.filter(p => p.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

  const fitness = (ps: Player[]) => ps.length === 0 ? 0
    : Math.round(ps.reduce((s, p) => s + statusWeight[p.status], 0) / ps.length);

  const offScore = fitness(players.filter(p => p.unit === 'Offense'));
  const defScore = fitness(players.filter(p => p.unit === 'Defense'));

  const pieData = STATUS_ORDER.map(s => ({ name: s, value: counts[s] }));
  const injured = players.filter(p => p.status !== 'Full Training' && p.injury);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Squad Übersicht</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Season 2026 · {players.length} Spieler im Kader</p>
      </div>

      {/* Status cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {STATUS_ORDER.map((s, i) => {
          const col = statusColors[s];
          return (
            <div key={s} style={{ ...card, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className={`text-xs font-medium ${col.text}`}>{SHORT[s]}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: PIE_COLORS[i] }}>{counts[s]}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Spieler</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Pie chart */}
        <div style={{ ...card, padding: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Status Verteilung</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }}
                formatter={(val, name) => [val, SHORT[name as Status] || name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
            {STATUS_ORDER.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>{SHORT[s]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fitness bars */}
        <div style={{ ...card, padding: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Einheitsfitness</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Offense', score: offScore, color: 'var(--accent)', count: players.filter(p => p.unit === 'Offense').length },
              { label: 'Defense', score: defScore, color: 'var(--team-primary)', count: players.filter(p => p.unit === 'Defense').length },
            ].map(({ label, score, color, count }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 4, transition: 'width 0.7s' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{count} Spieler</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
            {(['Offense', 'Defense'] as const).map(unit => {
              const ups = players.filter(p => p.unit === unit);
              return (
                <div key={unit} style={{ ...card2, padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: unit === 'Offense' ? 'var(--accent)' : 'var(--team-primary)' }}>{unit}</div>
                  {[
                    { label: 'Fit', cls: 'text-emerald-400', s: 'Full Training' as Status },
                    { label: 'Mon.', cls: 'text-yellow-400', s: 'Full Training (Monitored)' as Status },
                    { label: 'RTP', cls: 'text-orange-400', s: 'Return to Play (Physio/S+C)' as Status },
                    { label: 'Out', cls: 'text-red-400', s: 'Out' as Status },
                  ].map(({ label, cls, s }) => (
                    <div key={s} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</span>
                      <span className={`text-xs font-medium ${cls}`}>{ups.filter(p => p.status === s).length}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Injured list */}
      <div style={{ ...card, padding: 20 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Aktuelle Verletzungen ({injured.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {injured.map(p => {
            const col = statusColors[p.status];
            return (
              <button key={p.id} onClick={() => onPlayerSelect(p)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                  {p.number}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.injury}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{SHORT[p.status]}</span>
                {p.etr && <span style={{ fontSize: 11, color: 'var(--accent)', flexShrink: 0 }}>↩ {p.etr}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
