import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          TDATA
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
            How it Works
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
            Sign In
          </Button>
          <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
}
