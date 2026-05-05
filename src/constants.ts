export const STATUSES = [
  'Idea',
  'Pianificazione',
  'In corso',
  'In revisione',
  'Completato',
  'Bloccato',
  'Sospeso',
  'Annullato',
  'Fallito'
] as const;

export type AppStatus = typeof STATUSES[number];
