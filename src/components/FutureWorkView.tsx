import React, { useState } from 'react';
import { FutureWorkExtension } from '../types';
import confetti from 'canvas-confetti';
import {
  Rocket,
  Target,
  Cpu,
  Layers,
  Code2,
  FolderTree,
  CalendarDays,
  FileBadge,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FutureWorkViewProps {
  extensions: FutureWorkExtension[];
  paperTitle: string;
}

export const FutureWorkView: React.FC<FutureWorkViewProps> = ({ extensions, paperTitle }) => {
  const [selectedExtensionId, setSelectedExtensionId] = useState<string>(
    extensions[0]?.id || ''
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedResumeId, setCopiedResumeId] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState(false);
  const [savedProjects, setSavedProjects] = useState<Set<string>>(new Set());

  const activeExt = extensions.find((e) => e.id === selectedExtensionId) || extensions[0];

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyResumeBullet = async (bullet: string, id: string) => {
    try {
      await navigator.clipboard.writeText(bullet);
      setCopiedResumeId(id);
      setTimeout(() => setCopiedResumeId(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopySectionMarkdown = async () => {
    const md = `### 3. FUTURE WORK & RESUME PROJECT EXTENSIONS
Brainstorm 3 concrete, realistic ways a 3rd-year CS student can build upon or optimize this paper for a portfolio project.

${extensions
  .map(
    (ext, idx) => `#### Idea ${idx + 1}: ${ext.title}
- **Extension:** ${ext.extension}
- **Target Metric:** ${ext.targetMetric}
- **Tech Stack:** ${ext.techStack}
- **Resume Impact:** ${ext.resumeBullet}`
  )
  .join('\n\n')}`;

    try {
      await navigator.clipboard.writeText(md);
      setCopiedSection(true);
      setTimeout(() => setCopiedSection(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSaveToPortfolio = (extId: string) => {
    setSavedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(extId)) {
        next.delete(extId);
      } else {
        next.add(extId);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
          });
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
                Section 3
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-medium text-slate-300">
                Future Work & Resume Project Extensions
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-100">
              3 Concrete, Realistic 3rd-Year CS Portfolio Blueprints
            </h3>
          </div>
        </div>

        <button
          onClick={handleCopySectionMarkdown}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          title="Copy Section 3 Markdown"
        >
          {copiedSection ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedSection ? 'Copied' : 'Copy Section 3'}</span>
        </button>
      </div>

      {/* Main Grid: Left cards (the 3 ideas) & Right panel (deep dive execution blueprint) */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: The 3 Core Required Format Extensions */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Select an architectural extension below to inspect the implementation roadmap, starter PyTorch code, and Google XYZ resume bullet.
          </p>

          <div className="flex flex-col gap-3">
            {extensions.map((ext, idx) => {
              const isSelected = ext.id === selectedExtensionId;
              const isSaved = savedProjects.has(ext.id);

              return (
                <div
                  key={ext.id}
                  onClick={() => setSelectedExtensionId(ext.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                        {ext.title}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                        ext.difficulty === 'Intermediate'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : ext.difficulty === 'Advanced'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {ext.difficulty}
                    </span>
                  </div>

                  {/* Required 3 Points formatted strictly */}
                  <div className="space-y-2 mt-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold font-mono text-[11px]">
                        • Extension:{' '}
                      </span>
                      <span className="text-slate-300 leading-relaxed">{ext.extension}</span>
                    </div>

                    <div>
                      <span className="text-emerald-400 font-semibold font-mono text-[11px]">
                        • Target Metric:{' '}
                      </span>
                      <span className="text-slate-300 font-mono text-[11px] bg-slate-900/80 px-1.5 py-0.5 rounded">
                        {ext.targetMetric}
                      </span>
                    </div>

                    <div>
                      <span className="text-cyan-400 font-semibold font-mono text-[11px]">
                        • Tech Stack:{' '}
                      </span>
                      <span className="text-slate-300 font-mono text-[11px]">
                        {ext.techStack}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {ext.timelineWeeks} Weeks Timeline
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveToPortfolio(ext.id);
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        isSaved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {isSaved ? '★ Bookmarked' : '+ Save Idea'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Project Execution Kit */}
        {activeExt && (
          <div className="lg:col-span-7 flex flex-col gap-5 bg-slate-950/80 rounded-xl border border-slate-800 p-5">
            {/* Project Overview Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  Portfolio Implementation Blueprint
                </span>
                <h4 className="text-base font-bold text-slate-100 mt-0.5">
                  {activeExt.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Full starter harness tailored for a 3rd-year CS student portfolio repo.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
                {activeExt.techStack.split(',')[0]}
              </span>
            </div>

            {/* Google XYZ Resume Bullet */}
            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <FileBadge className="w-4 h-4" />
                  <span>Google XYZ Resume Bullet Point</span>
                </div>
                <button
                  onClick={() => handleCopyResumeBullet(activeExt.resumeBullet, activeExt.id)}
                  className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                >
                  {copiedResumeId === activeExt.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy for Resume</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/60 p-2.5 rounded border border-slate-800 font-sans">
                "{activeExt.resumeBullet}"
              </p>
            </div>

            {/* Milestones Timeline */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2 font-mono uppercase tracking-wider">
                <CalendarDays className="w-4 h-4 text-cyan-400" />
                <span>Execution Timeline & Milestones</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeExt.milestones.map((ms, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      {ms.week}
                    </span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                      {ms.task}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Starter Code Snippet */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-300 mb-2">
                <div className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-xs">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>Starter PyTorch / Code Boilerplate</span>
                </div>
                <button
                  onClick={() => handleCopyCode(activeExt.starterCodeSnippet, activeExt.id)}
                  className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  {copiedId === activeExt.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-xs overflow-x-auto max-h-[220px]">
                <pre className="text-cyan-300 leading-relaxed">
                  <code>{activeExt.starterCodeSnippet}</code>
                </pre>
              </div>
            </div>

            {/* GitHub Repo Scaffolding Tree */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1.5 font-mono">
                <FolderTree className="w-3.5 h-3.5 text-slate-500" />
                <span>Recommended GitHub Repository Layout</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                {activeExt.githubRepoStructure.map((path, idx) => (
                  <span key={idx} className="text-slate-300">
                    {path}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
