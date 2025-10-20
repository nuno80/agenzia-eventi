"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

import { AdminDropdown } from "@/components/admin-dropdown";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMobile();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Close menu when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <img
              src="/images/logo_agenzia.png"
              alt="Nuova agenzia Logo"
              className="h-20 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link
              href="/"
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
            >
              Home
            </Link>

            <Link
              href={{ pathname: "/about" }}
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
            >
              CHI SIAMO
            </Link>
            <Link
              href={{ pathname: "/features" }}
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
            >
              SERVIZI
            </Link>
            <Link
              href={{ pathname: "/referenze" }}
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
            >
              REFERENZE
            </Link>
            <Link
              href={{ pathname: "/pricing" }}
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
            >
              CONTATTI
            </Link>
            {isAdmin && <AdminDropdown />}
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-black hover:text-cyan"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-black hover:text-cyan"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Navigation Toggle & UserButton (se loggato) */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute w-full border-b bg-white px-6 py-4 shadow-md md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href={{ pathname: "/about" }}
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              CHI SIAMO
            </Link>
            <Link
              href={{ pathname: "/features" }}
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              SERVIZI
            </Link>
            <Link
              href={{ pathname: "/referenze" }}
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              REFERENZE
            </Link>
            <Link
              href={{ pathname: "/pricing" }}
              className="hover:text-primary text-sm font-medium text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTATTI
            </Link>
            {isAdmin && (
              <div className="flex justify-center py-2">
                <AdminDropdown />
              </div>
            )}
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium text-black hover:text-cyan"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium text-black hover:text-cyan"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
