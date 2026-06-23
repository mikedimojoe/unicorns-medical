import { useState } from 'react';
import type { Player, Status } from '../data/players';
import { statusColors } from '../data/players';
import { analyzeInjury, calculateReturnDate } from '../utils/injuryAI';
import { Brain, AlertTriangle, CheckCircle, Clock, Search } from 'lucide-react';

interface Props {
  players: Player[];
  onUpdate: (updated: Player) => void;
}

const STATUS_OPTIONS: Status[] = ['Full Training', 'Full Training (Monitored)', 'Return to Play (Physio/S+C)', 'Out'];

export function InjuryTracker({ players, onUpdate }: Props) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Player | null>(null);
  const [injuryDate, setInjuryDate] = useState('');
  const [injury, setInjury] = useState('');
  const [etr, setEtr] = useState('');
  const [status, setStatus] = useState<Status>('Out');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const filtered = search.length > 1
    ? players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  function selectPlayer(p: Player) {
    setSelected(p);
    setSearch(p.name);
    setInjury(p.injury || '');
    setEtr(p.etr || '');
    setStatus(p.status);
    setNotes(p.notes || '');
    setSaved(false);
  }

  const aiRec = injury.length > 3 ? analyzeInjury(
    injury,
    selected?.injuryHistory.map(h => h.injury)
  ) : null;

  const returnDate = injuryDate && etr ? calculateReturnDate(injuryDate, etr) : null;
  const severityColor: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };
  const inputStyle = { background: 'var(--bg2)', border: '1px solid var(--border)' };

  function save() {
    if (!selected) return;
    const updated: Player = {
      ...selected,
      status,
      injury: injury || undefined,
      etr: etr || undefined,
      notes: notes || undefined,
      injuryHistory: injuryDate && injury ? [
        ...selected.injuryHistory,
        {
          id: Date.now().toString(),
          date: injuryDate,
          returnDate: returnDate || undefined,
          injury,
          etr: etr || undefined,
          notes: notes || undefined,
        }
      ] : selected.injuryHistory,
    };
    onUpdate(updated);
    setSaved(true);
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Verletzungs-Tracker</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text2)' }}>Neue Verletzung erfassen · KI-Diagnoseunterstützung</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-sm font-semibold text-white">Verletzung erfassen</h2>

          <div className="relative">
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text2)' }}>Spieler suchen</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setSelected(null); setSaved(false); }}
                placeholder="Name eingeben..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                style={inputStyle}
              />
            </div>
            {filtered.length > 0 && !selected && (
              <div className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {filtered.slice(0, 6).map(p => (
                  <button key={p.id} onClick={() => selectPlayer(p)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors">
                    <span className="text-xs font-bold" style={{ color: 'var(--accent)', minWidth: 24 }}>#{p.number}</span>
                    <span className="text-sm text-white">{p.name}</span>
                    <span className="text-xs ml-auto" style={{ color: 'var(--text2)' }}>{p.position}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--team-primary)20', border: '1px solid var(--team-primary)40' }}>
              <span className="font-bold text-sm" style={{ color: 'var(--accent)' }}>#{selected.number}</span>
              <span className="text-sm font-medium text-white">{selected.name}</span>
              <span className="text-xs ml-auto" style={{ color: 'var(--text2)' }}>{selected.position} · {selected.unit}</span>
            </div>
          )}

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text2)' }}>Datum der Verletzung</label>
            <input type="date" value={injuryDate} onChange={e => setInjuryDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text2)' }}>Verletzung / Diagnose</label>
            <input value={injury} onChange={e => { setInjury(e.target.value); setSaved(false); }}
              placeholder="z.B. hamstring strain, broken toe..."
              className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
              style={inputStyle} />
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text2)' }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as Status)}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={inputStyle}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text2)' }}>ETR (Estimated Time to Return)</label>
            <input value={etr} onChange={e => { setEtr(e.target.value); setSaved(false); }}
              placeholder="z.B. 3 weeks, 2 months+"
              className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
              style={inputStyle} />
          </div>

          {returnDate && (
            <div className="flex items-center gap-2 rounded-lg px-3 py-2.5"
              style={{ background: 'var(--accent)20', border: '1px solid var(--accent)40' }}>
              <Clock size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-sm" style={{ color: 'var(--accent)' }}>
                Voraussichtliche Rückkehr: <strong>{new Date(returnDate).toLocaleDateString('de-DE')}</strong>
              </span>
            </div>
          )}

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text2)' }}>Notizen</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Behandlungshinweise, Besonderheiten..."
              className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
              style={inputStyle} />
          </div>

          <button onClick={save} disabled={!selected || !injury}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={saved
              ? { background: '#10b98120', border: '1px solid #10b981' }
              : { background: 'linear-gradient(135deg, var(--team-primary), var(--team-primary))' }}>
            {saved ? '✓ Gespeichert' : 'Verletzung speichern'}
          </button>
        </div>

        <div className="space-y-4">
          {aiRec ? (
            <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Brain size={16} style={{ color: 'var(--text2)' }} /> KI-Diagnoseassistent
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
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
                  <div>
                    <p className="text-xs font-semibold text-orange-400 mb-0.5">MRT EMPFOHLEN</p>
                    <p className="text-xs text-orange-300">{aiRec.mriReason}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text2)' }}>Behandlungsprotokoll</h3>
                <ul className="space-y-2">
                  {aiRec.treatment.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs" style={{ color: '#C4B8E0' }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg p-3" style={{ background: 'var(--bg2)' }}>
                <h3 className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text2)' }}>Return-to-Play</h3>
                <p className="text-xs" style={{ color: '#C4B8E0' }}>{aiRec.returnProtocol}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
              style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}>
              <Brain size={32} style={{ color: 'var(--border)' }} className="mb-3" />
              <p className="text-sm" style={{ color: 'var(--text3)' }}>Gib eine Verletzungsdiagnose ein, um eine KI-Empfehlung zu erhalten</p>
            </div>
          )}

          <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 className="text-sm font-semibold text-white mb-3">Aktuelle Verletzungen</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {players.filter(p => p.injury).map(p => {
                const col = statusColors[p.status];
                return (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg px-3 py-2"
                    style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--accent)', minWidth: 28 }}>#{p.number}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{p.name}</div>
                      <div className="text-xs truncate" style={{ color: 'var(--text2)' }}>{p.injury}</div>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${col.bg} ${col.text} flex-shrink-0`}>
                      {p.status === 'Out' ? 'Out' : p.status === 'Return to Play (Physio/S+C)' ? 'RTP' : 'Mon.'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
