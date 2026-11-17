import React from 'react';
import ExerciseSet from './ExerciseSet';
import { WorkoutExerciseDraft } from '../Models/WorkoutExerciseDraft';

interface ExerciseProps {
  exercise: WorkoutExerciseDraft;
  onSetChange: (
    exerciseId: string,
    setId: string,
    field: 'weight' | 'reps',
    value: number | null
  ) => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

const Exercise = ({
  exercise,
  onSetChange,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
}: ExerciseProps) => (
  <article className="exercise-card">
    <div className="exercise-heading">
      <div>
        <span className="exercise-category">{exercise.category}</span>
        <h3>{exercise.name}</h3>
      </div>
      <button
        className="text-button delete-exercise"
        onClick={() => onRemoveExercise(exercise.id)}
        type="button"
      >
        Remove
      </button>
    </div>
    <div className="set-header" aria-hidden="true">
      <span>SET</span><span>WEIGHT</span><span>REPS</span><span />
    </div>
    <div className="sets-list">
      {exercise.sets.map((set, index) => (
        <ExerciseSet
          index={index}
          key={set.id}
          onChange={(setId, field, value) => onSetChange(exercise.id, setId, field, value)}
          onRemove={(setId) => onRemoveSet(exercise.id, setId)}
          set={set}
        />
      ))}
    </div>
    <button className="add-set-button" onClick={() => onAddSet(exercise.id)} type="button">
      ＋ Add set
    </button>
  </article>
);

export default Exercise;
