import { z } from "zod";

export const ProfileSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(64, "Password must be at most 64 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(/[\W_]/, "Password must contain at least one special character.")
        .optional()
        .or(z.literal("")),

      confirmPassword: z.string().optional(),
    })
    .refine(
      (data) => !data.password || data.password === data.confirmPassword,
      {
        message: "Passwords do not match.",
        path: ["confirmPassword"], // Attach error to confirmPassword field
      }
    ),
  name: z.string(),
  age: z.number().int().min(0).max(150).nullable().optional(),
  gender: z
    .enum([
      "male",
      "female",
      "non-binary",
      "transgender",
      "gender-fluid",
      "prefer-not-to-say",
      "other",
    ])
    .nullable()
    .optional(),
  imperialSystem: z.boolean(),
  heightCm: z.number().min(50).max(300).nullable().optional(),
  heightFeet: z.number().min(1).max(8).nullable().optional(),
  heightInches: z.number().min(0).max(11).nullable().optional(),
  weightKg: z.number().min(10).max(500).nullable().optional(),
  weightLbs: z.number().min(22).max(1100).nullable().optional(),
});
