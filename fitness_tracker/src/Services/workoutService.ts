import { WorkoutExercise } from '../Models/WorkoutExercise';
import { WorkoutRecord } from '../Models/WorkoutRecord';

const WORKOUTS_STORAGE_KEY = 'fitness-tracker-workouts';

export const getWorkouts = async (): Promise<WorkoutRecord[]> => {
  const savedWorkouts = localStorage.getItem(WORKOUTS_STORAGE_KEY);
  return savedWorkouts ? (JSON.parse(savedWorkouts) as WorkoutRecord[]) : [];
};

export const getWorkoutById = async (id: string): Promise<WorkoutRecord | undefined> => {
  const workouts = await getWorkouts();
  return workouts.find((workout) => workout.id === id);
}

export const saveWorkout = async (workout: WorkoutRecord): Promise<WorkoutRecord> => {
  const workouts = await getWorkouts();
  localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify([workout, ...workouts]));
  return workout;
};

export const getMostRecentExercise = async (
  name: string
): Promise<WorkoutExercise | undefined> => {
  const workouts = await getWorkouts();
  const newestFirst = [...workouts].sort(
    (first, second) =>
      new Date(second.endedAt).getTime() - new Date(first.endedAt).getTime()
  );
  for (const workout of newestFirst) {
    const exercise = workout.exercises.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    if (exercise) {
      return exercise;
    }
  }
  return undefined;
};
