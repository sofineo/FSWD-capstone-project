import api from "@/services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { WorkoutForm } from "./workout-form";
import { UpdateWorkoutForm } from "./update-workout-form";

interface WorkoutProps {
  selectedDate: Date;
  user: string | null;
}

export function Workout({ selectedDate, user, ...props }: WorkoutProps) {
  const [data, setData] = useState();
  const formatDate = format(selectedDate, "yyyy-MM-dd");
  const [refresh, setRefresh] = useState(false);

  async function refetchWorkout() {
    setRefresh((prev) => !prev);
  }

  useEffect(() => {
    async function fetchWorkout() {
      const res = await api.get(`/api/workouts/index?date=${formatDate}`);
      setData(res.data.result);
    }
    fetchWorkout();
  }, [selectedDate, refresh]);

  return (
    <>
      {data && (
        <UpdateWorkoutForm
          user={user}
          selectedDate={formatDate}
          refetchWorkout={refetchWorkout}
        />
      )}
      {!data && (
        <WorkoutForm
          user={user}
          selectedDate={formatDate}
          refetchWorkout={refetchWorkout}
        />
      )}
    </>
  );
}
