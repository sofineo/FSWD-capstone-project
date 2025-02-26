//https://ui.shadcn.com/docs/components/form
//https://ui.shadcn.com/blocks/authentication

import { SignUpForm } from "@/components/SignUpForm";

export function SignUp() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
