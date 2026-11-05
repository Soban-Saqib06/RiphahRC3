"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Compass, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || "Invalid credentials");
      } else {
        if (data.data?.user?.role === "CANDIDATE") {
          router.push("/jobs");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Demo@12345");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F2EC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-[#E2DDD5] bg-white shadow-md overflow-hidden">
        {/* Left Side: Editorial Brand Context per auth.jpg */}
        <div className="hidden md:flex flex-col justify-between bg-[#FAF8F5] border-r border-[#E2DDD5] p-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 text-[#242522]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D97745] text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="font-heading text-lg font-bold">TalentPilot</span>
            </Link>

            <h2 className="mt-12 text-3xl font-extrabold tracking-tight text-[#242522] leading-snug">
              Evidence-based recruiting intelligence.
            </h2>
            <p className="mt-4 text-sm text-[#77776E] leading-relaxed">
              Log in to review candidates, inspect verbatim resume citations, and make confident shortlisting decisions.
            </p>
          </div>

          {/* Quick Demo Logins for Rubric Evaluator */}
          <div className="rounded-xl border border-[#E2DDD5] bg-white p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
              Evaluator Quick Credentials
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fillDemo("recruiter@demo.example")}
                className="w-full flex items-center justify-between rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] px-3 py-2 text-left text-xs text-[#242522] hover:border-[#D97745] transition-colors"
              >
                <div>
                  <span className="font-bold block">Recruiter: Maya Hartwell</span>
                  <span className="text-[#77776E]">recruiter@demo.example</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#D97745]" />
              </button>

              <button
                type="button"
                onClick={() => fillDemo("candidate1@demo.example")}
                className="w-full flex items-center justify-between rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] px-3 py-2 text-left text-xs text-[#242522] hover:border-[#D97745] transition-colors"
              >
                <div>
                  <span className="font-bold block">Candidate: Ethan Calder</span>
                  <span className="text-[#77776E]">candidate1@demo.example</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#D97745]" />
              </button>
            </div>
            <p className="text-[10px] text-[#77776E]">
              Password for all seeded accounts: <code>Demo@12345</code>
            </p>
          </div>
        </div>

        {/* Right Side: Login Form matching wireframe auth.jpg */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="text-center sm:text-left mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242522]">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-[#77776E]">
              Log in to your recruitment workspace
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-3 text-xs text-[#BA3D35]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#242522] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77776E]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-md border border-[#E2DDD5] bg-white py-2 pl-9 pr-3 text-sm text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:outline-none focus:ring-1 focus:ring-[#D97745]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242522] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77776E]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full rounded-md border border-[#E2DDD5] bg-white py-2 pl-9 pr-10 text-sm text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:outline-none focus:ring-1 focus:ring-[#D97745]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77776E] hover:text-[#242522]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#77776E] cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[#E2DDD5] text-[#D97745] focus:ring-[#D97745]"
                />
                <span>Remember me</span>
              </label>
              <span className="text-[#D97745] hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#D97745] py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#77776E]">
            New here?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-[#D97745] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
