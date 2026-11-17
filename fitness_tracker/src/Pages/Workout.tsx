import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Exercise from '../Components/Exercise';
import { WorkoutExerciseDraft } from '../Models/WorkoutExerciseDraft';
import {
  getMostRecentExercise,
  saveWorkout
} from '../Services/workoutService';

const exerciseCatalog: Record<string, string[]> = {
  Chest: ['Bench press', 'Incline dumbbell press', 'Chest fly', 'Push-up'],
  Back: ['Deadlift', 'Lat pulldown', 'Barbell row', 'Seated cable row'],
  Legs: ['Squat', 'Romanian deadlift', 'Leg press', 'Walking lunge'],
  Shoulders: ['Overhead press', 'Lateral raise', 'Face pull', 'Rear delt fly'],
  Arms: ['Bicep curl', 'Hammer curl', 'Triceps pushdown', 'Skull crusher'],
  Core: ['Plank', 'Cable crunch', 'Hanging leg raise', 'Russian twist'],
};

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const Workout = () => {
  const navigate = useNavigate();
  const [startedAt] = useState(() => new Date());
  const [workoutName, setWorkoutName] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('Chest');
  const [exerciseName, setExerciseName] = useState(exerciseCatalog.Chest[0]);
  const [customName, setCustomName] = useState('');
  const [exercises, setExercises] = useState<WorkoutExerciseDraft[]>([]);
  const [error, setError] = useState('');

  const addExercise = async (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Enter an exercise name before adding it.');
      return;
    }
    if (exercises.some((exercise) => exercise.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('That exercise is already in this workout.');
      return;
    }

    try {
      const previousExercise = await getMostRecentExercise(trimmedName);
      const previousSets = previousExercise?.sets ?? [];
      const sets = previousSets.length
        ? previousSets.map((set) => ({
            id: createId(),
            weight: null,
            reps: null,
            ...(set.weight !== null ? { previousWeight: set.weight } : {}),
            ...(set.reps !== null ? { previousReps: set.reps } : {}),
          }))
        : [{ id: createId(), weight: null, reps: null }];
      setExercises((current) => [
        ...current,
        {
          id: createId(),
          name: trimmedName,
          category,
          sets,
          previousSets,
        },
      ]);
      setError('');
      setCustomName('');
    } catch {
      setError('Previous exercise data could not be loaded from the server.');
    }
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'weight' | 'reps',
    value: number | null
  ) => {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
    );
  };

  const addSet = (exerciseId: string) => {
    setExercises((current) =>
      current.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        const previousSet = exercise.previousSets[exercise.sets.length];
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: createId(),
              weight: null,
              reps: null,
              ...(previousSet?.weight !== null && previousSet?.weight !== undefined
                ? { previousWeight: previousSet.weight }
                : {}),
              ...(previousSet?.reps !== null && previousSet?.reps !== undefined
                ? { previousReps: previousSet.reps }
                : {}),
            },
          ],
        };
      })
    );
  };

  const finishWorkout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!exercises.length) {
      setError('Add at least one exercise before finishing your workout.');
      return;
    }

    const endedAt = new Date();
    const durationMinutes = Math.max(
      1,
      Math.round((endedAt.getTime() - startedAt.getTime()) / 60000)
    );
    try {
      await saveWorkout({
        id: createId(),
        name: workoutName.trim() || `${category} day`,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        durationMinutes,
        ...(bodyWeight ? { bodyWeight: Number(bodyWeight) } : {}),
        notes: notes.trim(),
        exercises: exercises.map(({ previousSets, ...exercise }) => ({
          ...exercise,
          sets: exercise.sets.map(({ previousWeight, previousReps, ...set }) => set),
        })),
      });
      navigate('/');
    } catch {
      setError('Your workout could not be saved. Check your connection and try again.');
    }
  };

  return (
    <main className="workout-page page-shell">
      <Link to="/" className="back-link">← Dashboard</Link>
      <div className="workout-title-row">
        <div>
          <p className="eyebrow">SESSION</p>
          <h1>Active workout</h1>
          <p className="muted-copy">Started {startedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
        </div>
        <span className="live-indicator"><i /> IN PROGRESS</span>
      </div>

      <form onSubmit={finishWorkout}>
        <section className="panel workout-details">
          <div className="panel-heading">
            <div><p className="eyebrow">SESSION DETAILS</p><h2>Set the context</h2></div>
          </div>
          <div className="details-grid">
            <label className="form-field">
              <span>Workout name</span>
              <input
                onChange={(event) => setWorkoutName(event.target.value)}
                placeholder="e.g. Upper body"
                value={workoutName}
              />
            </label>
            <label className="form-field">
              <span>Body weight <small>kg</small></span>
              <input
                min="0"
                onChange={(event) => setBodyWeight(event.target.value)}
                placeholder="Optional"
                type="number"
                value={bodyWeight}
              />
            </label>
            <label className="form-field form-field-wide">
              <span>Session notes</span>
              <textarea
                onChange={(event) => setNotes(event.target.value)}
                placeholder="How are you feeling? Anything to remember?"
                rows={2}
                value={notes}
              />
            </label>
          </div>
        </section>

        <section className="exercise-section">
          <div className="section-heading">
            <div><p className="eyebrow">THE WORK</p><h2>Exercises <span className="count-pill">{exercises.length}</span></h2></div>
            <span className="muted-copy">Log weight and reps for each set</span>
          </div>

          {exercises.map((exercise) => (
            <Exercise
              exercise={exercise}
              key={exercise.id}
              onAddSet={addSet}
              onRemoveExercise={(exerciseId) =>
                setExercises((current) => current.filter((item) => item.id !== exerciseId))
              }
              onRemoveSet={(exerciseId, setId) =>
                setExercises((current) =>
                  current.map((item) =>
                    item.id === exerciseId
                      ? { ...item, sets: item.sets.filter((set) => set.id !== setId) }
                      : item
                  )
                )
              }
              onSetChange={updateSet}
            />
          ))}

          <div className="panel add-exercise-panel">
            <div className="add-exercise-heading">
              <span className="add-exercise-icon" aria-hidden="true">＋</span>
              <div><h3>Add an exercise</h3><p>Previous weights and reps appear as placeholders.</p></div>
            </div>
            <div className="add-exercise-controls">
              <label className="form-field">
                <span>Muscle group</span>
                <select
                  onChange={(event) => {
                    const nextCategory = event.target.value;
                    setCategory(nextCategory);
                    setExerciseName(exerciseCatalog[nextCategory][0]);
                  }}
                  value={category}
                >
                  {Object.keys(exerciseCatalog).map((group) => <option key={group}>{group}</option>)}
                </select>
              </label>
              <label className="form-field">
                <span>Exercise</span>
                <select onChange={(event) => setExerciseName(event.target.value)} value={exerciseName}>
                  {exerciseCatalog[category].map((name) => <option key={name}>{name}</option>)}
                </select>
              </label>
              <button
                className="button button-secondary add-exercise-action"
                onClick={() => addExercise(exerciseName)}
                type="button"
              >
                Add exercise
              </button>
            </div>
            <div className="custom-exercise-row">
              <label className="form-field">
                <span>Or add a custom movement</span>
                <input
                  onChange={(event) => setCustomName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addExercise(customName);
                    }
                  }}
                  placeholder="Exercise name"
                  value={customName}
                />
              </label>
              <button
                className="button button-quiet"
                onClick={() => addExercise(customName)}
                type="button"
              >
                Add custom
              </button>
            </div>
          </div>
        </section>

        {error && <p className="notice notice-error" role="alert">{error}</p>}

        <div className="finish-row">
          <p className="muted-copy">{exercises.length} exercise{exercises.length === 1 ? '' : 's'} · started {startedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
          <button className="button button-primary finish-button" type="submit">Finish workout <span aria-hidden="true">→</span></button>
        </div>
      </form>
    </main>
  );
};

export default Workout;
