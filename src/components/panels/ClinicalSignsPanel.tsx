import { Card } from "../ui/Card";
import { AlertCircle, Stethoscope, ClipboardList, FlaskConical, AlertTriangle, Info } from "lucide-react";
import { Tooltip } from "../ui/Tooltip";
import type { ClinicalSign } from "../../hooks/useSimulation";

interface ClinicalSignsPanelProps {
    signs: ClinicalSign[];
    isStandardized?: boolean;
}

// Clinical term annotations for non-clinical viewers
const SIGN_ANNOTATIONS: Record<string, string> = {
    'Polydipsia': 'Medical term for excessive drinking — a key symptom the AI uses to narrow diagnoses',
    'Polyuria': 'Medical term for frequent urination — paired with polydipsia, this pattern strongly suggests kidney or endocrine disease',
    'Weight Loss': 'Unexplained weight loss often indicates chronic disease progression',
    'Small/Irregular Kidneys': 'Detected by palpation — this physical finding dramatically narrows the diagnosis',
    'Dehydration': 'Paradoxical: drinking more but still dehydrated — a clinical red flag',
    'SDMA': 'Symmetric dimethylarginine — a sensitive kidney biomarker that detects disease earlier than traditional tests',
    'USG': 'Urine Specific Gravity — measures how well kidneys concentrate urine. Low values indicate kidney dysfunction',
};

function getAnnotation(signName: string): string | null {
    for (const [key, value] of Object.entries(SIGN_ANNOTATIONS)) {
        if (signName.includes(key)) return value;
    }
    return null;
}

export function ClinicalSignsPanel({ signs, isStandardized = true }: ClinicalSignsPanelProps) {
    const complaints = signs.filter(s => s.category === 'symptom');
    const findings = signs.filter(s => s.category === 'sign');
    const labs = signs.filter(s => s.category === 'lab');

    // Group rendering helper
    const renderSign = (sign: ClinicalSign) => {
        const annotation = isStandardized ? getAnnotation(sign.name) : null;

        return (
            <div key={sign.id} className={`flex items-start space-x-3 p-3 border rounded-lg shadow-sm animate-in fade-in slide-in-from-left-2 duration-500 transition-colors ${
                isStandardized ? 'bg-white border-provet-neutral-200' : 'bg-red-50/50 border-red-200'
            }`}>
                <div className={`mt-0.5 ${sign.category === 'symptom' ? 'text-amber-500' :
                    sign.category === 'sign' ? 'text-provet-purple' :
                        'text-blue-500'
                    }`}>
                    {sign.category === 'symptom' ? <AlertCircle className="w-5 h-5" /> :
                        sign.category === 'sign' ? <Stethoscope className="w-5 h-5" /> :
                            <FlaskConical className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`font-medium ${isStandardized ? 'text-provet-neutral-900' : 'text-red-800 italic'}`}>{sign.name}</div>
                    {sign.confidence && (
                        <div className="text-xs text-provet-neutral-500 mt-1">
                            Confidence: {Math.round(sign.confidence * 100)}%
                        </div>
                    )}
                    {/* Contextual annotation for non-clinical viewers */}
                    {annotation && (
                        <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-provet-neutral-500 leading-relaxed">
                            <Info className="w-3 h-3 shrink-0 mt-0.5 text-provet-neutral-400" />
                            {annotation}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <span>Clinical Overview</span>
                    <Tooltip content="Live extraction of clinical concepts from the consultation. The AI categorises each finding as Subjective (reported by owner), Objective (found on exam), or Lab (test results)." side="bottom" />
                </div>
            }
            className={`flex-1 flex flex-col min-h-0 transition-colors duration-300 ${
                isStandardized ? 'bg-provet-neutral-50' : 'bg-red-50/30'
            }`}
            contentClassName="space-y-6 overflow-y-auto pr-2"
        >
            {/* Degraded Mode Warning */}
            {!isStandardized && signs.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 animate-in fade-in duration-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                        <strong>Free-text mode:</strong> Clinical concepts are unstructured and uncoded. The AI cannot reliably map these to its knowledge graph.
                    </div>
                </div>
            )}

            {/* 1. Presenting Complaints (Subjective) */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-provet-neutral-500 uppercase tracking-wider flex items-center">
                    <ClipboardList className="w-3 h-3 mr-1.5" /> Presenting Complaints (Subjective)
                </h3>
                {complaints.length === 0 ? (
                    <p className="text-sm text-provet-neutral-400 italic pl-1">Listening related to history...</p>
                ) : (
                    complaints.map(renderSign)
                )}
            </div>

            {/* 2. Clinical Findings (Objective) */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-provet-neutral-500 uppercase tracking-wider flex items-center">
                    <Stethoscope className="w-3 h-3 mr-1.5" /> Clinical Findings (Objective)
                </h3>
                {findings.length === 0 ? (
                    <p className="text-sm text-provet-neutral-400 italic pl-1">Waiting for exam data...</p>
                ) : (
                    findings.map(renderSign)
                )}
            </div>

            {/* 3. Diagnostic Results (Labs) - Only show if exist */}
            {labs.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-provet-neutral-200">
                    <h3 className="text-xs font-bold text-provet-neutral-500 uppercase tracking-wider flex items-center">
                        <FlaskConical className="w-3 h-3 mr-1.5" /> Diagnostic Results
                    </h3>
                    {labs.map(renderSign)}
                </div>
            )}

        </Card>
    );
}
