import React, { useState, useEffect } from 'react';
import { PaperAnalysis } from './types';
import { PaperInputBar } from './components/PaperInputBar';
import { CoreConceptView } from './components/CoreConceptView';
import { MermaidViewer } from './components/MermaidViewer';
import { FutureWorkView } from './components/FutureWorkView';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { ExportModal } from './components/ExportModal';
import {
  Cpu,
  Layers,
  Sparkles,
  MessageSquareCode,
  FileDown,
  ExternalLink,
  BookOpen,
  Calendar,
  Users,
  CheckCircle,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [currentPaper, setCurrentPaper] = useState<PaperAnalysis | null>(null);
  const [samplePapers, setSamplePapers] = useState<PaperAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'all' | '1' | '2' | '3'>('all');

  // Load sample papers on initial mount
  useEffect(() => {
    fetch('/api/sample-papers')
      .then((res) => res.json())
      .then((data) => {
        if (data.papers && data.papers.length > 0) {
          setSamplePapers(data.papers);
          setCurrentPaper(data.papers[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to load sample papers:', err);
      });
  }, []);

  const handleAnalyze = async (input: string, type: 'url' | 'text' | 'title', title?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperInput: input,
          inputType: type,
          paperTitle: title,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze paper.');
      }

      if (data.analysis) {
        setCurrentPaper(data.analysis);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err?.message || 'Error occurred while analyzing paper.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (paper: PaperAnalysis) => {
    setCurrentPaper(paper);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Agent Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white font-sans">
                  PaperArchitect
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  CS Research Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Academic Paper Decomposition • Mermaid Architecture • 3rd-Year Portfolio Projects
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View filter tabs */}
            <div className="hidden md:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeSection === 'all'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Sections
              </button>
              <button
                onClick={() => setActiveSection('1')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeSection === '1'
                    ? 'bg-slate-800 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Core Concept
              </button>
              <button
                onClick={() => setActiveSection('2')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeSection === '2'
                    ? 'bg-slate-800 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Flowchart
              </button>
              <button
                onClick={() => setActiveSection('3')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeSection === '3'
                    ? 'bg-slate-800 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Portfolio Projects
              </button>
            </div>

            {/* Chat with Agent */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors shadow-sm"
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>Ask Agent</span>
            </button>

            {/* Export Dossier */}
            {currentPaper && (
              <button
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md shadow-cyan-950/30"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Dossier</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Paper Ingestion Input Bar */}
        <PaperInputBar
          onAnalyze={handleAnalyze}
          onSelectSample={handleSelectSample}
          samplePapers={samplePapers}
          currentPaperId={currentPaper?.id || ''}
          isLoading={isLoading}
        />

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 flex items-start gap-3 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-rose-300">Analysis Notice</div>
              <p className="mt-0.5 opacity-90 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Paper Header Card */}
        {currentPaper && (
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {currentPaper.arxivId && (
                  <span className="px-2 py-0.5 rounded font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    arXiv:{currentPaper.arxivId}
                  </span>
                )}
                {currentPaper.year && (
                  <span className="flex items-center gap-1 text-slate-400 font-mono">
                    <Calendar className="w-3 h-3" />
                    {currentPaper.year}
                  </span>
                )}
                {currentPaper.venue && (
                  <span className="text-slate-500">• {currentPaper.venue}</span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {currentPaper.title}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentPaper.authors}</span>
              </div>
            </div>

            {/* Quick links & tags */}
            <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0">
              {currentPaper.arxivUrl && (
                <a
                  href={currentPaper.arxivUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                >
                  <span>View on ArXiv</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <div className="flex flex-wrap gap-1.5 max-w-xs justify-start md:justify-end">
                {currentPaper.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Paper Decomposition Sections */}
        {currentPaper && (
          <div className="space-y-8">
            {/* Section 1: Core Concept Extraction */}
            {(activeSection === 'all' || activeSection === '1') && (
              <section id="section-1" className="scroll-mt-20">
                <CoreConceptView
                  coreConcept={currentPaper.coreConcept}
                  paperTitle={currentPaper.title}
                />
              </section>
            )}

            {/* Section 2: Architectural Flowchart (Mermaid.js) */}
            {(activeSection === 'all' || activeSection === '2') && (
              <section id="section-2" className="scroll-mt-20">
                <MermaidViewer
                  diagramCode={currentPaper.mermaidDiagram}
                  title={currentPaper.title}
                  explanation={currentPaper.diagramExplanation}
                />
              </section>
            )}

            {/* Section 3: Future Work & Resume Project Extensions */}
            {(activeSection === 'all' || activeSection === '3') && (
              <section id="section-3" className="scroll-mt-20">
                <FutureWorkView
                  extensions={currentPaper.futureWorkExtensions}
                  paperTitle={currentPaper.title}
                />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Built for Computer Science Students & Systems Researchers</span>
          </div>
          <div>Strict &lt; 300 Words Concept • Mermaid.js graph TD • 3 Portfolio Extensions</div>
        </div>
      </footer>

      {/* Interactive Chat Drawer */}
      {currentPaper && (
        <AgentChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          analysis={currentPaper}
        />
      )}

      {/* Export Dossier Modal */}
      {currentPaper && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          analysis={currentPaper}
        />
      )}
    </div>
  );
}
