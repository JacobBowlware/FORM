import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ExerciseSet from './ExerciseSet';

test('shows previous values as placeholders without entering them as current values', () => {
  const onChange = jest.fn();
  const onRemove = jest.fn();
  const { rerender } = render(
    <ExerciseSet
      index={0}
      onChange={onChange}
      onRemove={onRemove}
      set={{
        id: 'set-1',
        weight: null,
        reps: null,
        previousWeight: 50,
        previousReps: 5,
      }}
    />
  );

  const weight = screen.getByLabelText(/set 1 weight/i);
  const reps = screen.getByLabelText(/set 1 reps/i);
  expect(weight).toHaveAttribute('placeholder', '50');
  expect(reps).toHaveAttribute('placeholder', '5');
  expect(weight).toHaveValue(null);
  expect(reps).toHaveValue(null);

  fireEvent.change(weight, { target: { value: '55' } });
  expect(onChange).toHaveBeenNthCalledWith(1, 'set-1', 'weight', 55);

  rerender(
    <ExerciseSet
      index={0}
      onChange={onChange}
      onRemove={onRemove}
      set={{
        id: 'set-1',
        weight: 55,
        reps: 5,
        previousWeight: 50,
        previousReps: 5,
      }}
    />
  );
  fireEvent.change(screen.getByLabelText(/set 1 reps/i), { target: { value: '' } });
  expect(onChange).toHaveBeenNthCalledWith(2, 'set-1', 'reps', null);
});
