//https://ui.shadcn.com/docs/components/form
//https://ui.shadcn.com/blocks/authentication
import { SignInForm } from "@/components/sign-in-form";

export function SignIn() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignInForm />
      </div>
    </div>
  );
}
