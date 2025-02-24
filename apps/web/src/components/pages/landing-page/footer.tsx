import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-500">&copy; 2023 ProjectAI. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
