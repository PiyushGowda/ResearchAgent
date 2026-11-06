import React, { useState } from 'react';
import { PaperAnalysis } from '../types';
import { X, Copy, Check, Download, FileText, Share2, Sparkles } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: PaperAnalysis;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownReport = `# ${analysis.title}
*Authors: ${analysis.authors} (${analysis.year})*

---

### 1. CORE CONCEPT EXTRACTION

**Problem Statement:**
${analysis.coreConcept.problemStatement}

**Primary Methodology:**
${analysis.coreConcept.primaryMethodology}

**Key Mathematical/Algorithmic Breakthroughs:**
${analysis.coreConcept.algorithmicBreakthroughs}

${
  analysis.coreConcept.keyFormulas && analysis.coreConcept.keyFormulas.length > 0
    ? `**Key Formulations:**\n` +
      analysis.coreConcept.keyFormulas
        .map((f, i) => `\n- **Formula ${i + 1} (${f.label}):** \`${f.formula}\`\n  *Explanation:* ${f.explanation}`)
        .join('\n')
    : ''
}

---

### 2. ARCHITECTURAL FLOWCHART (Mermaid.js)

\`\`\`mermaid
${analysis.mermaidDiagram.trim()}
\`\`\`

---

### 3. FUTURE WORK & RESUME PROJECT EXTENSIONS

${analysis.futureWorkExtensions
  .map(
    (ext, i) => `#### Portfolio Project ${i + 1}: ${ext.title}
- **Extension:** ${ext.extension}
- **Target Metric:** ${ext.targetMetric}
- **Tech Stack:** ${ext.techStack}
- **Difficulty & Timeline:** ${ext.difficulty} (${ext.timelineWeeks} Weeks)
- **Target Resume Impact:** "${ext.resumeBullet}"

\`\`\`${ext.starterCodeLanguage || 'python'}
# Starter code snippet
${ext.starterCodeSnippet}
\`\`\`
`
  )
  .join('\n\n')}
`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdownReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Export CS Research Dossier
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Full 3-section structured markdown output ready for portfolio GitHub README or Notion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-slate-300 bg-slate-950 selection:bg-indigo-500/30">
          <pre className="whitespace-pre-wrap leading-relaxed">{markdownReport}</pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div className="text-xs text-slate-500 font-mono">
            {markdownReport.split(/\s+/).length} total words • 3 Mandatory Sections
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-900/30"
            >
              <Download className="w-4 h-4" />
              <span>Download .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
