import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { HashLink } from "react-router-hash-link";
import { useAuth, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Header() {
  const { isLoaded, signOut } = useAuth();

  if (!isLoaded) {
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <span>Loading...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <HashLink to="/" className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Darma</span>
        </HashLink>

        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <HashLink
                smooth
                to="/#features"
                className="text-gray-600 hover:text-blue-600"
                aria-label="Navigate to Features section"
              >
                Features
              </HashLink>
            </li>
            <li>
              <HashLink
                smooth
                to="/#how-it-works"
                className="text-gray-600 hover:text-blue-600"
                aria-label="Navigate to How It Works section"
              >
                How-it-works
              </HashLink>
            </li>
            <li>
              <HashLink
                smooth
                to="/#notify-me"
                className="text-gray-600 hover:text-blue-600"
                aria-label="Navigate to Contact section"
              >
                Contact
              </HashLink>
            </li>

            <SignedOut>
              <li>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </li>
            </SignedOut>

            <SignedIn>
              <li>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (err) {
                      console.error("Error during sign-out:", err);
                    }
                  }}
                >
                  Logout
                </Button>
              </li>
              <li>
                <UserButton />
              </li>
            </SignedIn>
          </ul>
        </nav>
      </div>
    </header>
  );
}
