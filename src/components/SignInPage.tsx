import { REGISTER } from "@/utils/clerkConf";
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn
        routing="hash"
        signUpUrl={REGISTER}
        appearance={{
          elements: {
            card: "shadow-lg rounded-lg",
            formFieldInput: "rounded-md border-gray-300 focus:border-blue-500",
            formFieldLabel: "text-gray-700",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
          },
        }}
      />
    </div>
  );
}
