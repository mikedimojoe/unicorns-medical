import type { Player, Status } from '../data/players';
import { statusColors, statusWeight } from '../data/players';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  players: Player[];
  onPlayerSelect: (p: Player) => void;
}

const STATUS_ORDER: Status[] = ['Full Training', 'Full Training (Monitored)', 'Return to Play (Physio/S+C)', 'Out'];

export function Dashboard({ players, onPlayerSelect }: Props) {
  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = players.filter(p => p.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

  const offensePlayers = players.filter(p => p.unit === 'Offense');
  const defensePlayers = players.filter(p => p.unit === 'Defense');

  const fitnessScore = (ps: Player[]) => {
    if (ps.length === 0) return 0;
    return Math.round(ps.reduce((sum, p) => sum + statusWeight[p.status], 0) / ps.length);
  };

  const pieData = STATUS_ORDER.map(s => ({ name: s, value: counts[s] }));
  const COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

  const shortLabel: Record<Status, string> = {
    'Full Training': 'Fit',
    'Full Training (Monitored)': 'Monitored',
    'Return to Play (Physio/S+C)': 'RTP',
    'Out': 'Out',
  };

  const recentInjured = players.filter(p => p.status !== 'Full Training' && p.injury);
  const offScore = fitnessScore(offensePlayers);
  const defScore = fitnessScore(defensePlayers);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Squad Übersicht</h1>
        <p style={{ color: '#9B8FBF' }} className="text-sm mt-1">Season 2026 · {players.length} Spieler im Kader</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUS_ORDER.map((s) => {
          const col = statusColors[s];
          return (
            <div key={s} className={`rounded-xl p-4 ${col.bg}`} style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className={`text-xs font-medium ${col.text}`}>{shortLabel[s]}</span>
              </div>
              <div className="text-3xl font-bold text-white">{counts[s]}</div>
              <div className="text-xs mt-1" style={{ color: '#9B8FBF' }}>Spieler</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{ background: '#150D24', border: '1px solid #2A1A4A' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Status Verteilung</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#150D24', border: '1px solid #2A1A4A', borderRadius: 8, color: '#fff', fontSize: 12 }}
                formatter={(val, name) => [val, shortLabel[name as Status] || name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {STATUS_ORDER.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-xs" style={{ color: '#9B8FBF' }}>{shortLabel[s]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#150D24', border: '1px solid #2A1A4A' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Einheitsfitness</h2>
          <div className="space-y-5">
            {[
              { label: 'Offense', score: offScore, count: offensePlayers.length, color: '#F0A500' },
              { label: 'Defense', score: defScore, count: defensePlayers.length, color: '#5D1A8B' },
            ].map(({ label, score, count, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-white">{label}</span>
                  <span className="text-sm font-bold" style={{ color }}>{score}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: '#2A1A4A' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
                </div>
                <div className="text-xs mt-1" style={{ color: '#6A5F8F' }}>{count} Spieler</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {(['Offense', 'Defense'] as const).map(unit => {
              const ups = players.filter(p => p.unit === unit);
              return (
                <div key={unit} className="rounded-lg p-3" style={{ background: '#0A0614' }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: unit === 'Offense' ? '#F0A500' : '#7B2DB8' }}>{unit}</div>
                  <div className="text-xs space-y-1" style={{ color: '#9B8FBF' }}>
                    <div className="flex justify-between"><span>Fit:</span><span className="text-emerald-400">{ups.filter(p => p.status === 'Full Training').length}</span></div>
                    <div className="flex justify-between"><span>Mon.:</span><span className="text-yellow-400">{ups.filter(p => p.status === 'Full Training (Monitored)').length}</span></div>
                    <div className="flex justify-between"><span>RTP:</span><span className="text-orange-400">{ups.filter(p => p.status === 'Return to Play (Physio/S+C)').length}</span></div>
                    <div className="flex justify-between"><span>Out:</span><span className="text-red-400">{ups.filter(p => p.status === 'Out').length}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: '#150D24', border: '1px solid #2A1A4A' }}>
        <h2 className="text-sm font-semibold text-white mb-4">Aktuelle Verletzungen ({recentInjured.length})</h2>
        <div className="space-y-2">
          {recentInjured.map(p => {
            const col = statusColors[p.status];
            return (
              <button
                key={p.id}
                onClick={() => onPlayerSelect(p)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-white/5"
                style={{ border: '1px solid #2A1A4A' }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: '#2A1A4A', color: '#F0A500' }}>
                  {p.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{p.name}</div>
                  <div className="text-xs truncate" style={{ color: '#9B8FBF' }}>{p.injury}</div>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded-full ${col.bg} ${col.text} flex-shrink-0`}>
                  {p.status === 'Full Training (Monitored)' ? 'Monitored' : p.status === 'Return to Play (Physio/S+C)' ? 'RTP' : p.status}
                </div>
                {p.etr && <div className="text-xs flex-shrink-0" style={{ color: '#F0A500' }}>↩ {p.etr}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
