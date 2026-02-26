import { useState, useEffect } from 'react';
import { useSimulation } from "./hooks/useSimulation";
import { Layout } from "./components/Layout";
import { ReviewDashboard } from "./components/review/ReviewDashboard";
import { LiveStreamPanel } from "./components/panels/LiveStreamPanel";
import { ClinicalSignsPanel } from "./components/panels/ClinicalSignsPanel";
import { DifferentialDiagnosisPanel } from "./components/panels/DifferentialDiagnosisPanel";
import { WorkflowPanel } from "./components/panels/WorkflowPanel";
import logo from './assets/provet_logo.png';
import { Button } from "./components/ui/Button";
import { Play, Pause, Brain, Database, AlertTriangle, Zap, CheckCircle, Eye } from "lucide-react";

const STAGE_LABELS = ['Start', 'History', 'Exam', 'Labs', 'Results', 'Discharge'];

// Stage descriptions for non-clinical viewers
const STAGE_DESCRIPTIONS: Record<number, string> = {
  1: 'Listening to the owner describe symptoms — AI extracts clinical concepts in real time',
  2: 'Physical examination — AI maps findings to standardised terminology',
  3: 'Ordering diagnostic tests based on AI recommendations',
  4: 'Lab results confirm diagnosis — AI generates treatment protocol',
  5: 'AI drafts discharge letter with all clinical details'
};

