import React, { useState } from 'react';
import { CoreConcept } from '../types';
import { BookOpen, CheckCircle2, Copy, Check, FunctionSquare, AlertCircle, Compass, Zap } from 'lucide-react';

interface CoreConceptViewProps {
  coreConcept: CoreConcept;
  paperTitle: string;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({ coreConcept, paperTitle }) => {
  const [copied, setCopied] = useState(false);

  // Calculate actual total word count
  const totalWords = (
    coreConcept.problemStatement +
    ' ' +
    coreConcept.primaryMethodology +
    ' ' +
    coreConcept.algorithmicBreakthroughs
  )
    .trim()
    .split(/\s+/).length;

  const isUnderLimit = totalWords <= 300;

  const handleCopySection = async () => {
    const text = `### 1. CORE CONCEPT EXTRACTION
**Problem Statement:** ${coreConcept.problemStatement}

**Primary Methodology:** ${coreConcept.primaryMethodology}

**Key Mathematical/Algorithmic Breakthroughs:** ${coreConcept.algorithmicBreakthroughs}
${
  coreConcept.keyFormulas.length > 0
    ? '\n**Key Formulas:**\n' +
      coreConcept.keyFormulas
        .map((f) => `- ${f.label}: \`${f.formula}\`\n  *${f.explanation}*`)
        .join('\n')
    : ''
}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400 font-mono">
                Section 1
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-medium text-slate-300">Core Concept Extraction</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-100">
              High-Density CS Undergraduate Analysis
            </h3>
          </div>
        </div>

        {/* Word Count Badge & Copy */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
              isUnderLimit
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{totalWords} words</span>
            <span className="text-[10px] opacity-75">(Target: &lt; 300)</span>
          </div>

          <button
            onClick={handleCopySection}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            title="Copy Core Concept Section"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Section'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Concept Blocks */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Problem Statement */}
        <div className="flex flex-col rounded-xl bg-slate-950/60 border border-slate-800/90 p-4 relative group hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 mb-2.5 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Problem Statement</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {coreConcept.problemStatement}
          </p>
        </div>

        {/* 2. Primary Methodology */}
        <div className="flex flex-col rounded-xl bg-slate-950/60 border border-slate-800/90 p-4 relative group hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 mb-2.5 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Primary Methodology</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {coreConcept.primaryMethodology}
          </p>
        </div>

        {/* 3. Algorithmic Breakthroughs */}
        <div className="flex flex-col rounded-xl bg-slate-950/60 border border-slate-800/90 p-4 relative group hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 mb-2.5 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Algorithmic Breakthrough</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {coreConcept.algorithmicBreakthroughs}
          </p>
        </div>
      </div>

      {/* Key Formulas & Mathematical Breakthroughs */}
      {coreConcept.keyFormulas && coreConcept.keyFormulas.length > 0 && (
        <div className="px-6 pb-6 pt-1">
          <div className="rounded-xl bg-slate-950/80 border border-slate-800/90 p-4">
            <div className="flex items-center gap-2 mb-3 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <FunctionSquare className="w-4 h-4" />
              <span>Key Mathematical Formulations</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {coreConcept.keyFormulas.map((kf, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between"
                >
                  <div className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                    <span>{kf.label}</span>
                    <span className="text-[10px] font-mono text-slate-500">Eq. {idx + 1}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 font-mono text-xs text-cyan-300 overflow-x-auto my-1.5 selection:bg-cyan-500/30">
                    <code>{kf.formula}</code>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    {kf.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
