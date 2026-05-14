"use client";

import { useState } from "react";
import { ApiKeyBar, authHeaders, useOpenAISettings } from "@/components/ApiKeyBar";

export default function Home() {
  const settings = useOpenAISettings();
  const { apiKey, model } = settings;
  const [code, setCode] = useState(`function login(req) {
  const token = req.query.token;
  db.query("SELECT * FROM users WHERE token = '" + token + "'");
}`);
  const [language, setLanguage] = useState("javascript");
  const [focus, setFocus] = useState("Injection risks and unsafe query construction");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setOutput("");
    if (!apiKey.trim()) {
      setError("Add your OpenAI API key above.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: authHeaders(apiKey),
        body: JSON.stringify({ code, language, focus, model }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setOutput(JSON.stringify(data.result ?? data, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300/90">
          Neuron suite · 04
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Prism Code Sentinel
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Severity-tagged review with exploit sketches where relevant, fixes, and tests worth
          adding — tuned for security-minded teams.
        </p>
      </header>

      <ApiKeyBar settings={settings} accent="from-rose-500 to-slate-200" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span className="text-zinc-300">Language</span>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-rose-400/60"
              />
            </label>
            <label className="block space-y-2 text-sm md:col-span-1">
              <span className="text-zinc-300">Focus</span>
              <input
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-rose-400/60"
              />
            </label>
          </div>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Code</span>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs outline-none focus:border-rose-400/60 md:text-sm"
            />
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={run}
            className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-3 text-sm font-semibold text-rose-950 shadow-lg shadow-rose-500/30 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Scanning…" : "Run sentinel review"}
          </button>
        </div>
        <div className="flex min-h-[520px] flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-xs md:text-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Review JSON</span>
            {error ? <span className="text-rose-400">Error</span> : null}
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <pre className="flex-1 overflow-auto whitespace-pre-wrap text-zinc-100">{output}</pre>
        </div>
      </div>
    </div>
  );
}
