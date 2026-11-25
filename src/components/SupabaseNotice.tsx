"use client";

import React, { useState } from "react";
import { Database, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { seedRoomsToSupabase } from "@/app/actions/booking";

interface SupabaseNoticeProps {
  isConfigured: boolean;
  onRefresh: () => void;
}

export const SupabaseNotice: React.FC<SupabaseNoticeProps> = ({
  isConfigured,
  onRefresh
}) => {
  const [copied, setCopied] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(
      `NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedMessage(null);
    try {
      const res = await seedRoomsToSupabase();
      setSeedMessage(res.message);
      if (res.success) {
        onRefresh();
      }
    } catch (err: any) {
      setSeedMessage(err?.message || "Seeding failed");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:from-zinc-900/60 dark:via-zinc-900 dark:to-zinc-900/60">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              isConfigured
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
            }`}
          >
            <Database className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {isConfigured ? "Supabase Database Connected" : "Connecting to Supabase"}
              </h4>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isConfigured
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                }`}
              >
                {isConfigured ? "LIVE" : "DEMO / FALLBACK MODE"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {isConfigured
                ? "Your app is connected to Supabase. You can seed the default rooms or manage bookings in your tables."
                : "Using sample room data and simulated bookings. To connect your live Supabase, configure .env.local and run supabase/schema.sql."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0">
          {isConfigured ? (
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSeeding ? "animate-spin" : ""}`} />
              <span>Seed Supabase Rooms</span>
            </button>
          ) : (
            <button
              onClick={handleCopyEnv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied ENV Keys" : "Copy ENV Keys"}</span>
            </button>
          )}

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/20 dark:text-amber-400"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {seedMessage && (
        <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {seedMessage}
        </div>
      )}
    </div>
  );
};

