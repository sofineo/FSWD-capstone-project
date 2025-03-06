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
import { SignUpSchema } from "../lib/validation/SignUpSchema";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { feetInchesToCm, lbsToKg } from "@/utils/conversion";
import api from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  //Metric System
  const [imperialSystem, setImperialSystem] = useState(false);

  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof SignUpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    let finalHeight =
      values.heightCm ||
      feetInchesToCm(values.heightFeet ?? 0, values.heightInches ?? 0);
    let finalWeight = values.weightKg || lbsToKg(values.weightLbs ?? 0);

    const payload = {
      email: values.email,
      password: values.password.password,
      name: values.name,
      age: values.age,
      gender: values.gender,
      height: finalHeight,
      weight: finalWeight,
    };

    api
      .post("api/users", payload)
      .then((res) => {
        console.log(res);
        toast("Account successfully created! You can now log in.");
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

  function handleButtonSignIn() {
    navigate("/");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex justify-between">
            Sign Up
            <ModeToggle />
          </CardTitle>
          <CardDescription>
            Enter your info below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    <FormLabel>Password</FormLabel>
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
                    <FormLabel>Confirm Password</FormLabel>
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
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
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
                          <SelectItem value="transgender">
                            Transgender
                          </SelectItem>
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
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
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
                Create Account
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a
                href=""
                className="underline underline-offset-4"
                onClick={handleButtonSignIn}
              >
                Sign in
              </a>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
