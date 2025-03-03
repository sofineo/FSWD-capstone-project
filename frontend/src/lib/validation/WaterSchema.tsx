import { z } from "zod";

export const WaterSchema = z
  .object({
    date: z.union([
      z.date(),
      z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
    ]),
    water_consumed_ml: z.number().min(1).max(10000).nullable(),
    water_goal_ml: z.number().min(1).max(10000).nullable().optional(),
  })
  .refine((data) => data.water_consumed_ml !== null, {
    message: "Type or add a value",
    path: ["water_consumed_ml"],
  });
//Just want to give error if is null when sending the form
