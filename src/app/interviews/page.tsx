"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle2,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";

export default function InterviewsPage() {
  const [interviewType, setInterviewType] = useState("TECHNICAL");
  const [duration, setDuration] = useState("45");
  const [interviewerName, setInterviewerName] = useState("Maya Hartwell");
  const [location, setLocation] = useState("meet.google.com/talent-pilot-eval");
  const [selectedSlot, setSelectedSlot] = useState("Tuesday, 10:00 AM - 10:45 AM");
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const handleSchedule = () => {
    setScheduledSuccess(true);
    setTimeout(() => setScheduledSuccess(false), 4000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar
        user={{
          id: "recruiter-maya",
          name: "Maya Hartwell",
          email: "recruiter@demo.example",
          role: "RECRUITER",
        }}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Schedule Interview — Ethan Calder"
          description="Coordinate candidate interview slots, attach tailored question kits, and issue invites."
          breadcrumbs={[
            { label: "Candidates", href: "/applications" },
            { label: "Ethan Calder", href: "/applications/app-ethan-backend" },
            { label: "Schedule Interview" },
          ]}
        />

        {scheduledSuccess && (
          <div className="mb-6 rounded-lg border border-[#C1DEC6] bg-[#EAF3EC] p-4 text-xs font-semibold text-[#3D784A]">
            Interview successfully scheduled for Ethan Calder on {selectedSlot}. Calendar invite dispatched.
          </div>
        )}

        {/* TWO-COLUMN CALENDAR & CONFIG WORKSPACE (Wireframe R09) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Config Panel (4 cols) matching R09 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#242522] border-b border-[#E2DDD5] pb-3">
                Interview Details
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#242522] mb-1">
                  Interview Type
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-xs font-medium text-[#242522] focus:border-[#D97745] focus:outline-none"
                >
                  <option value="TECHNICAL">Technical Deep Dive</option>
                  <option value="PHONE_SCREEN">Initial Recruiter Screen</option>
                  <option value="HR">Behavioral &amp; Culture Fit</option>
                  <option value="PANEL">Executive Panel Interview</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242522] mb-1">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-xs font-medium text-[#242522] focus:border-[#D97745] focus:outline-none"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242522] mb-1">
                  Primary Interviewer
                </label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242522] mb-1">
                  Meeting Location / Virtual Room
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-none"
                />
              </div>

              {/* Attachment Kit Selector */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#242522] mb-1">
                  Interview Kit Attachment
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-2.5 text-xs">
                  <Paperclip className="h-4 w-4 text-[#D97745]" />
                  <span className="font-semibold text-[#242522]">
                    Backend_Technical_Kit.pdf
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Calendar Grid (8 cols) matching R09 */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#242522]">
                    Availability &amp; Time Slots
                  </h3>
                  <p className="text-xs text-[#77776E]">
                    Select an optimal slot matching interviewer and candidate availability
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#242522]">November 2026</span>
                  <div className="flex gap-1">
                    <button type="button" className="rounded p-1 border hover:bg-[#FAF8F5]">
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className="rounded p-1 border hover:bg-[#FAF8F5]">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Time Slots Table */}
              <div className="grid grid-cols-5 gap-3 text-center text-xs">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => (
                  <div key={day} className="space-y-2">
                    <div className="rounded-lg bg-[#FAF8F5] border border-[#E2DDD5] py-1.5 font-bold text-[#242522]">
                      {day} {10 + idx}
                    </div>

                    {/* Time chips */}
                    {["09:00 AM", "10:00 AM", "02:00 PM", "04:00 PM"].map((time) => {
                      const slotLabel = `${day}, ${time}`;
                      const isSelected = selectedSlot.startsWith(`${day === "Tue" ? "Tuesday" : day}`);

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedSlot(`${day === "Tue" ? "Tuesday" : day}, ${time}`)}
                          className={`w-full rounded-md py-2 border text-xs font-semibold transition-all ${
                            day === "Tue" && time === "10:00 AM"
                              ? "bg-[#D97745] text-white border-[#D97745] shadow-xs"
                              : "bg-white border-[#E2DDD5] text-[#242522] hover:border-[#D97745]"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Selected Slot Footer Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E2DDD5]">
                <div className="text-xs text-left">
                  <span className="text-[#77776E] block">Selected Interview Slot:</span>
                  <span className="font-bold text-[#D97745] text-sm">{selectedSlot}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSchedule}
                    className="inline-flex items-center gap-2 rounded-md bg-[#D97745] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Calendar Invite</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
