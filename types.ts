
export type ActivityType = 'Travel' | 'Food' | 'Sport' | 'Work' | 'Leisure' | 'Social' | 'Nature';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Memory {
  id: string;
  images: string[];
  date: string;
  location: Location;
  activityType: ActivityType;
  description: string;
  title: string;
}

export type ViewMode = 'globe' | 'timeline' | 'stats' | 'gallery';
