import { ExerciseSetRecord } from "./ExerciseSetRecord";

export interface WorkoutExercise {
  id: string;
  name: string;
  category: string;
  sets: ExerciseSetRecord[];
}