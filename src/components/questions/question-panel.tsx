"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  HelpCircle,
  Loader2,
  BookOpen,
  User,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorDisplay } from "@/components/shared/error-display";
import type { QuestionDTO, QuestionCategory } from "@/lib/dto";

interface QuestionPanelProps {
  applicationId: string;
}

const CATEGORY_LABELS: Record<QuestionCategory, { label: string; color: string; bg: string; border: string }> = {
  TECHNICAL: {
    label: "Technical",
    color: "text-[#3D784A]",
    bg: "bg-[#EAF3EC]",
    border: "border-[#C1DEC6]",
  },
  PROJECT: {
    label: "Project Evidence",
    color: "text-[#D97745]",
    bg: "bg-[#F9ECE5]",
    border: "border-[#ECC9B6]",
  },
  BEHAVIORAL: {
    label: "Behavioral",
    color: "text-[#4A6B82]",
    bg: "bg-[#EDF3F7]",
    border: "border-[#BED1DF]",
  },
  ROLE_FIT: {
    label: "Role Fit",
    color: "text-[#C9862C]",
    bg: "bg-[#FAF2E6]",
    border: "border-[#F3DCB7]",
  },
};

export function QuestionPanel({ applicationId }: QuestionPanelProps) {
  const [questions, setQuestions] = useState<QuestionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New question form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState<QuestionCategory>("TECHNICAL");
  const [addingQuestion, setAddingQuestion] = useState(false);

  // Edit question state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editQuestionCategory, setEditQuestionCategory] = useState<QuestionCategory>("TECHNICAL");
  const [savingEdit, setSavingEdit] = useState(false);

  // Replace AI questions toggle
  const [replaceAi, setReplaceAi] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/questions?applicationId=${applicationId}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load questions");
      }
      setQuestions(json.data.questions || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to retrieve interview questions");
      }
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          count: 8,
          replaceAiQuestions: replaceAi,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Generation failed");
      }
      setQuestions(json.data.questions || []);
      setFeedback("Tailored interview questions successfully generated via Gemini!");
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate questions");
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestionText.trim().length < 5) return;

    setAddingQuestion(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          question: newQuestionText.trim(),
          category: newQuestionCategory,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to add question");
      }
      setQuestions((prev) => [...prev, json.data.question]);
      setNewQuestionText("");
      setShowAddForm(false);
      setFeedback("Recruiter question added.");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleStartEdit = (q: QuestionDTO) => {
    setEditingId(q.id);
    setEditQuestionText(q.question);
    setEditQuestionCategory(q.category);
  };

  const handleSaveEdit = async (questionId: string) => {
    if (editQuestionText.trim().length < 5) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editQuestionText.trim(),
          category: editQuestionCategory,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update question");
      }
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? json.data.question : q))
      );
      setEditingId(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to delete question");
      }
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E2DDD5] bg-[#FAF8F5] p-5 shadow-2xs">
        <div>
          <h3 className="font-heading text-base font-bold text-[#242522] flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#D97745]" />
            Structured Interview Kit
          </h3>
          <p className="text-xs text-[#77776E] mt-0.5">
            Role-specific interview questions aligned with resume deliverables and assessed gaps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {generating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating Kit...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Generate with Gemini
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Custom
          </button>
        </div>
      </div>

      {/* Generation Options banner */}
      <div className="flex items-center justify-between text-xs text-[#77776E] px-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={replaceAi}
            onChange={(e) => setReplaceAi(e.target.checked)}
            className="rounded border-[#E2DDD5] text-[#D97745] focus:ring-[#D97745]"
          />
          <span>Replace prior AI questions upon regeneration</span>
        </label>
        <span>{questions.length} total questions</span>
      </div>

      {feedback && (
        <div className="rounded-lg border border-[#C1DEC6] bg-[#EAF3EC] p-3 text-xs font-semibold text-[#3D784A]">
          {feedback}
        </div>
      )}

      {error && <ErrorDisplay message={error} onRetry={fetchQuestions} />}

      {/* Add Custom Question Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddQuestion}
          className="rounded-2xl border border-[#D97745]/40 bg-white p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-2">
            <h4 className="text-xs font-bold text-[#242522]">New Recruiter Question</h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-[#77776E] hover:text-[#242522]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-1">
                Category
              </label>
              <select
                value={newQuestionCategory}
                onChange={(e) => setNewQuestionCategory(e.target.value as QuestionCategory)}
                className="w-full sm:w-64 rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
              >
                <option value="TECHNICAL">Technical Competency</option>
                <option value="PROJECT">Project Evidence</option>
                <option value="BEHAVIORAL">Behavioral</option>
                <option value="ROLE_FIT">Role Fit</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-1">
                Question Prompt
              </label>
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Type your structured interview question here..."
                rows={3}
                required
                minLength={5}
                maxLength={500}
                className="w-full rounded-md border border-[#E2DDD5] bg-white p-2.5 text-xs text-[#242522] placeholder-[#77776E]/60 focus:border-[#D97745] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingQuestion || newQuestionText.trim().length < 5}
              className="rounded-md bg-[#242522] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#3A3B37] disabled:opacity-50"
            >
              {addingQuestion ? "Saving..." : "Save Question"}
            </button>
          </div>
        </form>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-3 animate-pulse" aria-label="Loading questions">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl border border-[#E2DDD5] bg-white p-4" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        /* Empty state */
        <EmptyState
          title="No Interview Questions Prepared"
          description="Generate structured, evidence-based interview questions tailored to this candidate using Gemini, or add your own custom questions."
          icon={HelpCircle}
          actionLabel={generating ? "Generating..." : "Generate Interview Kit"}
          onAction={handleGenerate}
        />
      ) : (
        /* Questions List */
        <div className="space-y-3.5">
          {questions.map((q, idx) => {
            const catConfig = CATEGORY_LABELS[q.category] || CATEGORY_LABELS.TECHNICAL;
            const isEditing = editingId === q.id;

            return (
              <div
                key={q.id}
                className="rounded-xl border border-[#E2DDD5] bg-white p-4 shadow-2xs hover:border-[#D97745]/30 transition-all space-y-3"
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DDD5] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#77776E]">Q{idx + 1}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${catConfig.bg} ${catConfig.color} ${catConfig.border}`}
                    >
                      {catConfig.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        q.source === "AI"
                          ? "bg-[#FAF8F5] text-[#D97745] border border-[#E2DDD5]"
                          : "bg-[#E8E3DA] text-[#242522]"
                      }`}
                    >
                      {q.source === "AI" ? (
                        <>
                          <Sparkles className="h-2.5 w-2.5" /> AI
                        </>
                      ) : (
                        <>
                          <User className="h-2.5 w-2.5" /> Recruiter
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {!isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(q)}
                          className="rounded p-1 text-[#77776E] hover:text-[#242522] hover:bg-[#FAF8F5] transition-colors"
                          title="Edit question"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(q.id)}
                          className="rounded p-1 text-[#BA3D35]/70 hover:text-[#BA3D35] hover:bg-[#F8ECEB] transition-colors"
                          title="Delete question"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Question Body or Edit Form */}
                {isEditing ? (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <select
                        value={editQuestionCategory}
                        onChange={(e) => setEditQuestionCategory(e.target.value as QuestionCategory)}
                        className="rounded border border-[#E2DDD5] bg-white px-2.5 py-1 text-xs text-[#242522]"
                      >
                        <option value="TECHNICAL">Technical</option>
                        <option value="PROJECT">Project Evidence</option>
                        <option value="BEHAVIORAL">Behavioral</option>
                        <option value="ROLE_FIT">Role Fit</option>
                      </select>
                    </div>
                    <textarea
                      value={editQuestionText}
                      onChange={(e) => setEditQuestionText(e.target.value)}
                      rows={2}
                      className="w-full rounded border border-[#E2DDD5] p-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="inline-flex items-center gap-1 rounded border border-[#E2DDD5] px-2.5 py-1 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5]"
                      >
                        <X className="h-3 w-3" /> Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(q.id)}
                        disabled={savingEdit || editQuestionText.trim().length < 5}
                        className="inline-flex items-center gap-1 rounded bg-[#D97745] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#C46332]"
                      >
                        <Check className="h-3 w-3" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#242522] leading-relaxed">
                      {q.question}
                    </p>

                    {q.rationale && (
                      <div className="rounded-md bg-[#FAF8F5] border border-[#E2DDD5] p-2 text-[11px] text-[#77776E]">
                        <span className="font-bold text-[#242522]">Guidance: </span>
                        {q.rationale}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
