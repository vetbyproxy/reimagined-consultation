import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { AlertTriangle, Heart, Thermometer, Wind, FileText, Cpu, MessageSquare, Mail, Send } from "lucide-react"; // Replaced AlertCircle with AlertTriangle for better warning viz
import { TreatmentPanel } from "./TreatmentPanel";
import { DischargePanel } from "./DischargePanel";
import type { useSimulation } from "../../hooks/useSimulation";
import { Tooltip } from "../ui/Tooltip";

interface WorkflowPanelProps {
    simulation: ReturnType<typeof useSimulation>;
}

export function WorkflowPanel({ simulation }: WorkflowPanelProps) {
    const { stage, data, confirmPalpation, addToBilling, patient, advanceStage, sensorData, isTyping } = simulation;

    // --- Dynamic Content Definitions ---

    const PatientCard = (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <span>Patient Context</span>
                    <Tooltip content="The patient's identity card — species, breed, weight, and sex. This data helps the AI select age- and breed-appropriate differentials." side="bottom" />
                </div>
            }
            className="bg-provet-neutral-50 shadow-none border-provet-neutral-200"
        >
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-provet-purple-light flex items-center justify-center text-xl font-bold text-white shadow-sm">
                    {patient.name[0]}
                </div>
                <div>
                    <div className="text-lg font-bold text-provet-neutral-900">{patient.name}</div>
                    <div className="text-sm text-provet-neutral-600 font-medium">{patient.breed} • {patient.weight} • {patient.sex}</div>
                </div>
            </div>
        </Card>
    );

    const SensorCard = (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <span>Connected Devices</span>
                    <Tooltip content="Simulated IoT sensor data from a wearable collar. In production, this would stream live vitals directly into the patient record." side="bottom" />
                </div>
            }
            className="border-provet-neutral-200"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="flex items-center text-xs font-semibold text-provet-purple bg-provet-purple-bg px-2 py-0.5 rounded border border-provet-purple-light">
                        <Cpu className="w-3 h-3 mr-1" /> SmartCollar™
                    </span>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </div>
                {/* Communication Actions */}
                <div className="flex items-center space-x-1">
                    <button className="p-1.5 rounded-full text-provet-neutral-400 hover:text-provet-purple hover:bg-provet-neutral-100 transition-colors" title="SMS Owner">
                        <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-full text-provet-neutral-400 hover:text-provet-purple hover:bg-provet-neutral-100 transition-colors" title="Email Report">
                        <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-full text-provet-neutral-400 hover:text-provet-purple hover:bg-provet-neutral-100 transition-colors" title="WhatsApp">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="bg-provet-neutral-50 p-2 rounded-lg border border-provet-neutral-100 flex flex-col items-center">
                    <div className="flex items-center text-xs text-provet-neutral-500 mb-1">
                        <Heart className="w-3 h-3 mr-1 text-red-500" /> HR
                    </div>
                    <div className="text-xl font-bold text-provet-neutral-900 tabular-nums">
                        {Math.round(sensorData.heartRate)}
                    </div>
                    <div className="text-[10px] text-provet-neutral-400">bpm</div>
                </div>

                <div className="bg-provet-neutral-50 p-2 rounded-lg border border-provet-neutral-100 flex flex-col items-center">
                    <div className="flex items-center text-xs text-provet-neutral-500 mb-1">
                        <Wind className="w-3 h-3 mr-1 text-blue-500" /> RR
                    </div>
                    <div className="text-xl font-bold text-provet-neutral-900 tabular-nums">
                        {Math.round(sensorData.respiratoryRate)}
                    </div>
                    <div className="text-[10px] text-provet-neutral-400">rpm</div>
                </div>

                <div className="bg-provet-neutral-50 p-2 rounded-lg border border-provet-neutral-100 flex flex-col items-center">
                    <div className="flex items-center text-xs text-provet-neutral-500 mb-1">
                        <Thermometer className="w-3 h-3 mr-1 text-amber-500" /> Temp
                    </div>
                    <div className="text-xl font-bold text-provet-neutral-900 tabular-nums">
                        {sensorData.temperature.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-provet-neutral-400">°C</div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs border-t border-provet-neutral-100 pt-2">
                <span className="text-provet-neutral-500">Activity Level</span>
                <span className={`font-medium ${sensorData.activity === 'Active' ? 'text-green-600' :
                    sensorData.activity === 'Highly Active' ? 'text-orange-600' :
                        'text-blue-600'
                    }`}>{sensorData.activity}</span>
            </div>
        </Card>
    );

    const NotesCard = (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <span>Live Clinical Notes</span>
                    <Tooltip content="AI-generated SOAP notes written in real time. These replace manual note-taking — the vet can focus on the patient while the AI documents." />
                </div>
            }
            className="border-provet-neutral-200"
            action={isTyping ? <div className="text-[10px] font-bold text-provet-purple animate-pulse">UPDATING...</div> : null}
        >
            <div className="space-y-3 min-h-[100px]">
                {data.clinicalNotes.length === 0 ? (
                    <div className="text-sm text-provet-neutral-400 italic text-center py-4">
                        Waiting for consultation data...
                    </div>
                ) : (
                    data.clinicalNotes.map((note, idx) => (
                        <div key={idx} className="bg-yellow-50/50 p-3 rounded-md border border-yellow-100 text-sm text-provet-neutral-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                <p className="leading-relaxed">{note}</p>
                            </div>
                        </div>
                    ))
                )}

                {isTyping && (
                    <div className="bg-provet-neutral-50 p-3 rounded-md border border-provet-neutral-100">
                        <div className="h-2 bg-provet-neutral-200 rounded w-3/4 animate-pulse mb-2"></div>
                        <div className="h-2 bg-provet-neutral-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                )}
            </div>
        </Card>
    );

    const SuggestionCard = stage === 3 ? (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <span>Suggested Action</span>
                    <Tooltip content="The AI recommends the next diagnostic step based on accumulated evidence. This is where clinical decision support meets the workflow." side="bottom" />
                </div>
            }
            className="border border-provet-status-warning bg-amber-50 animate-in slide-in-from-right duration-500"
        >
            <div className="flex items-start space-x-3 mb-4">
                <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                    <AlertTriangle className="w-5 h-5 text-provet-status-warning" />
                </div>
                <div className="text-sm text-provet-neutral-800">
                    <strong className="block text-base mb-1">Diagnostic Alert</strong>
                    Physical exam findings (Small Kidneys) combined with PU/PD symptoms strongly suggest renal pathology.
                    <br /><br />
                    <span className="bg-white px-2 py-1 rounded border border-amber-200 font-medium text-amber-800">Rec: SDMA & Urinalysis</span>
                </div>
            </div>
            <Button
                onClick={confirmPalpation}
                className="w-full bg-provet-status-warning hover:bg-amber-600 text-white border-transparent"
                variant="primary"
                isLoading={simulation.isProcessingAction}
            >
                {simulation.isProcessingAction ? "Processing Labs..." : "Order Labs & Confirm"}
            </Button>
        </Card>
    ) : null;

    const TreatmentCard = (stage >= 4) ? (
        <div className="animate-in slide-in-from-right duration-500">
            <TreatmentPanel
                protocol={data.treatmentPlan}
                billingDraft={data.billingDraft}
                onAddToBilling={addToBilling}
                onDischarge={advanceStage}
                canDischarge={stage === 4 && data.billingDraft.length > 0}
            />
        </div>
    ) : null;

    const DischargeCard = (stage === 5) ? (
        <div className="animate-in slide-in-from-right duration-700 delay-200 mt-6">
            <DischargePanel letter={data.dischargeLetter} />
        </div>
    ) : null;


    // --- Ordering Logic ---
    // We render items based on the stage priority
    // Stage 0-2: Patient -> Notes -> Sensors
    // Stage 3: Suggestion (Top) -> Patient -> Notes
    // Stage 4+: Treatment (Top) -> Patient -> ...

    return (
        <div className="space-y-6">
            {DischargeCard}

            {stage === 3 && SuggestionCard}
            {stage >= 4 && TreatmentCard}

            {PatientCard}

            {/* During active workup, put sensors high? Or keep consistent? 
                User asked for "relevant at top".
            */}

            {stage < 3 && NotesCard}
            {stage < 3 && SensorCard}

            {stage >= 3 && SensorCard}
            {stage >= 3 && NotesCard}
        </div>
    );
}
