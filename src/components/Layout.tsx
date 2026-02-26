import { Info } from 'lucide-react';
import logo from '../assets/provet_logo.png';

interface LayoutProps {
    left: React.ReactNode;
    center: React.ReactNode;
    right: React.ReactNode;
    headerActions?: React.ReactNode;
    stageDescription?: string;
}

export function Layout({ left, center, right, headerActions, stageDescription }: LayoutProps) {
    return (
        <div className="h-screen w-full bg-provet-neutral-50 text-provet-neutral-900 flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <header className="h-16 border-b border-provet-neutral-200 bg-white flex items-center px-6 shadow-sm z-10">
                <div className="flex items-center space-x-3">
                    <img src={logo} alt="Provet Cloud" className="h-8 w-auto" />
                </div>
                <div className="ml-auto flex items-center space-x-4 text-sm text-provet-neutral-600">
                    {headerActions}
                    <span className="bg-provet-purple-bg text-provet-purple px-3 py-1 rounded-full font-medium border border-provet-purple-lighter">Simulated Environment</span>
                </div>
            </header>

            {/* Stage Description Bar */}
            {stageDescription && (
                <div className="bg-provet-purple-bg border-b border-provet-purple-lighter px-6 py-2 flex items-center gap-2 animate-in fade-in duration-300 shrink-0">
                    <Info className="w-3.5 h-3.5 text-provet-purple shrink-0" />
                    <p className="text-xs text-provet-purple leading-relaxed">{stageDescription}</p>
                </div>
            )}

            {/* Main Grid */}
            <main className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
                {/* Left Column: Live Stream (25%) */}
                <section className="col-span-3 border-r border-provet-neutral-200 bg-white p-4 overflow-hidden flex flex-col">
                    {left}
                </section>

                {/* Middle Column: The Brain (45%) */}
                <section className="col-span-5 border-r border-provet-neutral-200 bg-provet-neutral-50 p-6 overflow-y-auto flex flex-col">
                    {center}
                </section>

                {/* Right Column: Workflow (30%) */}
                <section className="col-span-4 bg-white p-6 overflow-y-auto flex flex-col shadow-inner">
                    {right}
                </section>
            </main>
        </div>
    );
}
