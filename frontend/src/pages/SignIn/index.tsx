//https://ui.shadcn.com/docs/components/form

import { SignInSchema } from "@/lib/validation/SignInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "@/components/mode-toggle";

export function SignIn() {
  const navigate = useNavigate();

  const { signIn } = useAuth();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof SignInSchema>) {
    signIn(values);
  }

  function handleButtonRegister() {
    navigate("/register");
  }
  return (
    <>
      <ModeToggle/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <h1 className="text-lg">Sign In</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    type="email"
                    aria-label="Email Address"
                    aria-describedby="email-help"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <span id="password-label" className="sr-only">
                  Password
                </span>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    {...field}
                    type="password"
                    aria-labelledby="password-label"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormDescription>
            Don't have an account?
            <Button
              variant={"link"}
              className="p-1"
              onClick={handleButtonRegister}
            >
              Sign Up here
            </Button>
          </FormDescription>

          <Button type="submit">Sign In</Button>
        </form>
      </Form>
    </>
  );
}
