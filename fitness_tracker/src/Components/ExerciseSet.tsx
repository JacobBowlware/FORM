import React from 'react';
import { ExerciseSetDraft } from '../Models/ExerciseSetDraft';

interface ExerciseSetProps {
  set: ExerciseSetDraft;
  index: number;
  onChange: (setId: string, field: 'weight' | 'reps', value: number | null) => void;
  onRemove: (setId: string) => void;
}

const ExerciseSet = ({ set, index, onChange, onRemove }: ExerciseSetProps) => (
  <div className="set-row">
    <span className="set-number">{String(index + 1).padStart(2, '0')}</span>
    <label className="set-input">
      <span>Weight <small>kg</small></span>
      <input
        aria-label={`Set ${index + 1} weight in kilograms`}
        min="0"
        onChange={(event) =>
          onChange(set.id, 'weight', event.target.value === '' ? null : Number(event.target.value))
        }
        placeholder={set.previousWeight === undefined ? '' : String(set.previousWeight)}
        type="number"
        value={set.weight ?? ''}
      />
    </label>
    <label className="set-input">
      <span>Reps</span>
      <input
        aria-label={`Set ${index + 1} reps`}
        min="0"
        onChange={(event) =>
          onChange(set.id, 'reps', event.target.value === '' ? null : Number(event.target.value))
        }
        placeholder={set.previousReps === undefined ? '' : String(set.previousReps)}
        type="number"
        value={set.reps ?? ''}
      />
    </label>
    <button
      aria-label={`Remove set ${index + 1}`}
      className="icon-button remove-set"
      onClick={() => onRemove(set.id)}
      type="button"
    >
      ×
    </button>
  </div>
);

export default ExerciseSet;
