//https://ui.shadcn.com/docs/components/form
//https://ui.shadcn.com/blocks/authentication
//https://ui.shadcn.com/docs/components/date-picker
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
import { kmToMiles, milesToKm } from "@/utils/conversion";
import api from "@/services/api";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkoutSchema } from "@/lib/validation/WorkoutSchema";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format, toZonedTime } from "date-fns-tz";
import { useImperialSystem } from "@/context/imperialSystemContext";

interface WorkoutFormProps extends React.ComponentPropsWithoutRef<"div"> {
  user: string | null;
  selectedDate?: string;
  refetchWorkouts?: () => void;
}

export function WorkoutForm({
  user,
  selectedDate,
  refetchWorkouts,
  className,
  ...props
}: WorkoutFormProps) {
  //Metric System
  const { imperialSystem } = useImperialSystem();
  const [imperialSystemWorkout, setImperialSystemWorkout] =
    useState(imperialSystem);

  const form = useForm<z.infer<typeof WorkoutSchema>>({
    resolver: zodResolver(WorkoutSchema),
    defaultValues: {
      workout_type: undefined,
      duration: null,
      distanceKm: null,
      distanceMi: null,
      calories_burned: null,
      date: selectedDate ?? new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof WorkoutSchema>) {
    // let finalDistance = values.distanceKm || kmToMiles(values.distanceMi ?? 0);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = toZonedTime(values.date, timeZone);
    const formattedDate = format(zonedDate, "yyyy-MM-dd", { timeZone });

    let finalDistance = null;

    if (values.distanceMi && imperialSystem) {
      finalDistance = milesToKm(values.distanceMi);
    } else {
      finalDistance = values.distanceKm;
    }

    const payload = {
      workout_type: values.workout_type,
      duration: values.duration,
      distance: finalDistance,
      calories_burned: values.calories_burned,
      date: formattedDate,
    };

    api
      .post(`/api/workouts`, payload)
      .then(() => {
        toast("Workout logged successfully!");
        refetchWorkouts?.(); //Only refresh if the workout happen inside the Tab
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        } else {
          toast(
            "We were unable to logged your workout. Please try again later."
          );
        }
      });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardContent className="p-0">
        {/** Date **/}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {!selectedDate && (
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          } //expects Date type
                          onSelect={(date) =>
                            field.onChange(date ?? new Date())
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Workout Type */}
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

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (min)</FormLabel>
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
            {/** Distance */}
            <FormField
              control={form.control}
              name={imperialSystemWorkout ? "distanceMi" : "distanceKm"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {imperialSystemWorkout
                      ? "Distance (miles)"
                      : "Distance (km)"}
                  </FormLabel>
                  <div className="flex gap-2">
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
                    {/* Toggle Imperial System and Metric System */}
                    <Toggle
                      size="sm"
                      className="w-1/8 h-9"
                      variant={"metricIcon"}
                      aria-label="Toggle Imperial System and Metric System"
                      pressed={imperialSystemWorkout}
                      onPressedChange={setImperialSystemWorkout}
                    >
                      <RefreshCcw className="w-4 h-4" />{" "}
                    </Toggle>
                  </div>
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

            <Button type="submit" className="w-full">
              Log Workout
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
