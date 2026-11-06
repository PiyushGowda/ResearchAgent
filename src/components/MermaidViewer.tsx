import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Download,
  Code2,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface MermaidViewerProps {
  diagramCode: string;
  title?: string;
  explanation?: {
    nodesCount: number;
    pipelinePhases: string[];
    criticalPath: string;
  };
}

// Clean and sanitize Mermaid diagram code to strictly enforce double quotes around labels
function sanitizeMermaid(code: string): string {
  let cleaned = code.trim();
  if (cleaned.startsWith('```mermaid')) {
    cleaned = cleaned.replace(/^```mermaid\s*/, '').replace(/```$/, '').trim();
  }
  if (!cleaned.startsWith('graph ') && !cleaned.startsWith('flowchart ')) {
    cleaned = 'graph TD\n' + cleaned;
  }
  return cleaned;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({
  diagramCode,
  title,
  explanation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copied, setCopied] = useState<boolean>(false);
  const [showRawCode, setShowRawCode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const cleanCode = sanitizeMermaid(diagramCode);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#090d16',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#38bdf8',
        lineColor: '#60a5fa',
        secondaryColor: '#0f172a',
        tertiaryColor: '#1e1e38',
        fontSize: '13px',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      flowchart: {
        curve: 'basis',
        htmlLabels: true,
        useMaxWidth: false,
      },
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        setError(null);
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, cleanCode);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setError(err?.message || 'Failed to render Mermaid flowchart.');
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [cleanCode]);

  // Mouse drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (showRawCode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(`\`\`\`mermaid\n${cleanCode}\n\`\`\``);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title ? title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'architecture-flowchart'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      className={`relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/98 backdrop-blur-xl border-cyan-500/40' : 'w-full'
      }`}
    >
      {/* Top Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400 font-mono">
                Architectural Flowchart
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
                Mermaid.js (graph TD)
              </span>
            </div>
            <h4 className="text-sm font-medium text-slate-200">
              Input transformations, core model layers & tensor pathways
            </h4>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 0.15, 2.5))}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.4))}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset View"
            aria-label="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={() => setShowRawCode((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              showRawCode
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="View Raw Mermaid Code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Code</span>
          </button>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownloadSVG}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
            title="Export SVG"
            aria-label="Export SVG"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex items-center justify-center min-h-[420px] max-h-[640px] overflow-hidden select-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-slate-950 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isFullscreen ? 'flex-1 max-h-none' : ''}`}
      >
        {showRawCode ? (
          <div className="absolute inset-0 p-6 overflow-auto bg-slate-950 font-mono text-xs text-slate-300 selection:bg-cyan-500/30">
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 leading-relaxed overflow-x-auto">
              <code>{`\`\`\`mermaid\n${cleanCode}\n\`\`\``}</code>
            </pre>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
            <div className="p-3 mb-3 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Info className="w-6 h-6" />
            </div>
            <h5 className="font-semibold text-rose-300">Mermaid Rendering Warning</h5>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">{error}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowRawCode(true)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Inspect Mermaid Syntax
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
            className="w-full flex items-center justify-center p-8 transition-transform"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}

        {/* Pan and Zoom helper hint */}
        {!showRawCode && !error && (
          <div className="absolute bottom-3 left-4 flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 pointer-events-none backdrop-blur-md">
            <span className="flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Interactive Canvas: Drag to pan • Scroll to zoom
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-cyan-400">{Math.round(zoom * 100)}%</span>
          </div>
        )}
      </div>

      {/* Architectural Summary Bar */}
      {explanation && (
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/70 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-500">Pipeline Stages:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {explanation.pipelinePhases.map((phase, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-800/90 text-cyan-300 border border-slate-700/60 font-mono text-[11px]"
                  >
                    {phase}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-slate-500">Critical Path:</span>
            <span className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 truncate max-w-md">
              {explanation.criticalPath}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
