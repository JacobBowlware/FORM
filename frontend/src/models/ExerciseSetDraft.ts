import { ExerciseSetRecord } from './ExerciseSetRecord';

export interface ExerciseSetDraft extends ExerciseSetRecord {
  previousWeight?: number;
  previousReps?: number;
}
