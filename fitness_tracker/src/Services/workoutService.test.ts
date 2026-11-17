import { getWorkouts, saveWorkout } from './workoutService';
import { WorkoutRecord } from '../Models/WorkoutRecord';

beforeEach(() => {
  localStorage.clear();
});

test('returns an empty list when no workouts have been saved', async () => {
  await expect(getWorkouts()).resolves.toEqual([]);
});

test('saves workouts locally and returns them newest first', async () => {
  const workout: WorkoutRecord = {
    id: 'workout-1',
    name: 'Upper body',
    startedAt: '2026-11-14T10:00:00.000Z',
    endedAt: '2026-11-14T10:45:00.000Z',
    durationMinutes: 45,
    notes: '',
    exercises: [],
  };

  await expect(saveWorkout(workout)).resolves.toEqual(workout);
  await expect(getWorkouts()).resolves.toEqual([workout]);
});
