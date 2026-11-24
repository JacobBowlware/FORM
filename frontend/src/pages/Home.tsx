import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWorkouts } from '../services/WorkoutService';
import { WorkoutRecord } from '../models/WorkoutRecord';
import '../styles/Home.css';

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const getStrengthChange = (workouts: WorkoutRecord[]) => {
  const sorted = [...workouts].sort(
    (first, second) =>
      new Date(first.endedAt).getTime() - new Date(second.endedAt).getTime()
  );
  const changes = new Map<string, { first: number; latest: number; sessions: number }>();

  sorted.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const maxWeight = Math.max(0, ...exercise.sets.map((set) => set.weight ?? 0));
      if (maxWeight <= 0) return;
      const existing = changes.get(exercise.name);
      if (existing) {
        existing.latest = maxWeight;
        existing.sessions += 1;
      } else {
        changes.set(exercise.name, { first: maxWeight, latest: maxWeight, sessions: 1 });
      }
    });
  });

  const exerciseChanges = Array.from(changes.values())
    .filter(({ first, sessions }) => first > 0 && sessions > 1)
    .map(({ first, latest }) => ((latest - first) / first) * 100);
  if (!exerciseChanges.length) return null;
  return Math.round(
    exerciseChanges.reduce((total, change) => total + change, 0) /
      exerciseChanges.length
  );
};

const Home = () => {
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([]);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    getWorkouts()
      .then((savedWorkouts) => {
        if (isCurrent) setWorkouts(savedWorkouts);
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setLoadError(
            error instanceof Error ? error.message : 'Your workouts could not be loaded.'
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  const activityDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (13 - index));
      const count = workouts.filter((workout) => {
        const workoutDate = new Date(workout.endedAt);
        return workoutDate.toDateString() === date.toDateString();
      }).length;
      return { date, count };
    });
  }, [workouts]);

  const averageDuration = workouts.length
    ? Math.round(
        workouts.reduce((total, workout) => total + workout.durationMinutes, 0) /
          workouts.length
      )
    : 0;
  const totalVolume = workouts.reduce(
    (total, workout) =>
      total +
      workout.exercises.reduce(
        (exerciseTotal, exercise) =>
          exerciseTotal +
          exercise.sets.reduce(
            (setTotal, set) => setTotal + (set.weight ?? 0) * (set.reps ?? 0),
            0
          ),
        0
      ),
    0
  );
  const strengthChange = getStrengthChange(workouts);

  return (
    <main className="dashboard page-shell">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">TRAINING OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="dashboard-motto">Impatience with actions. Patience with results.</p>
        </div>
        <Link className="button button-primary start-button" to="/workout">
          <span aria-hidden="true">＋</span> Start a workout
        </Link>
      </section>

      {loadError && <p className="notice notice-error" role="alert">{loadError}</p>}
      {isLoading && <p className="muted-copy" role="status">Loading your workouts…</p>}

      <section className="metric-grid" aria-label="Workout summary">
        <article className="metric-card">
          <span className="metric-label">Workouts logged</span>
          <strong>{workouts.length}</strong>
          <span className="metric-caption">all time</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">Average session</span>
          <strong>{averageDuration}<small> min</small></strong>
          <span className="metric-caption">per workout</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">Volume moved</span>
          <strong>{totalVolume.toLocaleString()}<small> kg</small></strong>
          <span className="metric-caption">weight × reps</span>
        </article>
        <article className="metric-card metric-highlight">
          <span className="metric-label">Strength trend</span>
          <strong>
            {strengthChange === null ? '—' : `${strengthChange > 0 ? '+' : ''}${strengthChange}%`}
          </strong>
          <span className="metric-caption">average change across tracked lifts</span>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ACTIVITY</p>
            <h2>Last 14 days</h2>
          </div>
          <span className="activity-legend"><i /> Workout logged</span>
        </div>
        <div className="activity-grid" aria-label="Workout activity for the last 14 days">
          {activityDays.map(({ date, count }) => (
            <div className="activity-day" key={date.toISOString()}>
              <span className="activity-square" data-active={count > 0} title={`${formatDate(date)}: ${count} workout${count === 1 ? '' : 's'}`} />
              <span className="activity-date">{date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
              <span className="activity-date">{date.getDate()}</span>
            </div>
          ))}
        </div>
        <p className="activity-footnote">
          {workouts.length ? 'Activity recorded over the last 14 days.' : 'No workouts logged in this period.'}
        </p>
      </section>

      <section className="panel recent-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR HISTORY</p>
            <h2>Recent workouts</h2>
          </div>
          <span className="muted-copy">{workouts.length} total</span>
        </div>
        {workouts.length ? (
          <div className="workout-table-wrap">
            <table className="workout-table">
              <thead>
                <tr><th>Workout</th><th>Date</th><th>Exercises</th><th>Duration</th></tr>
              </thead>
              <tbody>
                {workouts.slice(0, 5).map((workout) => (
                  <tr key={workout.id}>
                    <td className="workout-name-cell">{workout.name || 'Training session'}</td>
                    <td>{formatDate(new Date(workout.endedAt))}</td>
                    <td>{workout.exercises.length}</td>
                    <td>{workout.durationMinutes} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state-mark" aria-hidden="true">↗</span>
            <div>
              <strong>Nothing logged yet</strong>
              <p>Completed sessions will appear here.</p>
            </div>
            <Link to="/workout" className="text-link">Log your first workout</Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
