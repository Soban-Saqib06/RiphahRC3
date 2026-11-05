import React from "react";
import Link from "next/link";
import { Compass, Globe, ChevronDown } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E2DDD5] bg-[#FAF8F5] text-[#242522]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5 lg:grid-cols-6 text-left">
          {/* Brand & Social Column */}
          <div className="md:col-span-2 lg:col-span-3 space-y-4 pr-0 sm:pr-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D97745] text-white">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-[#242522]">
                TalentPilot
              </span>
            </div>

            <p className="max-w-sm text-sm text-[#77776E] leading-relaxed">
              Empowering recruiters with AI-driven intelligence for fairer, faster hiring.
            </p>

            {/* Social Icons per wireframe (LinkedIn, Twitter/X, Facebook) */}
            <div className="flex items-center gap-3 pt-2 text-[#77776E]">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2DDD5] bg-white text-xs font-bold hover:text-[#D97745] hover:border-[#D97745] transition-colors"
                aria-label="TalentPilot on LinkedIn"
              >
                in
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2DDD5] bg-white text-xs font-bold hover:text-[#D97745] hover:border-[#D97745] transition-colors"
                aria-label="TalentPilot on X"
              >
                𝕏
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2DDD5] bg-white text-xs font-bold hover:text-[#D97745] hover:border-[#D97745] transition-colors"
                aria-label="TalentPilot on Facebook"
              >
                f
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522]">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-[#77776E]">
              <li>
                <Link href="/#capabilities" className="hover:text-[#D97745] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-[#D97745] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  Security
                </span>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#D97745] transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  Roadmap
                </span>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522]">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-[#77776E]">
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  Blog
                </span>
              </li>
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  Case Studies
                </span>
              </li>
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  Webinars
                </span>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-[#D97745] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  API Docs
                </span>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522]">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-[#77776E]">
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  Contact
                </span>
              </li>
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  Press
                </span>
              </li>
              <li>
                <span className="hover:text-[#D97745] transition-colors cursor-pointer">
                  Partners
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar matching wireframe */}
        <div className="mt-14 border-t border-[#E2DDD5] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#77776E] gap-4">
          <p>&copy; 2025 TalentPilot. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-[#242522] cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-[#242522] cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="hover:text-[#242522] cursor-pointer transition-colors">
              Cookie Policy
            </span>

            {/* Language Selector */}
            <div className="inline-flex items-center gap-1.5 rounded border border-[#E2DDD5] bg-white px-2.5 py-1 text-xs text-[#242522]">
              <Globe className="h-3.5 w-3.5 text-[#77776E]" />
              <span>Language</span>
              <ChevronDown className="h-3 w-3 text-[#77776E]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
