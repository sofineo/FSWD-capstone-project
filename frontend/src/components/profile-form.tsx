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
import { useState, useEffect } from "react";
import { feetInchesToCm, lbsToKg } from "@/utils/conversion";
import api from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProfileSchema } from "@/lib/validation/ProfileSchema";

interface User {
  user_id: string;
  name: string;
  email: string;
  // avatar: string
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
}

interface ProfileFormProps extends React.ComponentPropsWithoutRef<"div"> {
  user: User | null;
}

type Gender =
  | "male"
  | "female"
  | "non-binary"
  | "transgender"
  | "gender-fluid"
  | "prefer-not-to-say"
  | "other";

export function ProfileForm({ user, className, ...props }: ProfileFormProps) {
  const [userData, setUserData] = useState(user);
  //Metric System
  const [imperialSystem, setImperialSystem] = useState(false);

  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      email: "",
      password: { password: "", confirmPassword: "" },
      name: "",
      age: null,
      gender: undefined,
      heightCm: null,
      heightFeet: null,
      heightInches: null,
      weightKg: null,
      weightLbs: null,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: userData?.email || "",
        name: userData?.name || "",
        age: userData?.age ?? null,
        gender: (userData?.gender as Gender) || undefined,
        heightCm: userData?.height ?? null,
        weightKg: userData?.weight ?? null,
      });
    }
  }, [user, form]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof ProfileSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    let finalHeight =
      values.heightCm ||
      feetInchesToCm(values.heightFeet ?? 0, values.heightInches ?? 0);
    let finalWeight = values.weightKg || lbsToKg(values.weightLbs ?? 0);

    const payload = {
      email: values.email,
      password: values.password.password ? values.password.password : undefined,
      name: values.name,
      age: values.age,
      gender: values.gender,
      height: finalHeight,
      weight: finalWeight,
    };

    console.log(user?.user_id);
    api
      .put(`/api/users/${user?.user_id}`, payload)
      .then((res) => {
        console.log(res);
        toast("Profile successfully updated!");
        navigate("/");
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
      {/* <CardHeader>
        <CardTitle className="text-2xl flex justify-between">
          Update Your Profile
        </CardTitle>
      </CardHeader> */}
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password.password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="password.confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              {/* Age */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
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

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="whitespace-nowrap">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="transgender">Transgender</SelectItem>
                        <SelectItem value="gender-fluid">
                          Gender-fluid
                        </SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer-not-to-say
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={imperialSystem ? "grid grid-cols-2 gap-2" : ""}>
              {/* Height */}
              <FormField
                control={form.control}
                name={imperialSystem ? "heightFeet" : "heightCm"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {imperialSystem ? "Height(feet)" : "Height(cm)"}
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
              {imperialSystem && (
                <FormField
                  control={form.control}
                  name="heightInches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height(inches)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Weight */}
            <FormField
              control={form.control}
              name={imperialSystem ? "weightLbs" : "weightKg"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {imperialSystem ? "Weight(Lbs)" : "Weight(kg)"}
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
