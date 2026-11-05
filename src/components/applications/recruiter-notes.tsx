"use client";

import React, { useState, useEffect } from "react";
import { Lock, Save, Loader2, Check, AlertCircle } from "lucide-react";

interface RecruiterNotesProps {
  applicationId: string;
  initialNotes: string | null;
  onNotesUpdated?: (notes: string | null) => void;
}

const MAX_NOTES_LENGTH = 2000;

export function RecruiterNotes({
  applicationId,
  initialNotes,
  onNotesUpdated,
}: RecruiterNotesProps) {
  const [notes, setNotes] = useState<string>(initialNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with initialNotes when received
  useEffect(() => {
    setNotes(initialNotes || "");
  }, [initialNotes]);

  const isDirty = (initialNotes || "") !== notes;

  const handleSave = async () => {
    if (!isDirty || isSaving) return;
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/applications/${applicationId}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterNotes: notes.trim() ? notes : null,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update recruiter notes");
      }

      setSaveSuccess(true);
      onNotesUpdated?.(json.data?.application?.recruiterNotes ?? null);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving notes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FAF8F5] border border-[#E2DDD5] text-[#77776E]">
            <Lock className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#242522]">Recruiter Notes</h4>
            <p className="text-[10px] text-[#77776E]">Private to team • Never visible to candidate</p>
          </div>
        </div>

        <span
          className={`text-[10px] font-medium ${
            notes.length > MAX_NOTES_LENGTH
              ? "text-[#BA3D35] font-bold"
              : "text-[#77776E]"
          }`}
        >
          {notes.length} / {MAX_NOTES_LENGTH}
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-2.5 text-xs text-[#BA3D35]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      <div className="relative">
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            if (saveSuccess) setSaveSuccess(false);
          }}
          placeholder="Add internal evaluation comments, phone screening impressions, interview talking points..."
          rows={4}
          maxLength={MAX_NOTES_LENGTH}
          disabled={isSaving}
          className="w-full resize-y rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:bg-white focus:outline-hidden transition-colors leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3D784A]">
              <Check className="h-3.5 w-3.5" /> Notes saved
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isSaving || notes.length > MAX_NOTES_LENGTH}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#242522] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#3A3B37] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-3 w-3" />
              Save Notes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
