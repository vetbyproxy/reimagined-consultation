import { useState } from 'react';
import { MOCK_REVIEW_DATA, type ReviewDisease } from '../../data/reviewData';
import { DiseaseReviewCard } from './DiseaseReviewCard';
import { Search, Filter, CheckCircle } from 'lucide-react';

interface ReviewDashboardProps {
    onExit: () => void;
}

export function ReviewDashboard({ onExit }: ReviewDashboardProps) {
    const [diseases, setDiseases] = useState<ReviewDisease[]>(MOCK_REVIEW_DATA);
    const [selectedId, setSelectedId] = useState<string>(diseases[0].id);

    const handleApprove = (id: string) => {
        setDiseases(curr => curr.map(d => d.id === id ? { ...d, status: 'approved' } : d));
        // Auto-advance to next pending if available
        const currentIndex = diseases.findIndex(d => d.id === selectedId);
        if (currentIndex < diseases.length - 1) {
            setSelectedId(diseases[currentIndex + 1].id);
        }
    };

    const selectedDisease = diseases.find(d => d.id === selectedId);
    const totalReviewed = diseases.filter(d => d.status === 'approved').length;

    return (
        <div className="h-full flex flex-col bg-provet-neutral-100">
            {/* Toolbar */}
            <div className="bg-white border-b border-provet-neutral-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-provet-neutral-900">Clinical Logic Review</h1>
                    <div className="h-5 w-px bg-provet-neutral-300 mx-2" />
                    <div className="flex items-center gap-2 text-sm text-provet-neutral-600">
                        <span className="font-medium">Progress:</span>
                        <div className="w-32 h-2 bg-provet-neutral-100 rounded-full overflow-hidden border border-provet-neutral-200">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${(totalReviewed / diseases.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-provet-neutral-900 font-bold">{totalReviewed}/{diseases.length}</span>
                    </div>
                </div>
                <button
                    onClick={onExit}
                    className="text-sm font-medium text-provet-neutral-500 hover:text-provet-purple transition-colors"
                >
                    Exit Review Mode
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar List */}
                <div className="w-80 bg-white border-r border-provet-neutral-200 flex flex-col z-0">
                    <div className="p-4 border-b border-provet-neutral-100 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-provet-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search diseases..."
                                className="w-full pl-9 pr-3 py-2 bg-provet-neutral-50 border border-provet-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-provet-purple-light/20 focus:border-provet-purple-light"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-provet-neutral-600 bg-provet-neutral-50 border border-provet-neutral-200 rounded hover:bg-provet-neutral-100">
                                <Filter className="w-3 h-3" /> Filter
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {diseases.map(disease => (
                            <button
                                key={disease.id}
                                onClick={() => setSelectedId(disease.id)}
                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group ${selectedId === disease.id
                                    ? 'bg-provet-purple-bg border-provet-purple-light shadow-sm ring-1 ring-provet-purple-light/20'
                                    : 'bg-white border-transparent hover:bg-provet-neutral-50 hover:border-provet-neutral-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-semibold text-sm truncate pr-2 ${selectedId === disease.id ? 'text-provet-purple' : 'text-provet-neutral-800'}`}>
                                        {disease.name}
                                    </span>
                                    {disease.status === 'approved' && (
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-provet-neutral-500 truncate max-w-[140px]">{disease.category}</span>
                                    <span className="text-[10px] font-mono text-provet-neutral-400">{disease.aiGeneratedDate}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto h-full">
                        {selectedDisease ? (
                            <DiseaseReviewCard
                                key={selectedDisease.id} // Force re-mount on selection change to reset local state
                                disease={selectedDisease}
                                onApprove={handleApprove}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-provet-neutral-400">
                                Select a disease to review
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
