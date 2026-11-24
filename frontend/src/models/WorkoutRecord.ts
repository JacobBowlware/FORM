import { WorkoutExercise } from "./WorkoutExercise";
    
export interface WorkoutRecord {
  id: string;
  name: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  bodyWeight?: number;
  notes: string;
  exercises: WorkoutExercise[];
}