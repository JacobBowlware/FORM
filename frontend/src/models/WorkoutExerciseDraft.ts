import {ExerciseSetDraft} from "./ExerciseSetDraft";
import {ExerciseSetRecord} from "./ExerciseSetRecord";
import {WorkoutExercise} from "./WorkoutExercise";

export interface WorkoutExerciseDraft extends Omit<WorkoutExercise, 'sets'> {
  sets: ExerciseSetDraft[];
  previousSets: ExerciseSetRecord[];
}