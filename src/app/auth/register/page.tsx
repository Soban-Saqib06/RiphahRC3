"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, User, Mail, Lock, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"RECRUITER" | "CANDIDATE">("RECRUITER");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the terms of service.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || "Registration failed");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F2EC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-2xl border border-[#E2DDD5] bg-white p-8 sm:p-10 shadow-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 text-[#242522]">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D97745] text-white">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-heading text-lg font-bold">TalentPilot</span>
          </Link>
        </div>

        {/* Stepper matching wireframe auth 02.jpg */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-[#D97745]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D97745] text-white text-[10px]">
                1
              </span>
              <span>Account Info</span>
            </div>
            <span className="h-px w-8 bg-[#E2DDD5]" />
            <div className="flex items-center gap-1.5 text-[#77776E]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E2DDD5] bg-[#FAF8F5] text-[10px]">
                2
              </span>
              <span>Role Setup</span>
            </div>
          </div>
          <div className="mt-2 h-0.5 w-full bg-[#E2DDD5] rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-[#D97745]" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#242522]">
            Create your account.
          </h1>
          <p className="mt-1 text-xs text-[#77776E]">
            Join the leading platform for smarter recruitment and talent insights.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-3 text-xs text-[#BA3D35]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#242522] mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77776E]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full rounded-md border border-[#E2DDD5] bg-white py-2 pl-9 pr-3 text-sm text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:outline-none focus:ring-1 focus:ring-[#D97745]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#242522] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77776E]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@example.com"
                className="w-full rounded-md border border-[#E2DDD5] bg-white py-2 pl-9 pr-3 text-sm text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:outline-none focus:ring-1 focus:ring-[#D97745]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#242522] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77776E]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-md border border-[#E2DDD5] bg-white py-2 pl-9 pr-3 text-sm text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:outline-none focus:ring-1 focus:ring-[#D97745]"
              />
            </div>
            {/* Password strength visual */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="flex-1 h-1 rounded-full bg-[#D97745]" />
              <div
                className={`flex-1 h-1 rounded-full ${
                  password.length >= 8 ? "bg-[#D97745]" : "bg-[#E2DDD5]"
                }`}
              />
              <div
                className={`flex-1 h-1 rounded-full ${
                  password.length >= 12 ? "bg-[#3D784A]" : "bg-[#E2DDD5]"
                }`}
              />
              <span className="text-[10px] text-[#77776E] ml-1">
                {password.length >= 12 ? "Strong" : password.length >= 8 ? "Medium" : "Short"}
              </span>
            </div>
          </div>

          {/* Role selector per wireframe auth 02.jpg */}
          <div>
            <label className="block text-xs font-semibold text-[#242522] mb-1.5">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-1">
              <button
                type="button"
                onClick={() => setRole("RECRUITER")}
                className={`rounded-md py-1.5 text-xs font-bold transition-all ${
                  role === "RECRUITER"
                    ? "bg-[#D97745] text-white shadow-2xs"
                    : "text-[#77776E] hover:text-[#242522]"
                }`}
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => setRole("CANDIDATE")}
                className={`rounded-md py-1.5 text-xs font-bold transition-all ${
                  role === "CANDIDATE"
                    ? "bg-[#D97745] text-white shadow-2xs"
                    : "text-[#77776E] hover:text-[#242522]"
                }`}
              >
                Candidate
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-[#E2DDD5] text-[#D97745] focus:ring-[#D97745]"
            />
            <label htmlFor="agree" className="text-xs text-[#77776E] cursor-pointer">
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#D97745] py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors disabled:opacity-60 cursor-pointer mt-2"
          >
            {loading ? "Creating Account..." : "Get Started"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#77776E]">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-[#D97745] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
