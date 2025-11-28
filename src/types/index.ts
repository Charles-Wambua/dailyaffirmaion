export interface Affirmation {
  id: string;
  text: string;
  category: string;
  isFavorite: boolean;
  createdAt: Date;
}

export interface AppState {
  affirmations: Affirmation[];
  favorites: string[];
  dailyAffirmation: Affirmation | null;
}