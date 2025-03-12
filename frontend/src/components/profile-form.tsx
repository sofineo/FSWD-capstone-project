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
import {
  cmToFeetInches,
  feetInchesToCm,
  kgToLbs,
  lbsToKg,
} from "@/utils/conversion";
import api from "@/services/api";
import { toast } from "sonner";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProfileSchema } from "@/lib/validation/ProfileSchema";
import { User } from "@/lib/types/user";
import { useImperialSystem } from "@/context/imperialSystemContext";

interface ProfileFormProps extends React.ComponentPropsWithoutRef<"div"> {
  user: User | null;
  refetchUser: () => void;
}

type Gender =
  | "male"
  | "female"
  | "non-binary"
  | "transgender"
  | "gender-fluid"
  | "prefer-not-to-say"
  | "other"
  | null;

export function ProfileForm({
  user,
  className,
  refetchUser,
  ...props
}: ProfileFormProps) {
  //Metric System
  const { toggleImperialSystem } = useImperialSystem();
  const [imperialSystemProfile, setImperialSystemProfile] = useState(false);
  const [heightFeet, setHeightFeet] = useState<number | null>(null);
  const [heightInches, setHeightInches] = useState<number | null>(null);
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [weightLbs, setWeightLbs] = useState<number | null>(null);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      email: "",
      password: { password: "", confirmPassword: "" },
      name: "",
      age: null,
      gender: null,
      imperialSystem: imperialSystemProfile,
      heightCm: null,
      heightFeet: null,
      heightInches: null,
      weightKg: null,
      weightLbs: null,
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    let finalHeight = imperialSystemProfile
      ? feetInchesToCm(values.heightFeet ?? 0, values.heightInches ?? 0)
      : values.heightCm;

    const payload = {
      email: values.email,
      password: values.password.password ? values.password.password : undefined,
      name: values.name,
      age: values.age,
      imperialSystem: imperialSystemProfile,
      gender: values.gender,
      height: finalHeight,
      weight: imperialSystemProfile ? values.weightLbs : values.weightKg,
    };

    api
      .put(`/api/users/${user?.user_id}`, payload)
      .then(() => {
        toast("Profile successfully updated!");
        refetchUser();
        if (user?.imperialSystem != imperialSystemProfile) {
          toggleImperialSystem();
        }
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

  useEffect(() => {
    setImperialSystemProfile(user?.imperialSystem ?? false);
  }, []);

  useEffect(() => {
    if (user) {
      const { feet, inches } = cmToFeetInches(user?.height || 0);
      setHeightFeet(feet);
      setHeightInches(inches);

      if (user.imperialSystem) {
        setWeightKg(user?.weight ? lbsToKg(user.weight) : null);
        console.log(weightKg);
        setWeightLbs(user?.weight || null);
      } else {
        setWeightKg(user?.weight || null);
        setWeightLbs(user?.weight ? kgToLbs(user.weight) : null);
      }

      form.reset({
        email: user.email || "",
        name: user.name || "",
        age: user.age ?? null,
        gender: (user.gender as Gender) || undefined,
        imperialSystem: imperialSystemProfile,
        heightCm: user.height ?? null,
        weightKg: user.imperialSystem ? weightKg : user.weight,
        heightFeet: heightFeet ?? null, //Form is automatically set to Metric
        heightInches: heightInches ?? null,
        weightLbs: user.imperialSystem ? user.weight : weightLbs,
      });

      //React Hook Form does not immediately update the UI when you call form.reset()
      setTimeout(() => {
        form.setValue("gender", user.gender as Gender);
      }, 0);
    }
  }, [user, form, imperialSystemProfile]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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

            <div className="grid grid-cols-4 gap-2">
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
                  <FormItem className="col-span-2">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={(field.value as Gender) || ""}
                      defaultValue={user?.gender ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger className="whitespace-nowrap">
                          <SelectValue
                            // placeholder={user?.gender ?? "Select your gender"}
                            placeholder="Select your gender"
                          />
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

              {/* Units & Measurements Preference  */}
              <FormField
                control={form.control}
                name="imperialSystem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units</FormLabel>
                    <FormControl>
                      {/* Toggle Imperial System and Metric System */}
                      <Toggle
                        size="sm"
                        className="h-9"
                        variant={"outline2"}
                        aria-label="Toggle Imperial System and Metric System"
                        pressed={field.value}
                        onPressedChange={(value) => {
                          field.onChange(value);
                          setImperialSystemProfile(value);
                        }}
                      >
                        {imperialSystemProfile ? "ft/in/lbs/oz" : "cm/kg/ml"}
                      </Toggle>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className={imperialSystemProfile ? "grid grid-cols-2 gap-2" : ""}
            >
              {/* Height */}
              <FormField
                control={form.control}
                name={imperialSystemProfile ? "heightFeet" : "heightCm"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {imperialSystemProfile ? "Height(feet)" : "Height(cm)"}
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
              {imperialSystemProfile && (
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
              name={imperialSystemProfile ? "weightLbs" : "weightKg"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {imperialSystemProfile ? "Weight(Lbs)" : "Weight(kg)"}
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
            {/* <DialogClose asChild> */}
            <Button type="submit" className="w-full">
              Update
            </Button>
            {/* </DialogClose> */}
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
