export interface TrainingSession {
  day: string;
  time: string;
  group: string;
  level: "all";
  locationName?: string;
}

export interface TrainingGroup {
  name: string;
  ageRange: string;
  icon: "youth" | "adults";
  variant: "primary" | "secondary";
  sessions: TrainingSession[];
  note?: string;
}
