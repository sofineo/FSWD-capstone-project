export interface Workout {
  workout_id: string;
  workout_type: string;
  duration?: number;
  distance?: number;
  calories_burned?: number;
  date: string;
}
