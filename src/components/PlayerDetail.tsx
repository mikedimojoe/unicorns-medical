import { useState } from 'react';
import { ArrowLeft, Brain, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { Player, Status } from '../data/players';
import { statusColors } from '../data/players';
import { analyzeInjury, calculateReturnDate } from '../utils/injuryAI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  player: Player;
  onBack: () => void;
  onUpdate: (updated: Player) => void;
}

const STATUS_OPTIONS: Status[] = ['Full Training', 'Full Training (Monitored)', 'Return to Play (Physio/S+C)', 'Out'];

export function PlayerDetail({ player, onBack, onUpdate }: Props) {
  const [injuryDate, setInjuryDate] = useState('');
  const [newStatus, setNewStatus] = useState<Status>(player.status);
  const [newInjury, setNewInjury] = useState(player.injury || '');
  const [newEtr, setNewEtr] = useState(player.etr || '');
  const [newNotes, setNewNotes] = useState(player.notes || '');

  const col = statusColors[player.status];
  const aiRec = player.injury ? analyzeInjury(
    player.injury,
    player.injuryHistory.map(h => h.injury)
  ) : null;

  const returnDate = injuryDate && player.etr ? calculateReturnDate(injuryDate, player.etr) : null;

  const severityColor: Record<string, string> = {
    low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
  };

  function saveChanges() {
    const updated: Player = {
      ...player,
      status: newStatus,
      injury: newInjury || undefined,
      etr: newEtr || undefined,
      notes: newNotes || undefined,
      injuryHistory: injuryDate && newInjury ? [
        ...player.injuryHistory,
        {
          id: Date.now().toString(),
          date: injuryDate,
          returnDate: returnDate || undefined,
          injury: newInjury,
          etr: newEtr || undefined,
          notes: newNotes || undefined,
        }
      ] : player.injuryHistory,
    };
    onUpdate(updated);
  }

  const historyChartData = player.injuryHistory.map(h => ({
    name: h.date,
    injury: h.injury.slice(0, 20) + (h.injury.length > 20 ? '…' : ''),
    weeks: h.etr ? (parseInt(h.etr) || 1) : 1,
  }));

  const inputStyle = { background: '#0A0614', border: '1px solid #2A1A4A' };

  return (
    <div className="p-6 space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: '#9B8FBF' }}>
        <ArrowLeft size={16} /> Zurück
      </button>

      <div className="rounded-xl p-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #150D24, #1C1036)', border: '1px solid #2A1A4A' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #5D1A8B, #F0A500)', color: '#fff' }}>
          {player.number}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{player.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#2A1A4A', color: '#BB6FFA' }}>{player.position}</span>
            <span className="text-xs" style={{ color: player.unit === 'Offense' ? '#F0A500' : '#7B2DB8' }}>{player.unit}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{player.status}</span>
          </div>
          {player.injury && <p className="text-sm mt-2" style={{ color: '#9B8FBF' }}>🤕 {player.injury}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl p-5 space-y-4" style={{ background: '#150D24', border: '1px solid #2A1A4A' }}>
          <h2 className="text-sm font-semibold text-white">Status aktualisieren</h2>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9B8FBF' }}>Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value as Status)}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={inputStyle}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9B8FBF' }}>Verletzung / Diagnose</label>
            <input value={newInjury} onChange={e => setNewInjury(e.target.value)}
              placeholder="z.B. hamstring strain"
              className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none" style={inputStyle} />
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9B8FBF' }}>Datum der Verletzung</label>
            <input type="date" value={injuryDate} onChange={e => setInjuryDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9B8FBF' }}>ETR (Estimated Time to Return)</label>
            <input value={newEtr} onChange={e => setNewEtr(e.target.value)}
              placeholder="z.B. 3 weeks, 2 months+"
              className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none" style={inputStyle} />
          </div>

          {returnDate && (
            <div className="flex items-center gap-2 rounded-lg px-3 py-2.5"
              style={{ background: '#F0A50020', border: '1px solid #F0A50040' }}>
              <Clock size={14} style={{ color: '#F0A500' }} />
              <span className="text-sm" style={{ color: '#F0A500' }}>
                Voraussichtliche Rückkehr: <strong>{new Date(returnDate).toLocaleDateString('de-DE')}</strong>
              </span>
            </div>
          )}

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: '#9B8FBF' }}>Notizen</label>
            <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
              style={inputStyle} />
          </div>

          <button onClick={saveChanges}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #5D1A8B, #7B2DB8)' }}>
            Speichern
          </button>
        </div>

        {aiRec && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: '#150D24', border: '1px solid #2A1A4A' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Brain size={16} style={{ color: '#BB6FFA' }} /> KI-Analyse
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: severityColor[aiRec.severity] + '20', color: severityColor[aiRec.severity] }}>
                {aiRec.severity.toUpperCase()}
              </span>
            </div>

            {aiRec.warning && (
              <div className="flex gap-2 rounded-lg p-3" style={{ background: '#ef444420', border: '1px solid #ef444440' }}>
                <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{aiRec.warning}</p>
              </div>
            )}

            {aiRec.mriRecommended && (
              <div className="flex gap-2 rounded-lg p-3" style={{ background: '#f9741620', border: '1px solid #f9741640' }}>
                <AlertTriangle size={15} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-300">{aiRec.mriReason}</p>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold mb-2" style={{ color: '#9B8FBF' }}>Behandlungsempfehlung</h3>
              <ul className="space-y-1.5">
                {aiRec.treatment.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs" style={{ color: '#C4B8E0' }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold mb-2" style={{ color: '#9B8FBF' }}>Return-to-Play Protokoll</h3>
              <p className="text-xs" style={{ color: '#C4B8E0' }}>{aiRec.returnProtocol}</p>
            </div>
          </div>
        )}
      </div>

      {player.injuryHistory.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: '#150D24', border: '1px solid #2A1A4A' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Verletzungshistorie</h2>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={historyChartData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: '#9B8FBF' }} />
              <Tooltip
                contentStyle={{ background: '#150D24', border: '1px solid #2A1A4A', borderRadius: 8, color: '#fff', fontSize: 11 }}
                formatter={(_val, _name, props) => [props.payload.injury, 'Verletzung']}
              />
              <Bar dataKey="weeks" radius={4}>
                {historyChartData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? '#5D1A8B' : '#F0A500'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {player.injuryHistory.map(h => (
              <div key={h.id} className="rounded-lg px-3 py-2.5 flex items-start gap-3"
                style={{ background: '#0A0614', border: '1px solid #2A1A4A' }}>
                <div className="text-xs min-w-20" style={{ color: '#6A5F8F' }}>
                  {new Date(h.date).toLocaleDateString('de-DE')}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{h.injury}</div>
                  {h.returnDate && (
                    <div className="text-xs mt-0.5" style={{ color: '#F0A500' }}>
                      Rückkehr: {new Date(h.returnDate).toLocaleDateString('de-DE')}
                    </div>
                  )}
                  {h.notes && <div className="text-xs mt-0.5" style={{ color: '#9B8FBF' }}>{h.notes}</div>}
                </div>
                {h.etr && <div className="text-xs flex-shrink-0" style={{ color: '#9B8FBF' }}>ETR: {h.etr}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
