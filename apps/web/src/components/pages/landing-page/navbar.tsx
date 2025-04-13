"use client";

import { Button } from "@/components/ui/button";
import { Paths } from "@/lib/constants";
import { MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-tdata-dark-bg/95 backdrop-blur-sm border-b border-tdata-dark-border">
      <div className="landing-container flex items-center justify-between h-16">
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-tdata-blue to-tdata-light-blue bg-clip-text text-transparent">Tdata</span>
          </a>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-tdata-light-text hover:text-white transition-colors">
            Features
          </a>
          <a href="#workflow" className="text-tdata-light-text hover:text-white transition-colors">
            Workflow
          </a>
          <a href="#collaboration" className="text-tdata-light-text hover:text-white transition-colors">
            Collaboration
          </a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href={Paths.signin}>
            <Button variant="outline">Join</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-tdata-light-text p-2">
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-tdata-dark-bg border-b border-tdata-dark-border animate-fade-in">
          <div className="landing-container py-4 space-y-4">
            <a href="#features" className="block py-2 text-tdata-light-text hover:text-white">
              Features
            </a>
            <a href="#workflow" className="block py-2 text-tdata-light-text hover:text-white">
              Workflow
            </a>
            <a href="#collaboration" className="block py-2 text-tdata-light-text hover:text-white">
              Collaboration
            </a>
            <div className="pt-4 flex flex-col space-y-3">
              <Button variant="outline" className="border-tdata-dark-border hover:border-tdata-blue hover:bg-transparent w-full">
                Join
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
