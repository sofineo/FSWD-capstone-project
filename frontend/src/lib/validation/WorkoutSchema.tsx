import { z } from "zod";

export const WorkoutSchema = z.object({
  date: z.union([
    z.date(),
    z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  ]),
  workout_type: z.enum([
    "cardio", // Running, cycling, rowing, etc.
    "resistance", // Weightlifting, strength training
    "hiit", // High-intensity interval training
    "recovery", // Stretching, foam rolling
    "mobility", // Yoga, flexibility work
    "functional", // CrossFit, bodyweight training
    "powerlifting", // Squat, bench press, deadlift
    "olympic-lifting", // Snatch, clean and jerk
    "calisthenics", // Bodyweight exercises like pull-ups
    "plyometrics", // Jump training, explosive movements
    "core", // Abs, lower back strengthening
    "sport-specific", // Training for a specific sport
    "endurance", // Long-distance running, swimming
    "balance", // Stability-focused exercises
  ]),
  duration: z.number().min(1).max(300).nullable().optional(), //up to 5 hours
  distanceKm: z.number().min(1).max(100).nullable().optional(),
  distanceMi: z.number().min(1).max(100).nullable().optional(),
  calories_burned: z.number().min(0).max(11).nullable().optional(),
});
