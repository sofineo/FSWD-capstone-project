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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { kmToMiles } from "@/utils/conversion";
import api from "@/services/api";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Workout } from "@/lib/types/workout";
import { WorkoutSchema } from "@/lib/validation/WorkoutSchema";

interface WorkoutFormProps extends React.ComponentPropsWithoutRef<"div"> {
  user: Workout | null;
}

export function WorkoutForm({ user, className, ...props }: WorkoutFormProps) {
  const [workoutData, setWorkoutData] = useState<Workout>();
  //Metric System
  const [imperialSystem, setImperialSystem] = useState(false);

  const form = useForm<z.infer<typeof WorkoutSchema>>({
    resolver: zodResolver(WorkoutSchema),
    defaultValues: {
      workout_type: undefined,
      duration: null,
      distanceKm: null,
      distanceMi: null,
      calories_burned: null,
      date: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof WorkoutSchema>) {
    let finalDistance = values.distanceKm || kmToMiles(values.distanceMi ?? 0);

    const payload = {
      workout_type: values.workout_type,
      duration: values.duration,
      distance: finalDistance,
      calories_burned: values.calories_burned,
    };

    api
      .post(`/api/workouts`, payload)
      .then(() => {
        toast("Workout created successfully!");
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        } else {
          toast(
            "We were unable to create your account. Please try again later."
          );
        }
      });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Gender */}
            <FormField
              control={form.control}
              name="workout_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="whitespace-nowrap">
                        <SelectValue placeholder="Select the workout type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="resistance">Resistance</SelectItem>
                      <SelectItem value="hiit">HIIT</SelectItem>
                      <SelectItem value="recovery">Recovery</SelectItem>
                      <SelectItem value="mobility">Mobility</SelectItem>
                      <SelectItem value="functional">Functional</SelectItem>
                      <SelectItem value="powerlifting">Powerlifting</SelectItem>
                      <SelectItem value="olympic-lifting">
                        Olympic-lifting
                      </SelectItem>
                      <SelectItem value="calisthenics">Calisthenics</SelectItem>
                      <SelectItem value="plyometrics">Plyometrics</SelectItem>
                      <SelectItem value="core">Core</SelectItem>
                      <SelectItem value="sport-specific">
                        Sport-specific
                      </SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                      <SelectItem value="balance">Balance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Height */}
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight */}
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
