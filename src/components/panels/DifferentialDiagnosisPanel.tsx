import { Card } from "../ui/Card";
import { Brain, Info, Check, Zap, AlertTriangle } from "lucide-react";
import { Tooltip } from "../ui/Tooltip";
import type { Diagnosis } from "../../hooks/useSimulation";

interface DifferentialDiagnosisPanelProps {
    diagnoses: Diagnosis[];
    onConfirm: (id: string) => void;
    canConfirm: boolean;
    onGenerateProtocol?: () => void;
    showProtocolAction?: boolean;
    isStandardized?: boolean;
}

// Diagnosis annotations for non-clinical viewers
const DIAGNOSIS_ANNOTATIONS: Record<string, string> = {
    'Chronic Kidney Disease': 'CKD is a progressive condition common in older dogs. Early detection enables dietary management that can significantly slow progression.',
    'Diabetes Mellitus': 'Similar symptoms (drinking/urinating more) but different underlying cause. The AI uses structured data to distinguish between these.',
    'Hyperadrenocorticism': 'Also known as Cushing\'s disease. Shares some symptoms with CKD but has different physical exam findings.',
    'Kidney problem': 'Without standardised terminology, the AI cannot confidently identify this as CKD or determine the stage.',
};

function getAnnotation(name: string): string | null {
    for (const [key, value] of Object.entries(DIAGNOSIS_ANNOTATIONS)) {
        if (name.includes(key)) return value;
    }
    return null;
}

export function DifferentialDiagnosisPanel({ diagnoses, onConfirm, canConfirm, onGenerateProtocol, showProtocolAction, isStandardized = true }: DifferentialDiagnosisPanelProps) {
    const sorted = [...diagnoses].sort((a, b) => b.probability - a.probability);

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <span>Differential Diagnosis</span>
                    <Tooltip content="The AI ranks potential diagnoses by probability based on current evidence. As more data flows in, probabilities update in real time. Think of it as a dynamic shortlist that gets smarter with each finding." />
                </div>
            }
            className={`flex-1 flex flex-col min-h-0 border-t-4 transition-colors duration-300 ${
                isStandardized ? 'bg-provet-neutral-50 border-t-provet-blue-royal' : 'bg-red-50/30 border-t-red-400'
            }`}
            action={
                isStandardized
                    ? <Brain className="text-provet-purple-light w-4 h-4" />
                    : <AlertTriangle className="text-red-400 w-4 h-4" />
            }
        >
            <div className="space-y-4">
                {/* Low confidence warning */}
                {!isStandardized && sorted.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 animate-in fade-in duration-300">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            <strong>Low confidence:</strong> Without standardised clinical terminology, the diagnostic engine cannot reliably match symptoms to its knowledge base.
                        </div>
                    </div>
                )}

                {sorted.length === 0 && (
                    <div className="text-provet-neutral-600 text-sm text-center py-10 bg-provet-neutral-50 rounded-lg">
                        <Brain className="w-8 h-8 mx-auto mb-2 text-provet-neutral-300" />
                        <div>Analysis pending...</div>
                        <div className="text-xs text-provet-neutral-400 mt-1">The AI needs clinical data before generating differentials</div>
                    </div>
                )}
                {sorted.map((diag, index) => {
                    const annotation = getAnnotation(diag.name);

                    return (
                        <div
                            key={diag.id}
                            className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-default ${index === 0
                                ? isStandardized
                                    ? 'bg-white border-provet-purple-light shadow-md ring-1 ring-provet-purple-bg'
                                    : 'bg-white border-red-300 shadow-md ring-1 ring-red-100'
                                : 'bg-white border-provet-neutral-200 hover:border-provet-neutral-300'
                                }`}
                            onClick={() => canConfirm && onConfirm(diag.id)}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className={`font-semibold text-base ${
                                    !isStandardized ? 'text-red-700 italic' :
                                    index === 0 ? 'text-provet-purple' : 'text-provet-neutral-800'
                                }`}>
                                    {diag.name}
                                </span>
                                <span className={`text-sm font-bold bg-white px-2 py-0.5 rounded border ${
                                    !isStandardized ? 'text-red-600 border-red-200' :
                                    index === 0 ? 'text-provet-purple border-provet-purple-lighter' : 'text-provet-neutral-600 border-provet-neutral-200'
                                }`}>
                                    {diag.probability}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-provet-neutral-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                        !isStandardized ? 'bg-red-400' :
                                        diag.probability > 80 ? 'bg-provet-status-success' :
                                        diag.probability > 50 ? 'bg-provet-status-warning' : 'bg-provet-neutral-400'
                                        }`}
                                    style={{ width: `${diag.probability}%` }}
                                />
                            </div>

                            {/* Insight Tooltip */}
                            {diag.reason && (
                                <div className={`mt-3 flex items-start text-xs p-2.5 rounded-lg border ${
                                    isStandardized
                                        ? 'text-provet-purple-light bg-provet-purple-bg border-provet-purple-lighter'
                                        : 'text-red-600 bg-red-50 border-red-200 italic'
                                }`}>
                                    <Info className="w-3.5 h-3.5 mr-2 mt-0.5 shrink-0" />
                                    {diag.reason}
                                </div>
                            )}

                            {/* Contextual annotation for non-clinical viewers */}
                            {annotation && isStandardized && (
                                <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-provet-neutral-500 leading-relaxed pl-1">
                                    <Info className="w-3 h-3 shrink-0 mt-0.5 text-provet-neutral-400" />
                                    {annotation}
                                </div>
                            )}

                            {/* ACTION PROTOCOL */}
                            {index === 0 && showProtocolAction && onGenerateProtocol && isStandardized && (
                                <div className="mt-4 pt-3 border-t border-provet-neutral-100 animate-in slide-in-from-bottom-2 fade-in duration-500">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onGenerateProtocol();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-provet-purple to-purple-700 hover:from-purple-700 hover:to-provet-purple text-white py-2.5 rounded-lg shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5 font-bold"
                                    >
                                        <Zap className="w-4 h-4 fill-current text-yellow-300" />
                                        Launch {diag.name.split('(')[0]} Protocol
                                    </button>
                                    <p className="text-center text-[10px] text-provet-neutral-500 mt-2 font-medium">
                                        Includes: Prescription Diet, Phosphate Binders, Follow-up Labs
                                    </p>
                                </div>
                            )}

                            {/* Blocked Protocol in degraded mode */}
                            {index === 0 && showProtocolAction && onGenerateProtocol && !isStandardized && (
                                <div className="mt-4 pt-3 border-t border-red-100 animate-in fade-in duration-300">
                                    <div className="w-full flex items-center justify-center gap-2 bg-provet-neutral-100 text-provet-neutral-400 py-2.5 rounded-lg border border-dashed border-provet-neutral-300 font-bold text-sm">
                                        <AlertTriangle className="w-4 h-4" />
                                        Protocol unavailable — confidence too low
                                    </div>
                                    <p className="text-center text-[10px] text-red-500 mt-2 font-medium">
                                        Switch to standardised data to unlock treatment protocols
                                    </p>
                                </div>
                            )}

                            {/* Hover Confirm Action */}
                            {canConfirm && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[1px]">
                                    <button className="bg-provet-purple text-white font-bold px-4 py-2 rounded-lg shadow-lg transform scale-95 group-hover:scale-100 transition-transform flex items-center">
                                        <Check className="w-4 h-4 mr-2" /> Select Diagnosis
                                    </button>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
