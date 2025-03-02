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
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { SleepSchema } from "@/lib/validation/SleepSchema";
import { Sleep } from "@/lib/types/sleep";

interface UpdateSleepFormProps extends React.ComponentPropsWithoutRef<"div"> {
  data: Sleep;
  user: string | null;
  selectedDate?: string;
  retchSleep?: () => void;
}

export function UpdateSleepForm({
  user,
  data,
  selectedDate,
  retchSleep,
  className,
  ...props
}: UpdateSleepFormProps) {
  const form = useForm<z.infer<typeof SleepSchema>>({
    resolver: zodResolver(SleepSchema),
    defaultValues: {
      date: data.date,
      sleep_hours: data.sleep_hours,
      sleep_goal: data.sleep_goal ?? null,
    },
  });

  function onSubmit(values: z.infer<typeof SleepSchema>) {
    if (!data.sleep_id) {
      console.error("Missing sleep_id:", data);
      toast.error("Error: Missing sleep record ID.");
      return;
    }

    const payload = {
      date: values.date,
      sleep_hours: values.sleep_hours,
      sleep_goal: values.sleep_goal,
    };

    api
      .put(`/api/sleep/${data.sleep_id}`, payload)
      .then(() => {
        toast("Sleep record updated successfully!");
        retchSleep?.(); //Only refresh if the workout happen inside the Tab
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response?.data?.message);
        } else {
          toast(
            "We were unable to update your sleep record. Please try again later."
          );
        }
      });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Sleep Hours */}
            <FormField
              control={form.control}
              name="sleep_hours"
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

            {/* Sleep Goal */}
            <FormField
              control={form.control}
              name="sleep_goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleep Goal</FormLabel>
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
              Update Sleep Record
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