function App() {
  const simulation = useSimulation();
  const { stage, data, isTyping, advanceStage, confirmDiagnosis, isPaused, togglePause, isStandardized, toggleStandardization, generateProtocol, isAutoPlay, startAutoPlay, stopAutoPlay, aiConfidence } = simulation;

  const [viewMode, setViewMode] = useState<'simulation' | 'review'>('simulation');
  const [showStdFlash, setShowStdFlash] = useState(false);
  const [prevStage, setPrevStage] = useState(0);
  const [showStageComplete, setShowStageComplete] = useState(false);
  const [showTogglePrompt, setShowTogglePrompt] = useState(false);
  const [togglePromptDismissed, setTogglePromptDismissed] = useState(false);

  const handleToggleStandardization = () => {
    toggleStandardization();
    setShowStdFlash(true);
    setTogglePromptDismissed(true);
    setShowTogglePrompt(false);
    setTimeout(() => setShowStdFlash(false), 600);
  };

  // Stage completion micro-feedback
  useEffect(() => {
    if (stage > prevStage && prevStage > 0) {
      setShowStageComplete(true);
      setTimeout(() => setShowStageComplete(false), 1500);
    }
    setPrevStage(stage);
  }, [stage, prevStage]);

  // Toggle discovery prompt — appears at stage 4 if user hasn't toggled yet
  useEffect(() => {
    if (stage === 4 && !togglePromptDismissed && data.treatmentPlan.length > 0) {
      const timer = setTimeout(() => setShowTogglePrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [stage, togglePromptDismissed, data.treatmentPlan]);

  // Render content
  if (viewMode === 'review') {
    return <ReviewDashboard onExit={() => setViewMode('simulation')} />;
  }

  // Confidence colour
  const confidenceColor = aiConfidence >= 85 ? 'text-emerald-600' :
    aiConfidence >= 50 ? 'text-amber-600' : 'text-provet-neutral-400';
  const confidenceBg = aiConfidence >= 85 ? 'bg-emerald-500' :
    aiConfidence >= 50 ? 'bg-amber-500' : 'bg-provet-neutral-300';

  return (
    <>
      <Layout
        headerActions={
          stage > 0 && (
            <div className="flex items-center gap-3">
              {/* AI Confidence Meter */}
              <div className="hidden lg:flex items-center gap-2 bg-provet-neutral-50 px-3 py-1.5 rounded-full border border-provet-neutral-200">
                <Brain className={`w-4 h-4 ${confidenceColor} transition-colors duration-700`} />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-provet-neutral-500">AI</span>
                  <div className="w-16 h-2 bg-provet-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${confidenceBg}`}
                      style={{ width: `${isStandardized ? aiConfidence : Math.min(aiConfidence, 45)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold tabular-nums min-w-[2.5rem] text-right transition-colors duration-700 ${confidenceColor}`}>
                    {isStandardized ? aiConfidence : Math.min(aiConfidence, 45)}%
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-provet-neutral-200" />

              {/* Stage Progress */}
              <div className="hidden lg:flex items-center gap-1">
                {STAGE_LABELS.slice(1).map((label, i) => {
                  const stageNum = i + 1;
                  const isActive = stage === stageNum;
                  const isComplete = stage > stageNum;
                  return (
                    <div key={label} className="flex items-center">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-500 ${
                        isActive ? 'bg-provet-purple text-white shadow-sm scale-105' :
                        isComplete ? 'bg-provet-purple-bg text-provet-purple' :
                        'text-provet-neutral-400'
                      }`}>
                        {isComplete && <CheckCircle className="w-3 h-3" />}
                        {label}
                      </div>
                      {i < STAGE_LABELS.length - 2 && (
                        <div className={`w-3 h-px mx-0.5 transition-colors duration-500 ${isComplete ? 'bg-provet-purple-lighter' : 'bg-provet-neutral-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="h-6 w-px bg-provet-neutral-200" />

              <button
                onClick={handleToggleStandardization}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${isStandardized
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 ring-1 ring-indigo-200'
                  : 'bg-red-50 text-red-700 border border-red-300 ring-1 ring-red-200 animate-pulse'
                  }`}
                title="Toggle Data Standardisation — see how data quality impacts AI accuracy"
              >
                {isStandardized ? <Database className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{isStandardized ? "Standardised Data" : "⚠ Legacy Free-Text"}</span>
              </button>

              <div className="h-6 w-px bg-provet-neutral-200" />

              {/* Auto-play indicator */}
              {isAutoPlay && (
                <button
                  onClick={stopAutoPlay}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-provet-purple text-white hover:bg-provet-purple-light transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>AUTO</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </button>
              )}

              <Button
                onClick={togglePause}
                variant="secondary"
                size="sm"
                className={`flex items-center space-x-2 ${isPaused ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200' : ''}`}
              >
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </Button>
            </div>
          )
        }
        stageDescription={stage > 0 ? STAGE_DESCRIPTIONS[stage] : undefined}
        left={
          <LiveStreamPanel
            transcript={data.transcript}
            isTyping={isTyping}
            isPaused={isPaused}
          />
        }
        center={
          <div className="flex flex-col h-full">
            <ClinicalSignsPanel signs={data.clinicalSigns} isStandardized={isStandardized} />
            <DifferentialDiagnosisPanel
              diagnoses={data.diagnoses}
              onConfirm={() => confirmDiagnosis()}
              canConfirm={stage === 3}
              onGenerateProtocol={generateProtocol}
              showProtocolAction={stage === 4 && data.treatmentPlan.length === 0}
              isStandardized={isStandardized}
            />
          </div>
        }
        right={
          <WorkflowPanel simulation={simulation} />
        }
      />

      {/* Stage Completion Flash */}
      {showStageComplete && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="bg-provet-purple text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <CheckCircle className="w-6 h-6" />
            <span className="font-bold text-lg">{STAGE_LABELS[prevStage]} Complete</span>
          </div>
        </div>
      )}

      {/* Standardisation Flash Overlay */}
      {showStdFlash && (
        <div className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-500 ${
          isStandardized ? 'bg-indigo-500/10' : 'bg-red-500/15'
        } animate-pulse`} />
      )}

      {/* Toggle Discovery Prompt */}
      {showTogglePrompt && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-provet-neutral-900/95 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md backdrop-blur-sm border border-provet-neutral-700">
            <div className="flex items-start gap-3">
              <div className="bg-provet-purple p-2 rounded-lg shrink-0">
                <Zap className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <div className="font-bold text-sm mb-1">Try this: flip the toggle</div>
                <p className="text-xs text-provet-neutral-300 leading-relaxed">
                  Click <strong>"Standardised Data"</strong> in the header to see what happens when the AI loses access to structured clinical terminology.
                </p>
              </div>
              <button
                onClick={() => { setShowTogglePrompt(false); setTogglePromptDismissed(true); }}
                className="text-provet-neutral-400 hover:text-white text-xs shrink-0 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Overlay */}
      {stage === 0 && (
        <div className="fixed inset-0 bg-provet-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-provet-neutral-200 p-10 rounded-2xl shadow-2xl max-w-xl text-center ring-4 ring-white/20">
            <div className="flex justify-center mb-5">
              <img src={logo} alt="Provet Cloud" className="h-12 w-auto" />
            </div>
            <h2 className="text-2xl font-bold text-provet-neutral-900 mb-2">Reimagined Consultation</h2>
            <p className="text-sm text-provet-purple font-semibold uppercase tracking-wider mb-6">AI-First Clinical Workflow Prototype</p>

            <div className="bg-provet-neutral-50 rounded-xl p-4 mb-5 text-left border border-provet-neutral-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-provet-purple-light flex items-center justify-center text-base font-bold text-white shadow-sm">B</div>
                <div>
                  <div className="font-bold text-provet-neutral-900">Bella — Golden Retriever</div>
                  <div className="text-xs text-provet-neutral-600">Female • 28kg • 7 years old</div>
                </div>
              </div>
              <p className="text-xs text-provet-neutral-600 leading-relaxed">
                Owner reports increased drinking and urination. Follow a complete consultation — from history through diagnosis, treatment, and discharge — with AI assisting at every step.
              </p>
            </div>

            <div className="bg-provet-purple-bg rounded-lg p-3 mb-6 text-xs text-provet-purple leading-relaxed border border-provet-purple-lighter text-left">
              <strong>Key demo moment:</strong> Use the <Database className="w-3 h-3 inline mx-0.5 -mt-0.5" /> standardisation toggle in the header to see how data quality impacts diagnostic accuracy.
            </div>

            <div className="space-y-3">
              <Button onClick={startAutoPlay} size="lg" className="w-full text-lg shadow-lg hover:shadow-xl transform transition-transform hover:-translate-y-1" variant="primary">
                <Eye className="w-5 h-5 mr-3" /> Watch Demo
              </Button>

              <Button onClick={advanceStage} size="lg" variant="secondary" className="w-full text-provet-purple border-provet-purple-lighter hover:bg-provet-purple-bg hover:border-provet-purple-light">
                <Play className="w-5 h-5 mr-3" /> Manual Walkthrough
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-provet-neutral-200"></div>
                <span className="flex-shrink-0 mx-4 text-provet-neutral-400 text-xs uppercase font-medium">Internal Tools</span>
                <div className="flex-grow border-t border-provet-neutral-200"></div>
              </div>

              <Button
                onClick={() => setViewMode('review')}
                size="lg"
                variant="secondary"
                className="w-full text-provet-neutral-600 border-provet-neutral-200 hover:bg-provet-neutral-50"
              >
                <Brain className="w-5 h-5 mr-3" /> Clinical Review Framework
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
