"use client";

import React, { useState } from "react";
import { X, Copy, Check, Terminal, Database, KeyRound, PlayCircle } from "lucide-react";

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const copyEnvText = () => {
    navigator.clipboard.writeText(
      `NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your-anon-key`
    );
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Database className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Supabase Connection Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-zinc-600 dark:text-zinc-300">
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
                1
              </span>
              Create a free Supabase Project
            </h4>
            <p className="mt-1 text-xs text-zinc-500">
              Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">supabase.com</a>, log in, and click "New project".
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
                2
              </span>
              Run the Database Schema SQL
            </h4>
            <p className="mt-1 text-xs text-zinc-500">
              Open the <strong>SQL Editor</strong> in your Supabase dashboard and run the script located at:
            </p>
            <div className="mt-2 rounded-xl bg-zinc-900 p-3 font-mono text-xs text-amber-400">
              supabase/schema.sql
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              This creates the <code className="text-amber-500">rooms</code> and <code className="text-amber-500">bookings</code> tables, configures Row Level Security (RLS) policies, and populates 6 initial rooms!
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
                3
              </span>
              Add Credentials to .env.local
            </h4>
            <p className="mt-1 text-xs text-zinc-500">
              Create a <code className="text-amber-500">.env.local</code> file in this project root:
            </p>
            <div className="mt-2 relative rounded-xl bg-zinc-900 p-3 font-mono text-xs text-zinc-200">
              <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...</p>
              <button
                onClick={copyEnvText}
                className="absolute right-2 top-2 rounded-lg bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 hover:bg-zinc-700 flex items-center gap-1"
              >
                {copiedEnv ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedEnv ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
                4
              </span>
              Restart Development Server
            </h4>
            <div className="mt-2 rounded-xl bg-zinc-900 p-2.5 font-mono text-xs text-emerald-400">
              npm run dev
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              The app will automatically switch from Demo Mode to <strong>Supabase Connected</strong>!
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-100 px-6 py-3.5 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

