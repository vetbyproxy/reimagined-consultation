import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Pill, Plus, FileText } from "lucide-react";
import { Tooltip } from "../ui/Tooltip";
import type { TreatmentItem } from "../../hooks/useSimulation";

interface TreatmentPanelProps {
    protocol: TreatmentItem[];
    billingDraft: TreatmentItem[];
    onAddToBilling: () => void;
    onDischarge: () => void;
    canDischarge: boolean;
}

export function TreatmentPanel({ protocol, billingDraft, onAddToBilling, onDischarge, canDischarge }: TreatmentPanelProps) {
    const protocolTotal = protocol.reduce((acc, item) => acc + item.price, 0);
    const billingTotal = billingDraft.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="space-y-6">
            {/* Recommended Protocol */}
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <span>Recommended Treatment Protocol</span>
                        <Tooltip content="AI-suggested treatment plan based on confirmed diagnosis." side="bottom" />
                    </div>
                }
                className="border-provet-purple-light shadow-md bg-white"
            >
                {protocol.length === 0 && (
                    <div className="text-provet-neutral-400 text-sm italic py-4 text-center">
                        No active protocol.
                    </div>
                )}
                {protocol.length > 0 && (
                    <div className="space-y-3">
                        {protocol.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-provet-neutral-50 p-3 rounded-lg border border-provet-neutral-100 text-sm hover:border-provet-purple-lighter transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="p-1.5 bg-white rounded-md border border-provet-neutral-200 text-provet-purple-light">
                                        {item.type === 'medication' ? <Pill className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <div className="text-provet-neutral-900 font-semibold">{item.name}</div>
                                        {item.dosage && <div className="text-provet-neutral-500 text-xs">{item.dosage}</div>}
                                    </div>
                                </div>
                                <div className="text-provet-purple font-bold">${item.price}</div>
                            </div>
                        ))}
                        <div className="pt-3 border-t border-provet-neutral-100 flex justify-between items-center mt-2 px-1">
                            <span className="text-provet-neutral-500 text-xs uppercase font-bold tracking-wider">Estimated Total</span>
                            <span className="text-provet-neutral-900 font-bold text-lg">${protocolTotal}</span>
                        </div>
                        <Button onClick={onAddToBilling} className="w-full mt-2" variant="primary" size="md">
                            <Plus className="w-5 h-5 mr-2" /> Add to Invoice
                        </Button>
                    </div>
                )}
            </Card>

            {/* Billing Draft */}
            <Card
                title="Invoice Draft"
                className={billingDraft.length > 0 ? "opacity-100 bg-provet-neutral-50 border-provet-neutral-200" : "opacity-60 bg-provet-neutral-50"}
            >
                <div className="space-y-3 mb-6">
                    {billingDraft.length === 0 && <div className="text-sm text-provet-neutral-400 text-center py-4 border border-dashed border-provet-neutral-200 rounded-lg">Invoice empty</div>}
                    {billingDraft.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex justify-between text-sm text-provet-neutral-600 px-2">
                            <span>{item.name}</span>
                            <span className="font-mono text-provet-neutral-800">${item.price}</span>
                        </div>
                    ))}
                    {billingDraft.length > 0 && (
                        <div className="border-t border-provet-neutral-200 pt-3 flex justify-between font-bold text-provet-purple text-lg px-2">
                            <span>Total Due</span>
                            <span>${billingTotal}</span>
                        </div>
                    )}
                </div>

                {canDischarge && (
                    <Button onClick={onDischarge} variant="secondary" className="w-full bg-provet-status-success text-white hover:bg-green-600 border-none shadow-md animate-pulse">
                        Finalize Consultation
                    </Button>
                )}
            </Card>
        </div>
    );
}
