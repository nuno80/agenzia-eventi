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
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
            >
              Home
            </Link>

            <Link
              href={{ pathname: "/about" }}
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
            >
              CHI SIAMO
            </Link>
            <Link
              href={{ pathname: "/features" }}
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
            >
              SERVIZI
            </Link>
            <Link
              href={{ pathname: "/referenze" }}
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
            >
              REFERENZE
            </Link>
            <Link
              href={{ pathname: "/pricing" }}
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
            >
              CONTATTI
            </Link>
            {isAdmin && (
              <Link
                href={{ pathname: "/dashboard" }}
                className="text-sm font-medium text-black transition-colors hover:text-cyan"
              >
                Admin Dashboard
              </Link>
            )}
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
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href={{ pathname: "/about" }}
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
              onClick={() => setIsMenuOpen(false)}
            >
              CHI SIAMO
            </Link>
            <Link
              href={{ pathname: "/features" }}
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
              onClick={() => setIsMenuOpen(false)}
            >
              SERVIZI
            </Link>
            <Link
              href={{ pathname: "/referenze" }}
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
              onClick={() => setIsMenuOpen(false)}
            >
              REFERENZE
            </Link>
            <Link
              href={{ pathname: "/pricing" }}
              className="text-sm font-medium text-black transition-colors hover:text-cyan"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTATTI
            </Link>
            {isAdmin && (
              <Link
                href={{ pathname: "/dashboard" }}
                className="text-sm font-medium text-black transition-colors hover:text-cyan"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
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
