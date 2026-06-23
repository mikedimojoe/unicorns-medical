import type { Player, Status } from '../data/players';
import { statusWeight, statusColors } from '../data/players';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

interface Props {
  players: Player[];
  onPlayerSelect: (p: Player) => void;
}

const POSITION_GROUPS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'ILB', 'OLB', 'DB', 'CB', 'S'] as const;

function avgFitness(ps: Player[]): number {
  if (ps.length === 0) return 0;
  return Math.round(ps.reduce((s, p) => s + statusWeight[p.status], 0) / ps.length);
}

function statusCount(ps: Player[], s: Status) {
  return ps.filter(p => p.status === s).length;
}

interface PosData {
  position: string;
  fitness: number;
  count: number;
  out: number;
  rtp: number;
  monitored: number;
  fit: number;
}

export function FitnessOverview({ players, onPlayerSelect }: Props) {
  const offense = players.filter(p => p.unit === 'Offense');
  const defense = players.filter(p => p.unit === 'Defense');

  const positionData: PosData[] = POSITION_GROUPS
    .reduce<PosData[]>((acc, pos) => {
      const posPlayers = players.filter(p => p.position === pos);
      if (posPlayers.length === 0) return acc;
      acc.push({
        position: pos,
        fitness: avgFitness(posPlayers),
        count: posPlayers.length,
        out: statusCount(posPlayers, 'Out'),
        rtp: statusCount(posPlayers, 'Return to Play (Physio/S+C)'),
        monitored: statusCount(posPlayers, 'Full Training (Monitored)'),
        fit: statusCount(posPlayers, 'Full Training'),
      });
      return acc;
    }, []);

  const radarData = [
    { subject: 'Offense', value: avgFitness(offense) },
    { subject: 'Defense', value: avgFitness(defense) },
    { subject: 'QB', value: avgFitness(players.filter(p => p.position === 'QB')) },
    { subject: 'RB', value: avgFitness(players.filter(p => p.position === 'RB')) },
    { subject: 'WR', value: avgFitness(players.filter(p => p.position === 'WR')) },
    { subject: 'OL', value: avgFitness(players.filter(p => p.position === 'OL')) },
    { subject: 'DL', value: avgFitness(players.filter(p => p.position === 'DL')) },
    { subject: 'LB', value: avgFitness(players.filter(p => ['LB', 'ILB', 'OLB'].includes(p.position))) },
    { subject: 'DB', value: avgFitness(players.filter(p => ['DB', 'CB', 'S'].includes(p.position))) },
  ];

  const offScore = avgFitness(offense);
  const defScore = avgFitness(defense);

  function fitnessColor(val: number) {
    if (val >= 80) return '#10b981';
    if (val >= 60) return '#f59e0b';
    if (val >= 40) return '#f97316';
    return '#ef4444';
  }

  const bottomPlayers = [...players]
    .sort((a, b) => statusWeight[a.status] - statusWeight[b.status])
    .slice(0, 8)
    .filter(p => p.status !== 'Full Training');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Fitness-Übersicht</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>Kaderfitness nach Einheit und Positionsgruppe</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Offense Fitness', score: offScore, color: 'var(--accent)', count: offense.length },
          { label: 'Defense Fitness', score: defScore, color: 'var(--team-primary)', count: defense.length },
        ].map(({ label, score, color, count }) => (
          <div key={label} className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-sm font-semibold text-white mb-3">{label}</div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-bold" style={{ color }}>{score}</span>
              <span className="text-lg pb-1" style={{ color: 'var(--text3)' }}>/ 100</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
            </div>
            <div className="text-xs" style={{ color: 'var(--text3)' }}>{count} Spieler</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Fitness nach Position</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={positionData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text2)' }} />
              <YAxis type="category" dataKey="position" width={35} tick={{ fontSize: 11, fill: 'var(--text2)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: '#fff', fontSize: 11 }}
                formatter={(val) => [`${val}%`, 'Fitness']}
              />
              <Bar dataKey="fitness" radius={4} maxBarSize={16}>
                {positionData.map((d, i) => (
                  <Cell key={i} fill={fitnessColor(d.fitness)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Fitness Radar</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text2)' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar dataKey="value" stroke="var(--team-primary)" fill="var(--team-primary)" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">Positionsgruppen Detail</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {positionData.map(d => (
            <div key={d.position} className="rounded-lg p-3" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: 'var(--text2)' }}>{d.position}</span>
                <span className="text-sm font-bold" style={{ color: fitnessColor(d.fitness) }}>{d.fitness}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: `${d.fitness}%`, background: fitnessColor(d.fitness) }} />
              </div>
              <div className="text-xs space-y-0.5" style={{ color: 'var(--text3)' }}>
                <div className="flex justify-between"><span>Fit</span><span className="text-emerald-400">{d.fit}</span></div>
                {d.monitored > 0 && <div className="flex justify-between"><span>Mon.</span><span className="text-yellow-400">{d.monitored}</span></div>}
                {d.rtp > 0 && <div className="flex justify-between"><span>RTP</span><span className="text-orange-400">{d.rtp}</span></div>}
                {d.out > 0 && <div className="flex justify-between"><span>Out</span><span className="text-red-400">{d.out}</span></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {bottomPlayers.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Verletzt / Eingeschränkt</h2>
          <div className="space-y-2">
            {bottomPlayers.map(p => {
              const col = statusColors[p.status];
              return (
                <button key={p.id} onClick={() => onPlayerSelect(p)}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
                  style={{ border: '1px solid var(--border)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'var(--border)', color: 'var(--accent)' }}>
                    {p.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{p.name}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--text2)' }}>{p.injury || p.status}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${col.bg} ${col.text} flex-shrink-0`}>{p.position}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: fitnessColor(statusWeight[p.status]) }}>
                    {statusWeight[p.status]}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
