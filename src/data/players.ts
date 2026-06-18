export type Status = 'Full Training' | 'Full Training (Monitored)' | 'Return to Play (Physio/S+C)' | 'Out';

export interface InjuryRecord {
  id: string;
  date: string;
  returnDate?: string;
  injury: string;
  notes?: string;
  etr?: string;
  treatment?: string;
}

export interface Player {
  id: number;
  number: number;
  unit: 'Offense' | 'Defense';
  name: string;
  position: string;
  status: Status;
  injury?: string;
  notes?: string;
  etr?: string;
  injuryHistory: InjuryRecord[];
}

export const initialPlayers: Player[] = [
  { id: 0, number: 0, unit: 'Defense', name: 'Daniel Bartmann', position: 'DL', status: 'Full Training', injuryHistory: [] },
  { id: 1, number: 1, unit: 'Defense', name: 'Lukas Levin', position: 'LB', status: 'Full Training (Monitored)', injury: 'bruised thumb', injuryHistory: [] },
  { id: 2, number: 2, unit: 'Offense', name: 'Rayjuon Pringle', position: 'WR', status: 'Full Training', injuryHistory: [] },
  { id: 3, number: 3, unit: 'Offense', name: 'Kelley Joiner', position: 'RB', status: 'Full Training (Monitored)', injury: 'bruised lower back', injuryHistory: [] },
  { id: 4, number: 4, unit: 'Defense', name: 'Tobias Löffler', position: 'OLB', status: 'Out', injury: 'broken toe', etr: '3 weeks', injuryHistory: [] },
  { id: 5, number: 5, unit: 'Offense', name: 'Cem Kahveci', position: 'WR', status: 'Full Training (Monitored)', injury: 'pain in both shoulders after block', injuryHistory: [] },
  { id: 6, number: 6, unit: 'Offense', name: 'Lars Heidrich', position: 'QB', status: 'Full Training (Monitored)', injury: 'bruised shoulder / lower arm pain (Golfer-Ellbogen) / knee pain', injuryHistory: [] },
  { id: 7, number: 7, unit: 'Defense', name: 'Delfio Gourgel da Costa', position: 'S', status: 'Out', injury: 'shoulder Rockwood I', etr: '4 weeks', injuryHistory: [] },
  { id: 8, number: 8, unit: 'Defense', name: 'Samuel Wellbrink', position: 'DL', status: 'Full Training', injuryHistory: [] },
  { id: 9, number: 9, unit: 'Defense', name: 'Julian Mayorga', position: 'DB', status: 'Full Training (Monitored)', injury: 'lower back tightness', injuryHistory: [] },
  { id: 10, number: 11, unit: 'Offense', name: 'Joshua Lang', position: 'WR', status: 'Full Training (Monitored)', injury: 'hamstring pain', injuryHistory: [] },
  { id: 11, number: 13, unit: 'Offense', name: 'Marvin Fuchs', position: 'WR', status: 'Return to Play (Physio/S+C)', injury: 'bone bruise right knee', etr: '6 weeks+', injuryHistory: [] },
  { id: 12, number: 14, unit: 'Defense', name: 'Daniel Arends', position: 'LB', status: 'Full Training (Monitored)', injury: 'adductor pain', injuryHistory: [] },
  { id: 13, number: 15, unit: 'Defense', name: 'Jonell Pelie', position: 'LB', status: 'Full Training', injuryHistory: [] },
  { id: 14, number: 16, unit: 'Offense', name: 'Toni Trefzer', position: 'RB', status: 'Out', injury: 'broken fibula', etr: '4 months+', injuryHistory: [] },
  { id: 15, number: 18, unit: 'Offense', name: 'Luca Arweiler', position: 'WR', status: 'Full Training', injuryHistory: [] },
  { id: 16, number: 19, unit: 'Defense', name: 'Juliano Arguello', position: 'ILB', status: 'Full Training', injuryHistory: [] },
  { id: 17, number: 20, unit: 'Offense', name: 'Erik Häffner', position: 'RB', status: 'Out', injury: 'ankle injury', etr: 'Regensburg', injuryHistory: [] },
  { id: 18, number: 21, unit: 'Defense', name: 'Julian Jakob', position: 'DB', status: 'Full Training', injuryHistory: [] },
  { id: 19, number: 22, unit: 'Offense', name: 'Theo Bendel', position: 'RB', status: 'Return to Play (Physio/S+C)', injury: 'hamstring', injuryHistory: [] },
  { id: 20, number: 23, unit: 'Defense', name: 'Niclas Lux', position: 'CB', status: 'Full Training', injuryHistory: [] },
  { id: 21, number: 24, unit: 'Defense', name: 'Jordan Toles', position: 'DB', status: 'Full Training (Monitored)', injury: 'testicle hematoma', injuryHistory: [] },
  { id: 22, number: 25, unit: 'Offense', name: 'Mathis Harang', position: 'RB', status: 'Full Training', injuryHistory: [] },
  { id: 23, number: 26, unit: 'Defense', name: 'Monteze Latimore', position: 'CB', status: 'Full Training', injuryHistory: [] },
  { id: 24, number: 29, unit: 'Defense', name: 'Samuel Grinfeld', position: 'S', status: 'Full Training', injuryHistory: [] },
  { id: 25, number: 30, unit: 'Offense', name: 'Morris Clarke', position: 'RB', status: 'Out', injury: 'hamstring torn muscle fibre', injuryHistory: [] },
  { id: 26, number: 32, unit: 'Defense', name: 'Manuel Binder', position: 'OLB', status: 'Full Training', injuryHistory: [] },
  { id: 27, number: 33, unit: 'Defense', name: 'Liam Amiri', position: 'S', status: 'Full Training (Monitored)', injury: 'neck pain', notes: 'concussion protocol clear', injuryHistory: [] },
  { id: 28, number: 34, unit: 'Defense', name: 'Jordan Marcellus Taylor', position: 'S', status: 'Full Training', injuryHistory: [] },
  { id: 29, number: 36, unit: 'Defense', name: 'Tom Binder', position: 'DB', status: 'Full Training', injuryHistory: [] },
  { id: 30, number: 37, unit: 'Defense', name: 'Patryk Bigus', position: 'ILB', status: 'Full Training', injuryHistory: [] },
  { id: 31, number: 42, unit: 'Defense', name: 'Nicolas Hühnergarth', position: 'DB', status: 'Full Training', injuryHistory: [] },
  { id: 32, number: 43, unit: 'Defense', name: 'Felix Handloser', position: 'CB', status: 'Full Training', injuryHistory: [] },
  { id: 33, number: 44, unit: 'Defense', name: 'Leo Kunz', position: 'ILB', status: 'Full Training (Monitored)', injury: 'shoulder pain', notes: 'MRI confirmed no damaged structures', injuryHistory: [] },
  { id: 34, number: 45, unit: 'Defense', name: 'Fabian Basic', position: 'ILB', status: 'Full Training', injuryHistory: [] },
  { id: 35, number: 46, unit: 'Offense', name: 'Abdel Sedik', position: 'TE', status: 'Full Training (Monitored)', injury: 'strained hip flexor', injuryHistory: [] },
  { id: 36, number: 48, unit: 'Defense', name: 'Simon Baumgartner', position: 'DL', status: 'Full Training', injuryHistory: [] },
  { id: 37, number: 49, unit: 'Defense', name: 'Steffen Mirsberger', position: 'LB', status: 'Return to Play (Physio/S+C)', injury: 'pulled hamstring', injuryHistory: [] },
  { id: 38, number: 50, unit: 'Defense', name: 'Ben Spieß', position: 'ILB', status: 'Out', injury: 'knee injury', notes: "from last season; don't have any news", injuryHistory: [] },
  { id: 39, number: 51, unit: 'Offense', name: 'Alper Peközer', position: 'OL', status: 'Full Training', injuryHistory: [] },
  { id: 40, number: 52, unit: 'Defense', name: 'Luis Herbert', position: 'OLB', status: 'Full Training', injuryHistory: [] },
  { id: 41, number: 55, unit: 'Defense', name: 'Jacques Johan Fokapen Fokouen', position: 'DL', status: 'Full Training (Monitored)', injury: 'knee pain', injuryHistory: [] },
  { id: 42, number: 56, unit: 'Defense', name: 'Benedikt Lenz', position: 'ILB', status: 'Full Training', injuryHistory: [] },
  { id: 43, number: 57, unit: 'Offense', name: 'Luca Scharf', position: 'OL', status: 'Out', injury: 'ACL rupture, damaged meniscus', etr: '9 months+', injuryHistory: [] },
  { id: 44, number: 59, unit: 'Offense', name: 'Nick Gröne', position: 'OL', status: 'Full Training', injuryHistory: [] },
  { id: 45, number: 64, unit: 'Offense', name: 'Lucas Hürst', position: 'OL', status: 'Full Training', injuryHistory: [] },
  { id: 46, number: 65, unit: 'Offense', name: 'Manuel Jerichow', position: 'OL', status: 'Full Training', injuryHistory: [] },
  { id: 47, number: 68, unit: 'Offense', name: 'Iseah Camara', position: 'OL', status: 'Full Training', injuryHistory: [] },
  { id: 48, number: 69, unit: 'Offense', name: 'Pascal Dürr', position: 'OL', status: 'Out', injury: 'Pubic bone / groin, knee', etr: '6+ weeks', injuryHistory: [] },
  { id: 49, number: 70, unit: 'Defense', name: 'Max Dommermuth', position: 'DL', status: 'Return to Play (Physio/S+C)', injury: 'patella pain', injuryHistory: [] },
  { id: 50, number: 71, unit: 'Offense', name: 'Alexander Lenner', position: 'OL', status: 'Full Training', injuryHistory: [] },
  { id: 51, number: 73, unit: 'Offense', name: 'Marco Fischer', position: 'OL', status: 'Full Training', injuryHistory: [] },
  { id: 52, number: 75, unit: 'Offense', name: 'Jan-Luca Jenner', position: 'OL', status: 'Full Training (Monitored)', injury: 'quad hematoma', injuryHistory: [] },
  { id: 53, number: 76, unit: 'Offense', name: 'Maximillian Gottert', position: 'OL', status: 'Full Training', injuryHistory: [] },
  { id: 54, number: 77, unit: 'Offense', name: 'Jakob Dusel', position: 'OL', status: 'Full Training', injuryHistory: [] },
  { id: 55, number: 80, unit: 'Offense', name: 'Matthias Vogel', position: 'WR', status: 'Out', injury: 'post knee surgery', notes: 'from last season', injuryHistory: [] },
  { id: 56, number: 81, unit: 'Offense', name: 'Emil Rabin', position: 'WR', status: 'Out', injury: 'collarbone fracture', injuryHistory: [] },
  { id: 57, number: 82, unit: 'Offense', name: 'Magnus Bumiller', position: 'WR', status: 'Full Training (Monitored)', injury: 'lower back / hamstrings', injuryHistory: [] },
  { id: 58, number: 84, unit: 'Offense', name: 'Philip Ledina', position: 'WR', status: 'Full Training', injuryHistory: [] },
  { id: 59, number: 85, unit: 'Offense', name: 'Julius Klenk', position: 'WR', status: 'Return to Play (Physio/S+C)', injury: 'hamstring pain', injuryHistory: [] },
  { id: 60, number: 87, unit: 'Offense', name: 'Jimmy Sawang', position: 'WR', status: 'Full Training', injuryHistory: [] },
  { id: 61, number: 88, unit: 'Defense', name: 'Lenno Reinhardt', position: 'OLB', status: 'Return to Play (Physio/S+C)', injury: 'ankle injury // finger bruised', injuryHistory: [] },
  { id: 62, number: 89, unit: 'Offense', name: 'Sebastian Smorczewski', position: 'WR', status: 'Full Training', injuryHistory: [] },
  { id: 63, number: 90, unit: 'Defense', name: 'Valentin Just', position: 'DL', status: 'Full Training (Monitored)', injury: 'knee pain, neck pain', injuryHistory: [] },
  { id: 64, number: 91, unit: 'Defense', name: 'Urs Ludowicy', position: 'DL', status: 'Full Training', injuryHistory: [] },
  { id: 65, number: 92, unit: 'Defense', name: 'Felix Osterheld', position: 'DL', status: 'Full Training', injuryHistory: [] },
  { id: 66, number: 93, unit: 'Defense', name: 'Kaya Camdali', position: 'DL', status: 'Out', injury: 'ankle', notes: "from last season, don't have any news on him", injuryHistory: [] },
  { id: 67, number: 94, unit: 'Defense', name: 'Noah Lorieri', position: 'DL', status: 'Full Training (Monitored)', injury: 'bruised shoulder', injuryHistory: [] },
  { id: 68, number: 95, unit: 'Defense', name: 'Louis Buhl', position: 'DL', status: 'Full Training', injuryHistory: [] },
  { id: 69, number: 96, unit: 'Defense', name: 'Luca Mitrenga', position: 'LB', status: 'Full Training', injuryHistory: [] },
  { id: 70, number: 97, unit: 'Defense', name: 'Cihan Sen', position: 'DL', status: 'Full Training (Monitored)', injury: 'damaged labrum', injuryHistory: [] },
  { id: 71, number: 98, unit: 'Defense', name: 'Pascal Tietze', position: 'DL', status: 'Full Training', injuryHistory: [] },
  { id: 72, number: 99, unit: 'Defense', name: 'Johannes Rust', position: 'DL', status: 'Full Training (Monitored)', injury: 'knee pain / achilles tendon pain', notes: 'should get an MRI', injuryHistory: [] },
  { id: 73, number: 101, unit: 'Offense', name: 'Finn Falk', position: 'QB', status: 'Out', injury: 'post shoulder surgery', injuryHistory: [] },
];

export const statusColors: Record<Status, { bg: string; text: string; dot: string }> = {
  'Full Training': { bg: 'bg-emerald-900/40', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Full Training (Monitored)': { bg: 'bg-yellow-900/40', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  'Return to Play (Physio/S+C)': { bg: 'bg-orange-900/40', text: 'text-orange-400', dot: 'bg-orange-400' },
  'Out': { bg: 'bg-red-900/40', text: 'text-red-400', dot: 'bg-red-400' },
};

export const statusWeight: Record<Status, number> = {
  'Full Training': 100,
  'Full Training (Monitored)': 75,
  'Return to Play (Physio/S+C)': 40,
  'Out': 0,
};
