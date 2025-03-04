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
import api from "@/services/api";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
// import { format } from "date-fns";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { WaterSchema } from "@/lib/validation/WaterSchema";
import { WaterButtons } from "./water-buttons";
import { useState } from "react";
import { Toggle } from "./ui/toggle";
import { ozToMl } from "@/utils/conversion";
import { toZonedTime, format } from "date-fns-tz";

interface WaterFormProps extends React.ComponentPropsWithoutRef<"div"> {
  user: string | null;
  selectedDate?: string;
  refetchWaterIntake?: () => void;
}

export function WaterForm({
  user,
  selectedDate,
  refetchWaterIntake,
  className,
  ...props
}: WaterFormProps) {
  const [imperialSystem, setImperialSystem] = useState(false);

  const form = useForm<z.infer<typeof WaterSchema>>({
    resolver: zodResolver(WaterSchema),
    defaultValues: {
      date: selectedDate ?? new Date(),
      water_consumed_ml: null,
      water_goal_ml: null,
    },
  });

  function handleImperialSystemChange() {
    form.setValue("water_consumed_ml", null);
    form.setValue("water_goal_ml", null);
  }

  function onSubmit(values: z.infer<typeof WaterSchema>) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = toZonedTime(values.date, timeZone);
    const formattedDate = format(zonedDate, "yyyy-MM-dd", { timeZone });

    const finalWaterConsumed = imperialSystem
      ? ozToMl(Number(values.water_consumed_ml))
      : values.water_consumed_ml;

    const finalWaterGoal = imperialSystem
      ? ozToMl(Number(values.water_goal_ml))
      : values.water_goal_ml;

    const payload = {
      date: formattedDate,
      water_consumed_ml: finalWaterConsumed,
      water_goal_ml: finalWaterGoal,
    };

    console.log(payload);
    api
      .post(`/api/water-intake`, payload)
      .then(() => {
        toast("Sleep record logged successfully!");
        refetchWaterIntake?.(); //Only refresh if the workout happen inside the Tab
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        } else {
          toast(
            "We were unable to logged your sleep record. Please try again later."
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
            <div className={`grid ${selectedDate ?? "grid-cols-2 gap-2"}`}>
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
                                "pl-3 text-left font-normal",
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
              {/* Water Goal */}
              <FormField
                control={form.control}
                name="water_goal_ml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Water Goal {imperialSystem ? "(oz)" : "(ml)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder={imperialSystem ? "Type (oz)" : "Type (ml)"}
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
            </div>
            {/* Water Intake */}
            <FormField
              control={form.control}
              name="water_consumed_ml"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Water Intake {imperialSystem ? "(oz)" : "(ml)"}
                  </FormLabel>
                  <div
                    className={`flex gap-2 ${selectedDate ? "flex-col" : ""}`}
                  >
                    <div
                      className={`flex flex-col ${
                        selectedDate ? "" : "w-1/3"
                      } `}
                    >
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={
                            imperialSystem ? "Type (oz)" : "Type (ml)"
                          }
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const newValue = e.target.valueAsNumber;
                            field.onChange(isNaN(newValue) ? null : newValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>

                    <div className={`flex ${selectedDate ? "" : "w-2/3"} `}>
                      <WaterButtons
                        imperialSystem={imperialSystem}
                        addWater={(amount) => {
                          const currentValue = field.value ?? 0;
                          field.onChange(currentValue + amount);
                        }}
                      />
                      {/* Toggle Imperial System and Metric System */}
                      <Toggle
                        size="sm"
                        className="ms-2 w-1/8"
                        variant={"metricIcon"}
                        aria-label="Toggle Imperial System and Metric System"
                        pressed={imperialSystem}
                        onPressedChange={setImperialSystem}
                        onClick={handleImperialSystemChange}
                      >
                        <RefreshCcw className="w-4 h-4" />{" "}
                      </Toggle>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Log Water Record
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
