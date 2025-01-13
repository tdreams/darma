import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Darma</span>
        </Link>

        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link
                to="#features"
                className="text-gray-600 hover:text-blue-600"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="#how-it-works"
                className="text-gray-600 hover:text-blue-600"
              >
                How-it-works
              </Link>
            </li>
            <li>
              <Link to="#contact" className="text-gray-600 hover:text-blue-600">
                Contact
              </Link>
            </li>
            {/* TODO: Add session Hooks Here!!*/}
            <li>
              <Link to="/login">
                <Button variant={"outline"}>Logins</Button>
              </Link>
            </li>

            <li>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
