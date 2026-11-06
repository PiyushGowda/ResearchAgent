import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Link2,
  FileText,
  Flame,
  ArrowRight,
  Loader2,
  Database,
  Cpu
} from 'lucide-react';
import { PaperAnalysis } from '../types';

interface PaperInputBarProps {
  onAnalyze: (input: string, type: 'url' | 'text' | 'title', title?: string) => Promise<void>;
  onSelectSample: (paper: PaperAnalysis) => void;
  samplePapers: PaperAnalysis[];
  currentPaperId: string;
  isLoading: boolean;
}

export const PaperInputBar: React.FC<PaperInputBarProps> = ({
  onAnalyze,
  onSelectSample,
  samplePapers,
  currentPaperId,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [inputVal, setInputVal] = useState('');
  const [paperTitle, setPaperTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onAnalyze(inputVal.trim(), activeTab, paperTitle.trim() || undefined);
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Top Bar with Mode Switcher & Quick Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('url');
              setInputVal('');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>ArXiv URL / Paper ID</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('text');
              setInputVal('');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'text'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Paper Text / Abstract</span>
          </button>
        </div>

        {/* Landmark Quick Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Landmarks:
          </span>
          {samplePapers.map((sp) => {
            const isSelected = sp.id === currentPaperId;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => onSelectSample(sp)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                {sp.id === 'deepseek-r1'
                  ? 'DeepSeek-R1'
                  : sp.id === 'mamba-ssm'
                  ? 'Mamba'
                  : sp.id === 'attention-is-all-you-need'
                  ? 'Transformers'
                  : sp.id === 'lora-finetuning'
                  ? 'LoRA'
                  : sp.title.slice(0, 15)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {activeTab === 'url' ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4 text-cyan-400" />
              </div>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Paste ArXiv URL or ID (e.g. https://arxiv.org/abs/2501.12948 or 2312.00752)..."
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-950/40 shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Deconstruct Paper</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
              placeholder="Paper Title (e.g. FlashAttention-3: Fast and Memory-Efficient Exact Attention)..."
              disabled={isLoading}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-sans"
            />
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              rows={4}
              placeholder="Paste paper abstract, methodology, or excerpts here for architectural parsing..."
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 font-mono resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-950/40"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Paper...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Architecture</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
