"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Users,
  LayoutDashboard,
  BarChart3,
  Search,
  Bell,
  Menu,
  X,
  Compass,
  FileText,
  User,
  LogOut,
} from "lucide-react";

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: "RECRUITER" | "CANDIDATE";
  } | null;
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // Recruiter nav items per wireframe R01 & R10
  const recruiterLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Jobs", href: "/jobs", icon: Briefcase },
    { label: "Candidates", href: "/applications", icon: Users },
    { label: "Comparison", href: "/comparison", icon: Compass },
    { label: "Reports", href: "/analytics", icon: BarChart3 },
    { label: "Interviews", href: "/interviews", icon: FileText },
  ];

  // Candidate nav items
  const candidateLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Browse Jobs", href: "/jobs", icon: Briefcase },
    { label: "My Applications", href: "/applications", icon: FileText },
    { label: "Profile", href: "/profile", icon: User },
  ];

  // Public landing links per landing.jpeg
  const publicLinks = [
    { label: "Product", href: "/#product" },
    { label: "Capabilities", href: "/#capabilities" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Benefits", href: "/#benefits" },
  ];

  const activeLinks = !user
    ? publicLinks
    : user.role === "RECRUITER"
    ? recruiterLinks
    : candidateLinks;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2DDD5] bg-[#F5F2EC]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href={user ? "/dashboard" : "/"}
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D97745] text-white shadow-sm">
              <Compass className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-[#242522]">
                TalentPilot
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#77776E] font-medium -mt-1">
                Recruitment Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {activeLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#D97745] font-semibold"
                      : "text-[#77776E] hover:text-[#242522]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-[-17px] left-0 right-0 h-[2.5px] bg-[#D97745] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Area: Search & Actions / User */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {/* Search Bar per wireframe R01 */}
              <div className="relative w-64 lg:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77776E]" />
                <input
                  type="text"
                  placeholder="Search jobs, candidates..."
                  className="w-full rounded-md border border-[#E2DDD5] bg-white py-1.5 pl-9 pr-3 text-xs text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:outline-none focus:ring-1 focus:ring-[#D97745]"
                />
              </div>

              {/* Notifications */}
              <button
                type="button"
                className="relative rounded-md p-2 text-[#77776E] hover:bg-[#E8E3DA] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#D97745]" />
              </button>

              {/* User Profile Badge */}
              <div className="flex items-center gap-3 pl-2 border-l border-[#E2DDD5]">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-[#242522]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#77776E] uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#E8E3DA] border border-[#E2DDD5] flex items-center justify-center font-semibold text-xs text-[#242522]">
                  {user.name.charAt(0)}
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-[#77776E] hover:text-[#BA3D35] transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-[#242522] hover:text-[#D97745] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-[#D97745] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#C46332] transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-[#242522] hover:bg-[#E8E3DA]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-[#E2DDD5] bg-[#F5F2EC] px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-2">
            {activeLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-[#242522] hover:bg-[#E8E3DA]"
              >
                {item.label}
              </Link>
            ))}
            {!user ? (
              <div className="flex flex-col gap-2 pt-3 border-t border-[#E2DDD5]">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-[#242522]"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-md bg-[#D97745] py-2 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#E2DDD5] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#242522]">{user.name}</p>
                  <p className="text-[10px] text-[#77776E]">{user.email}</p>
                </div>
                {onLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="text-xs font-medium text-[#BA3D35]"
                  >
                    Log Out
                  </button>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
