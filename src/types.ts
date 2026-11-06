export interface KeyFormula {
  label: string;
  formula: string;
  explanation: string;
}

export interface CoreConcept {
  problemStatement: string;
  primaryMethodology: string;
  algorithmicBreakthroughs: string;
  summaryWordCount: number;
  keyFormulas: KeyFormula[];
}

export interface Milestone {
  week: string;
  task: string;
}

export interface FutureWorkExtension {
  id: string;
  title: string;
  extension: string;
  targetMetric: string;
  techStack: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Research-grade';
  timelineWeeks: number;
  starterCodeSnippet: string;
  starterCodeLanguage: string;
  githubRepoStructure: string[];
  milestones: Milestone[];
  resumeBullet: string;
}

export interface DiagramExplanation {
  nodesCount: number;
  pipelinePhases: string[];
  criticalPath: string;
}

export interface PaperAnalysis {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue?: string;
  arxivId?: string;
  arxivUrl?: string;
  tags: string[];
  coreConcept: CoreConcept;
  mermaidDiagram: string;
  diagramExplanation: DiagramExplanation;
  futureWorkExtensions: FutureWorkExtension[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}
