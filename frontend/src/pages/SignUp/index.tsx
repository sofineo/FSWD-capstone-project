import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { formSchema } from "./formSchema";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export function SignUp() {
  //Metric System
  const [imperialSystem, setImperialSystem] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: {},
      name: "",
      age: undefined,
      gender: undefined,
      heightCm: undefined,
      heightFeet: undefined,
      heightInches: undefined,
      weightKg: undefined,
      weightLbs: undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
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
                  <Input
                    placeholder="example@mail.com"
                    {...field}
                    type="email"
                  />
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
                  <Input placeholder="password" {...field} type="password" />
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
                  <Input placeholder="password" {...field} type="password" />
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
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex">
            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="age" {...field} type="number" />
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="transgender">Transgender</SelectItem>
                      <SelectItem value="gender-fluid">Gender-fluid</SelectItem>
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

          <div className="flex">
            {/* Height */}
            <FormField
              control={form.control}
              name={imperialSystem ? "heightCm" : "heightFeet"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {imperialSystem ? "Height(feet)" : "Height(cm)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        imperialSystem
                          ? "Enter your height in feet"
                          : "Enter your height in cm"
                      }
                      {...field}
                      type="number"
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
                        placeholder="Enter your height in inches"
                        {...field}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex">
            {/* Weight */}
            <FormField
              control={form.control}
              name={imperialSystem ? "weightKg" : "weightLbs"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {imperialSystem ? "Weight(Lbs)" : "Weight(kg)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        imperialSystem
                          ? "Enter your weight in lbs"
                          : "Enter your weight in kg"
                      }
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Toggle Imperial System and Metric System */}
            <Toggle
              size="sm"
              className="text-white"
              aria-label="Toggle Imperial System and Metric System"
              pressed={imperialSystem}
              onPressedChange={setImperialSystem}
            >
              {imperialSystem ? "ft/in/lbs" : "cm/kg"}
            </Toggle>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
