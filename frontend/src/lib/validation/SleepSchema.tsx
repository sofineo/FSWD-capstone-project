import { z } from "zod";

export const SleepSchema = z.object({
  date: z.union([
    z.date(),
    z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  ]),
  sleep_hours: z.number().min(1).max(1440).nullable(), //minutes
  sleep_goal: z.number().min(1).max(100).nullable().optional(),
});
