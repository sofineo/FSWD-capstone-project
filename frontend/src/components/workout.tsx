import api from "@/services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface WorkoutProps {
  selectedDate: Date;
}

export function Workout({ selectedDate, ...props }: WorkoutProps) {
  const [data, setData] = useState();
  const formatDate = format(selectedDate, "yyyy-MM-dd");
  console.log(formatDate);
  console.dir(data);

  useEffect(() => {
    async function fetchWorkout() {
      const res = await api.get(`/api/workouts/index?date=${formatDate}`);
      setData(res.data.result);
    }
    fetchWorkout();
  }, [selectedDate]);

  return <>{data && <h1>Hi</h1>}</>;
}
