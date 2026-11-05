"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { QuestionPanel } from "@/components/questions/question-panel";
import { HelpCircle, ArrowLeft } from "lucide-react";
import type { UserDTO } from "@/lib/dto";

function QuestionsContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");

  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <PageHeader
          title="Interview Question Generator"
          description="Prepare structured, role-specific interview kits tailored to applicant strengths and evaluated gaps."
          breadcrumbs={[
            { label: "Applications", href: "/applications" },
            ...(applicationId
              ? [{ label: "Candidate", href: `/applications/${applicationId}` }]
              : []),
            { label: "Interview Questions" },
          ]}
          actions={
            applicationId ? (
              <Link
                href={`/applications/${applicationId}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Candidate
              </Link>
            ) : null
          }
        />

        {!applicationId ? (
          <EmptyState
            title="Select an Application"
            description="Interview question generation requires an active candidate application. Please select a candidate from your applications list."
            icon={HelpCircle}
            actionLabel="View Applications"
            actionHref="/applications"
          />
        ) : (
          <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs">
            <QuestionPanel applicationId={applicationId} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-[#F5F2EC] items-center justify-center p-8 text-xs text-[#77776E]">
          Loading question kit...
        </div>
      }
    >
      <QuestionsContent />
    </Suspense>
  );
}
