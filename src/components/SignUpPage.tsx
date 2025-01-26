import { REDIRECT_URL, SIGN_IN_URL } from "@/utils/clerkConf";
import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignUp
        routing="hash"
        signInUrl={SIGN_IN_URL}
        forceRedirectUrl={REDIRECT_URL}
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
