export interface AIRecommendation {
  severity: 'low' | 'medium' | 'high' | 'critical';
  mriRecommended: boolean;
  mriReason?: string;
  treatment: string[];
  returnProtocol: string;
  warning?: string;
}

const injuryKeywords = {
  mriTriggers: ['ACL', 'meniscus', 'rupture', 'torn', 'tear', 'labrum', 'rockwood', 'bone bruise', 'fracture', 'broken', 'damaged', 'knee pain', 'achilles', 'patella', 'collarbone', 'fibula'],
  highSeverity: ['ACL', 'rupture', 'torn muscle', 'fracture', 'broken fibula', 'collarbone', 'bone bruise', 'meniscus', 'surgery', 'rockwood'],
  medSeverity: ['hamstring', 'pulled', 'ankle', 'shoulder', 'groin', 'pubic bone', 'labrum', 'patella', 'adductor', 'knee'],
  lowSeverity: ['bruised', 'pain', 'tightness', 'hematoma', 'strained', 'neck pain', 'back'],
};

function detectSeverity(injury: string): AIRecommendation['severity'] {
  const lower = injury.toLowerCase();
  if (injuryKeywords.highSeverity.some(k => lower.includes(k.toLowerCase()))) return 'high';
  if (lower.includes('post') && lower.includes('surgery')) return 'critical';
  if (injuryKeywords.medSeverity.some(k => lower.includes(k.toLowerCase()))) return 'medium';
  return 'low';
}

function needsMRI(injury: string): { needed: boolean; reason?: string } {
  const lower = injury.toLowerCase();
  for (const trigger of injuryKeywords.mriTriggers) {
    if (lower.includes(trigger.toLowerCase())) {
      return {
        needed: true,
        reason: `MRI empfohlen wegen "${trigger}" – strukturelle Schäden müssen ausgeschlossen werden.`,
      };
    }
  }
  return { needed: false };
}

const treatmentProtocols: Record<string, string[]> = {
  hamstring: ['RICE-Protokoll erste 48h', 'Physiotherapie: exzentrisches Training', 'Ischio-Crurale Kräftigung', 'Return-to-Run Protokoll nach Schmerzfreiheit'],
  shoulder: ['Rotatorenmanschette-Übungen', 'Stabilisierungstraining', 'Schonung bei Überkopfbewegungen', 'Entzündungshemmer ggf. nach Arztabsprache'],
  knee: ['Quadrizeps-Kräftigung', 'Schwellung beobachten', 'Belastung schrittweise steigern', 'MRT bei anhaltenden Schmerzen'],
  ankle: ['RICE-Protokoll', 'Tape/Bandage', 'Propriozeptionstraining', 'Stabilisierungsübungen'],
  back: ['Mobilisationsübungen', 'Core-Stability', 'Wärmebehandlung', 'Belastungssteuerung beim Training'],
  fracture: ['Ruhigstellung', 'Regelmäßige Röntgenkontrolle', 'Osteotrophil / Vitamin D', 'Schrittweise Belastungsaufnahme nach Heilung'],
  default: ['Physiotherapeutische Begleitung', 'Belastungssteuerung', 'Entzündungshemmende Maßnahmen', 'Tägliche Statuserhebung'],
};

function getTreatment(injury: string): string[] {
  const lower = injury.toLowerCase();
  if (lower.includes('hamstring')) return treatmentProtocols.hamstring;
  if (lower.includes('shoulder') || lower.includes('schulter')) return treatmentProtocols.shoulder;
  if (lower.includes('knee') || lower.includes('knie') || lower.includes('patella') || lower.includes('ACL') || lower.includes('meniscus')) return treatmentProtocols.knee;
  if (lower.includes('ankle') || lower.includes('fibula')) return treatmentProtocols.ankle;
  if (lower.includes('back') || lower.includes('rücken')) return treatmentProtocols.back;
  if (lower.includes('fracture') || lower.includes('broken') || lower.includes('collarbone')) return treatmentProtocols.fracture;
  return treatmentProtocols.default;
}

function getReturnProtocol(severity: AIRecommendation['severity']): string {
  switch (severity) {
    case 'critical': return 'Keine Rückkehr ohne ärztliche Freigabe + vollständiges Return-to-Play Protokoll (6 Stufen)';
    case 'high': return 'Stufenweiser Return: Physio → S&C → Individualtraining → Teamtraining (Monitored) → Volltraining';
    case 'medium': return 'Return-to-Play mit Monitoring: Belastungsaufbau über 1–2 Wochen, Statuserhebung täglich';
    case 'low': return 'Training mit Einschränkungen möglich; tägliche Rücksprache mit Medical Staff';
  }
}

export function analyzeInjury(injury: string, pastInjuries?: string[]): AIRecommendation {
  const severity = detectSeverity(injury);
  const mri = needsMRI(injury);
  const treatment = getTreatment(injury);

  let warning: string | undefined;
  if (pastInjuries && pastInjuries.length > 0) {
    const lower = injury.toLowerCase();
    const similar = pastInjuries.find(p => {
      const pl = p.toLowerCase();
      return (
        (lower.includes('hamstring') && pl.includes('hamstring')) ||
        (lower.includes('shoulder') && pl.includes('shoulder')) ||
        (lower.includes('knee') && pl.includes('knee')) ||
        (lower.includes('ankle') && pl.includes('ankle')) ||
        (lower.includes('back') && pl.includes('back'))
      );
    });
    if (similar) {
      warning = `⚠️ Rezidiv-Risiko: Ähnliche Verletzung bereits in der Historie (${similar}). Erweiterte Physiotherapie und langsamere Belastungssteigerung empfehlen!`;
    }
  }

  return {
    severity,
    mriRecommended: mri.needed,
    mriReason: mri.reason,
    treatment,
    returnProtocol: getReturnProtocol(severity),
    warning,
  };
}

export function calculateReturnDate(injuryDate: string, etr: string): string | null {
  const base = new Date(injuryDate);
  if (isNaN(base.getTime())) return null;

  const lower = etr.toLowerCase().trim();

  const weeksMatch = lower.match(/(\d+)\s*week/);
  const monthsMatch = lower.match(/(\d+)\s*month/);

  if (weeksMatch) {
    base.setDate(base.getDate() + parseInt(weeksMatch[1]) * 7);
    return base.toISOString().split('T')[0];
  }
  if (monthsMatch) {
    base.setMonth(base.getMonth() + parseInt(monthsMatch[1]));
    return base.toISOString().split('T')[0];
  }
  return null;
}
