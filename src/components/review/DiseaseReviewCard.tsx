import { useState } from 'react';
import { Check, X, BookOpen, AlertCircle, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { ReviewDisease, ReviewSymptom } from '../../data/reviewData';
import { Button } from '../ui/Button';

interface DiseaseReviewCardProps {
    disease: ReviewDisease;
    onApprove: (id: string) => void;
}

export function DiseaseReviewCard({ disease, onApprove }: DiseaseReviewCardProps) {
    const [symptoms, setSymptoms] = useState<ReviewSymptom[]>(disease.symptoms);
    const [isFullyApproved, setIsFullyApproved] = useState(false);

    const handleLevelChange = (id: string, newVal: 1 | 2 | 3 | 4 | 5) => {
        setSymptoms(curr => curr.map(s => s.id === id ? { ...s, level: newVal, status: 'modified' } : s));
    };

    const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
        setSymptoms(curr => curr.map(s => s.id === id ? { ...s, status } : s));
    };

    const handleFinalApprove = () => {
        setIsFullyApproved(true);
        setTimeout(() => {
            onApprove(disease.id);
        }, 800);
    };

    const getLevelDescription = (level: number) => {
        switch (level) {
            case 5: return "Pathognomonic";
            case 4: return "Strong";
            case 3: return "Common";
            case 2: return "Possible";
            case 1: return "Rare";
            default: return "";
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header / Meta */}
            <div className="bg-white p-6 rounded-xl border border-provet-neutral-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-provet-neutral-900">{disease.name}</h2>
                            <Badge variant={disease.status === 'approved' ? 'success' : 'warning'}>
                                {isFullyApproved ? 'Verified' : 'Pending Review'}
                            </Badge>
                        </div>
                        <p className="text-provet-neutral-500 text-sm font-medium">{disease.category}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-provet-neutral-500 uppercase tracking-wide mb-1">AI Confidence</div>
                        <div className="text-xl font-bold text-provet-purple">92%</div>
                    </div>
                </div>

                <div className="bg-provet-neutral-50 p-3 rounded-lg border border-provet-neutral-200">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-provet-neutral-700">
                        <BookOpen className="w-4 h-4 text-provet-purple" />
                        <span>Sourced from Trusted Literature</span>
                    </div>
                    <ul className="space-y-1">
                        {disease.sources.map((source, idx) => (
                            <li key={idx} className="text-xs text-provet-neutral-600 flex items-start gap-2">
                                <span className="mt-1 block w-1 h-1 rounded-full bg-provet-neutral-400 shrink-0" />
                                {source}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Validation Table */}
            <Card title="Clinical Logic Validation" className="flex-1 min-h-0 flex flex-col">
                <div className="overflow-y-auto flex-1 p-4 space-y-8">
                    {/* Render groups by category */}
                    {(['signalment', 'complaint', 'vital', 'finding', 'lab'] as const).map(category => {
                        const categorySymptoms = symptoms.filter(s => s.category === category);
                        if (categorySymptoms.length === 0) return null;

                        const labels = {
                            signalment: 'Signalment & History (Priors)',
                            complaint: 'Presenting Complaints (Anamnesis)',
                            vital: 'Measurements & Vitals',
                            finding: 'Clinical Findings (Physical Exam)',
                            lab: 'Laboratory Changes'
                        };

                        return (
                            <div key={category}>
                                <h3 className="text-sm font-bold text-provet-neutral-500 uppercase tracking-wider mb-3 pl-1 border-l-4 border-provet-purple">
                                    {labels[category]}
                                </h3>
                                <div className="border border-provet-neutral-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-provet-neutral-50 text-xs font-semibold text-provet-neutral-600">
                                            <tr>
                                                <th className="p-3 border-b">Sign / Parameter</th>
                                                <th className="p-3 border-b w-48">Association Level (1-5)</th>
                                                <th className="p-3 border-b w-32">Description</th>
                                                <th className="p-3 border-b w-24">AI Conf.</th>
                                                <th className="p-3 border-b text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-provet-neutral-200 bg-white">
                                            {categorySymptoms.map((symptom) => {
                                                const isRejected = symptom.status === 'rejected';
                                                return (
                                                    <tr key={symptom.id} className={`group hover:bg-provet-neutral-50 transition-colors ${isRejected ? 'bg-red-50/50' : ''}`}>
                                                        <td className="p-3">
                                                            <span className={`font-medium ${isRejected ? 'text-provet-neutral-400 line-through' : 'text-provet-neutral-900'}`}>
                                                                {symptom.name}
                                                            </span>
                                                            {symptom.status === 'modified' && (
                                                                <span className="ml-2 text-xs text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Edited</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-1">
                                                                {[1, 2, 3, 4, 5].map((lvl) => {
                                                                    const isSelected = symptom.level === lvl;
                                                                    // Color logic
                                                                    let bgClass = "bg-provet-neutral-100 text-provet-neutral-400 hover:bg-provet-neutral-200";
                                                                    let selectedClass = "";

                                                                    if (isSelected) {
                                                                        if (lvl === 5) selectedClass = "bg-purple-600 text-white shadow-sm ring-1 ring-purple-600";
                                                                        else if (lvl === 4) selectedClass = "bg-purple-500 text-white shadow-sm";
                                                                        else if (lvl === 3) selectedClass = "bg-purple-400 text-white shadow-sm";
                                                                        else if (lvl === 2) selectedClass = "bg-purple-300 text-white";
                                                                        else selectedClass = "bg-provet-neutral-300 text-white";

                                                                        bgClass = selectedClass;
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={lvl}
                                                                            disabled={isRejected}
                                                                            onClick={() => handleLevelChange(symptom.id, lvl as 1 | 2 | 3 | 4 | 5)}
                                                                            className={`w-8 h-8 rounded-md text-xs font-bold transition-all ${bgClass} ${isRejected ? 'opacity-20 cursor-not-allowed' : ''}`}
                                                                            title={`Level ${lvl}`}
                                                                        >
                                                                            {lvl}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-2">
                                                                {symptom.level === 5 && <AlertCircle className="w-3 h-3 text-rose-600" />}
                                                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${symptom.level === 5 ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                                                    symptom.level >= 4 ? 'bg-purple-50 text-purple-700' : 'text-provet-neutral-600'
                                                                    }`}>
                                                                    {getLevelDescription(symptom.level)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            <div className={`h-1.5 w-16 bg-provet-neutral-100 rounded-full overflow-hidden ${isRejected ? 'opacity-30' : ''}`}>
                                                                <div
                                                                    className="h-full bg-green-500 rounded-full"
                                                                    style={{ width: `${symptom.aiConfidence * 100}%` }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleStatusChange(symptom.id, 'rejected')}
                                                                    className={`p-1.5 rounded transition-colors ${symptom.status === 'rejected'
                                                                        ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-1'
                                                                        : 'text-provet-neutral-400 hover:bg-white hover:text-red-600 hover:shadow-sm'}`}
                                                                    title="Reject Sign (Hallucination)"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(symptom.id, 'approved')}
                                                                    className={`p-1.5 rounded transition-colors ${symptom.status === 'approved'
                                                                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-1'
                                                                        : 'text-provet-neutral-400 hover:bg-white hover:text-green-600 hover:shadow-sm'}`}
                                                                    title="Approve Sign"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-4 bg-provet-neutral-50 border-t border-provet-neutral-200 flex justify-between items-center">
                    <Button variant="outline" size="sm">
                        <Plus className="w-3 h-3 mr-2" /> Add Missing Symptom
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => alert("Marked for later review")}>
                            Flag for 2nd Opinion
                        </Button>
                        <Button
                            variant="primary"
                            disabled={isFullyApproved}
                            onClick={handleFinalApprove}
                            className={isFullyApproved ? "bg-green-600 hover:bg-green-700 border-green-700" : ""}
                        >
                            {isFullyApproved ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Logic Approved
                                </>
                            ) : "Approve & Commit Logic"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
