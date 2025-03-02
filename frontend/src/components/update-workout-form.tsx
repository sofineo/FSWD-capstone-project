//https://ui.shadcn.com/docs/components/form
//https://ui.shadcn.com/blocks/authentication
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import { kmToMiles, milesToKm } from "@/utils/conversion";
import api from "@/services/api";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkoutSchema } from "@/lib/validation/WorkoutSchema";
import { Workout } from "@/lib/types/workout";

interface WorkoutFormProps extends React.ComponentPropsWithoutRef<"div"> {
  user: string | null;
  data: Workout;
  refetchWorkout: () => void;
}

type WorkoutType =
  | "cardio"
  | "resistance"
  | "hiit"
  | "recovery"
  | "mobility"
  | "functional"
  | "powerlifting"
  | "olympic-lifting"
  | "calisthenics"
  | "plyometrics"
  | "core"
  | "sport-specific"
  | "endurance"
  | "balance";

export function UpdateWorkoutForm({
  user,
  refetchWorkout,
  className,
  data,
  ...props
}: WorkoutFormProps) {
  //Metric System
  const [imperialSystem, setImperialSystem] = useState(false);

  const form = useForm<z.infer<typeof WorkoutSchema>>({
    resolver: zodResolver(WorkoutSchema),
    defaultValues: {
      workout_type: data.workout_type as WorkoutType,
      duration: data.duration,
      distanceKm: data.distance,
      distanceMi: data.distance ? kmToMiles(data.distance) : null,
      calories_burned: data.calories_burned,
      date: data.date,
    },
  });

  function onSubmit(values: z.infer<typeof WorkoutSchema>) {
    let finalDistance = null;

    if (imperialSystem && values.distanceMi) {
      finalDistance = milesToKm(values.distanceMi);
    } else {
      finalDistance = values.distanceKm;
    }

    const payload = {
      workout_type: values.workout_type,
      duration: values.duration,
      distance: finalDistance,
      calories_burned: values.calories_burned,
      date: values.date,
    };

    api
      .put(`/api/workouts/${data.workout_id}`, payload)
      .then(() => {
        toast("Workout updated successfully!");
        refetchWorkout();
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        } else {
          toast(
            "We were unable to update your workout. Please try again later."
          );
        }
      });
  }

  useEffect(() => {
    const currentDistance = form.getValues(
      imperialSystem ? "distanceKm" : "distanceMi"
    );

    if (imperialSystem) {
      form.setValue(
        "distanceMi",
        currentDistance ? kmToMiles(currentDistance) : null
      );
    } else {
      form.setValue(
        "distanceKm",
        currentDistance ? milesToKm(currentDistance) : null
      );
    }
  }, [imperialSystem, data]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const newValue = e.target.valueAsNumber;
                        field.onChange(isNaN(newValue) ? null : newValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Distance */}
            <FormField
              control={form.control}
              name={imperialSystem ? "distanceMi" : "distanceKm"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {imperialSystem ? "Distance (miles)" : "Distance (km)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const newValue = e.target.valueAsNumber;
                        field.onChange(isNaN(newValue) ? null : newValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Calories Burned */}
            <FormField
              control={form.control}
              name="calories_burned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories Burned</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const newValue = e.target.valueAsNumber;
                        field.onChange(isNaN(newValue) ? null : newValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Toggle Imperial System and Metric System */}
            <Toggle
              size="sm"
              className="w-full"
              variant={"outline2"}
              aria-label="Toggle Imperial System and Metric System"
              pressed={imperialSystem}
              onPressedChange={setImperialSystem}
            >
              {imperialSystem
                ? "Metric System (cm/kg)"
                : "Imperial System (ft/in/lbs)"}
            </Toggle>

            <Button type="submit" className="w-full">
              Update Workout
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
