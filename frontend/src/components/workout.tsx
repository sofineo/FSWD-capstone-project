import api from "@/services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { WorkoutForm } from "./workout-form";
import type { Workout } from "@/lib/types/workout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { SkeletonCard } from "./ui/skeleton-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { UpdateWorkoutForm } from "./update-workout-form";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";


interface WorkoutProps {
  selectedDate: Date;
  user: string | null;
}

export function Workout({ selectedDate, user, ...props }: WorkoutProps) {
  const [data, setData] = useState<Workout[] | null>(null);
  const [loading, setLoading] = useState(true);
  const formatDate = format(selectedDate, "yyyy-MM-dd");
  const [refresh, setRefresh] = useState(false);

  async function refetchWorkout() {
    setRefresh((prev) => !prev);
  }

  async function handleDeleteButton(workout_id: string) {
    api
      .delete(`/api/workouts/${workout_id}`)
      .then(() => {
        toast("Workout deleted successfully!");
        refetchWorkout();
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        } else {
          toast(
            "We were unable to delete your workout. Please try again later."
          );
        }
      });
  }

  useEffect(() => {
    async function fetchWorkout() {
      setLoading(true);
      const res = await api.get(`/api/workouts/index?date=${formatDate}`);
      setData(res.data.result);

      setLoading(false);
    }
    fetchWorkout();
  }, [selectedDate, refresh]);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div>
      {data && data.length > 0 ? (
        <Accordion type="single" collapsible>
          {data.map((workout) => (
            <AccordionItem key={workout.workout_id} value={workout.workout_id}>
              <AccordionTrigger>
                {workout.workout_type.toUpperCase()}
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Duration: {workout.duration ? `${workout.duration} min` : "-"}{" "}
                </p>
                <p>
                  Distance: {workout.distance ? `${workout.distance} km` : "-"}
                </p>
                <p>
                  Calories Burned:{" "}
                  {workout.calories_burned
                    ? `${workout.calories_burned} cal`
                    : "-"}
                </p>
                <div className="mt-2 flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline2" size={"icon"}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align={"start"}>
                      <UpdateWorkoutForm
                        user={user}
                        data={workout}
                        refetchWorkout={refetchWorkout}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant={"outline2"}
                    size={"icon"}
                    onClick={() => {handleDeleteButton(workout.workout_id)}}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <WorkoutForm
          user={user}
          selectedDate={formatDate}
          refetchWorkouts={refetchWorkout}
        />
      )}
    </div>
  );
}
