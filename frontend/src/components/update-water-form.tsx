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
import { WaterIntake } from "@/lib/types/water-intake";
import { WaterSchema } from "@/lib/validation/WaterSchema";
import { useState } from "react";
import { WaterButtons } from "./water-buttons";
import { Toggle } from "./ui/toggle";
import { RefreshCcw } from "lucide-react";
import { mlToOz, ozToMl } from "@/utils/conversion";
import { useImperialSystem } from "@/context/imperialSystemContext";

interface UpdateWaterIntakeFormProps
  extends React.ComponentPropsWithoutRef<"div"> {
  data: WaterIntake;
  user: string | null;
  selectedDate?: string;
  refetchWaterIntake?: () => void;
}

export function UpdateWaterIntakeForm({
  user,
  data,
  selectedDate,
  refetchWaterIntake,
  className,
  ...props
}: UpdateWaterIntakeFormProps) {
  const { imperialSystem } = useImperialSystem();
  const [imperialSystemWater, setImperialSystemWater] =
    useState(imperialSystem);

  const form = useForm<z.infer<typeof WaterSchema>>({
    resolver: zodResolver(WaterSchema),
    defaultValues: {
      date: data.date,
      water_consumed_ml: imperialSystemWater
        ? mlToOz(data.water_consumed_ml)
        : data.water_consumed_ml,
      water_goal_ml: data.water_goal_ml ?? null,
    },
  });

  function handleImperialSystemWaterChange() {
    // Uses the current state (imperialSystemWater) before it is toggled.
    if (!imperialSystemWater) {
      form.setValue("water_consumed_ml", mlToOz(data.water_consumed_ml));
      form.setValue(
        "water_goal_ml",
        data.water_goal_ml ? mlToOz(data.water_goal_ml) : null
      );
    } else {
      form.setValue("water_consumed_ml", data.water_consumed_ml);
      form.setValue("water_goal_ml", data.water_goal_ml);
    }
  }

  function onSubmit(values: z.infer<typeof WaterSchema>) {
    const finalWaterConsumed = imperialSystemWater
      ? ozToMl(Number(values.water_consumed_ml))
      : values.water_consumed_ml;

    const finalWaterGoal = imperialSystemWater
      ? ozToMl(Number(values.water_goal_ml))
      : values.water_goal_ml;

    const payload = {
      date: values.date,
      water_consumed_ml: finalWaterConsumed,
      water_goal_ml: finalWaterGoal,
    };

    api
      .put(`/api/water-intake/${data.water_intake_id}`, payload)
      .then(() => {
        toast("Water intake record updated successfully!");
        refetchWaterIntake?.(); //Only refresh if the workout happen inside the Tab
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response?.data?.message);
        } else {
          toast(
            "We were unable to update your water intake record. Please try again later."
          );
        }
      });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Water Intake Goal */}
            <FormField
              control={form.control}
              name="water_goal_ml"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Water Intake Goal {imperialSystemWater ? "(oz)" : "(ml)"}
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

            {/* Water Consumption */}
            <FormField
              control={form.control}
              name="water_consumed_ml"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Water Intake {imperialSystemWater ? "(oz)" : "(ml)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        imperialSystemWater ? "Type (oz)" : "Type (ml)"
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

                  <div className="flex">
                    <WaterButtons
                      imperialSystem={imperialSystemWater}
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
                      pressed={imperialSystemWater}
                      onPressedChange={setImperialSystemWater}
                      onClick={handleImperialSystemWaterChange}
                    >
                      <RefreshCcw className="w-4 h-4" />{" "}
                    </Toggle>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Update Water Intake Record
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
