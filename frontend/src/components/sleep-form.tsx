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

interface SleepFormProps extends React.ComponentPropsWithoutRef<"div"> {
  user: string | null;
  selectedDate?: string;
  retchSleep?: () => void;
}

export function SleepForm({
  user,
  selectedDate,
  retchSleep,
  className,
  ...props
}: SleepFormProps) {
  const form = useForm<z.infer<typeof SleepSchema>>({
    resolver: zodResolver(SleepSchema),
    defaultValues: {
      date: selectedDate ?? new Date(),
      sleep_hours: null,
      sleep_goal: null,
    },
  });

  function onSubmit(values: z.infer<typeof SleepSchema>) {
    const formattedDate = values.date
      ? format(new Date(values.date), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd");

    const payload = {
      date: formattedDate,
      sleep_hours: values.sleep_hours,
      sleep_goal: values.sleep_goal,
    };

    api
      .post(`/api/sleep`, payload)
      .then(() => {
        toast("Sleep record logged successfully!");
        retchSleep?.(); //Only refresh if the workout happen inside the Tab
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
                              "w-[240px] pl-3 text-left font-normal",
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

            {/* Sleep Hours */}
            <FormField
              control={form.control}
              name="sleep_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (hr)</FormLabel>
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
              Log Sleep Record
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
