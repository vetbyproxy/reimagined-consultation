import { useState, useEffect, useCallback, useRef } from 'react';

// --- Types ---

export type SimulationStage = 0 | 1 | 2 | 3 | 4 | 5;

export interface ClinicalSign {
    id: string;
    name: string;
    category: 'symptom' | 'sign' | 'lab';
    confidence?: number;
}

export interface Diagnosis {
    id: string;
    name: string;
    probability: number;
    reason?: string;
    isConfirmed?: boolean;
}

export interface TreatmentItem {
    id: string;
    name: string;
    dosage?: string;
    type: 'medication' | 'procedure' | 'lab';
    price: number;
}

export interface TranscriptLine {
    id: string;
    speaker: 'vet' | 'owner';
    text: string;
}

export interface ConsultationState {
    transcript: TranscriptLine[];
    clinicalSigns: ClinicalSign[];
    diagnoses: Diagnosis[];
    treatmentPlan: TreatmentItem[];
    billingDraft: TreatmentItem[];
    dischargeLetter: string | null;
    clinicalNotes: string[]; // New: Running list of summary notes
}

export interface SensorData {
    heartRate: number;
    respiratoryRate: number;
    temperature: number;
    activity: 'Resting' | 'Active' | 'Highly Active';
}

// --- Data ---
const scriptData = {
    patient: {
        name: "Bella",
        breed: "Golden Retriever",
        weight: "28kg",
        sex: "Female"
    },
    // We define full conversation arrays for each stage
    stages: {
        1: {
            lines: [
                { s: 'vet', t: "Good morning. I see you've brought Bella in today. How has she been?" },
                { s: 'owner', t: "Hi doctor. Honestly, I'm a bit worried. She's been drinking a lot more water than usual." },
                { s: 'vet', t: "I see. When you say a lot, is she emptying the bowl?" },
                { s: 'owner', t: "Constantly. I'm filling it 3 or 4 times a day. And she needs to go out to pee much more often, even waking me up at night." },
                { s: 'vet', t: "Okay, so significant thirst and increased urination. Have you noticed any changes in her appetite or weight?" },
                { s: 'owner', t: "She eats okay, but she looks a bit thinner to me. She's lost her waistline definition a bit." }
            ],
            newSigns: [
                { id: '1', name: 'Polydipsia (Increased Drinking)', category: 'symptom' },
                { id: '2', name: 'Polyuria (Increased Urination)', category: 'symptom' },
                { id: '3', name: 'Weight Loss', category: 'symptom' }
            ],
            notes: "Subjective: Owner reports PU/PD (filling bowl 3-4x/day, nocturia). Weight loss noted."
        },
        2: {
            lines: [
                { s: 'vet', t: "Right, let's take a look at her. Come here, Bella." },
                { s: 'vet', t: "Mucous membranes are a little tacky. She's slightly dehydrated despite the drinking." },
                { s: 'vet', t: "I'm going to palpate her abdomen now." },
                { s: 'vet', t: "Hmm. The bladder feels normal, no stones felt there." },
                { s: 'vet', t: "Checking the kidneys... okay." },
                { s: 'vet', t: "The left kidney feels small and irregular. The right one is also quite small." },
                { s: 'vet', t: "This small irregular shape is concerning for chronic changes." }
            ],
            newSigns: [
                { id: '4', name: 'Small/Irregular Kidneys', category: 'sign' }
            ],
            diagnoses: [
                { id: 'd1', name: 'Chronic Kidney Disease (CKD)', probability: 85, reason: "PU/PD + Small Irregular Kidneys" },
                { id: 'd2', name: 'Diabetes Mellitus', probability: 25 },
                { id: 'd3', name: 'Hyperadrenocorticism (Cushings)', probability: 15 },
            ],
            notes: "Objective: Mucous membranes tacky. Abdominal palpation reveals small, irregular kidneys bilaterally. Bladder normal."
        },
        3: {
            lines: [
                { s: 'vet', t: "Based on the excessive drinking and the small kidneys I felt, I highly suspect Kidney Disease." },
                { s: 'vet', t: "We need to verify this with bloodwork. I'd like to run an SDMA test and a urinalysis." },
                { s: 'owner', t: "Okay, whatever she needs. Is it serious?" },
                { s: 'vet', t: "It can be managed if we catch it early. Let's get those tests run now." }
            ],
            updatedDiagnoses: [
                { id: 'd1', name: 'Chronic Kidney Disease (CKD)', probability: 98, reason: "Confirmed: Elevated SDMA (18) + Low USG" },
                { id: 'd2', name: 'Diabetes Mellitus', probability: 2 },
            ],
            notes: "Assessment: Suspect CKD. Plan: Run SDMA and Urinalysis to confirm."
        },
        4: {
            lines: [
                { s: 'vet', t: "The results are back. Her SDMA is 18, which is elevated." },
                { s: 'vet', t: "Combined with the urine concentration, this confirms early Chronic Kidney Disease (IRIS Stage 2)." },
                { s: 'owner', t: "Oh no. What do we do?" },
                { s: 'vet', t: "Don't panic. We can manage this with diet and medication. I'm prescribing a renal support diet and phosphate binders." }
            ],
            newSigns: [
                { id: '6', name: 'SDMA: 18 μg/dL (Elevated)', category: 'lab', confidence: 1.0 },
                { id: '7', name: 'USG: 1.012 (Isosthenuric)', category: 'lab', confidence: 1.0 }
            ],
            protocol: [
                { id: 't1', name: 'Renal Diet (Prescription)', dosage: 'Transition over 1 week', type: 'medication', price: 85.00 },
                { id: 't2', name: 'Phosphate Binder', dosage: 'With meals', type: 'medication', price: 45.00 },
                { id: 't3', name: 'SDMA + CBC/Chem Panel', type: 'lab', price: 210.00 },
                { id: 't4', name: 'Urinalysis', type: 'lab', price: 65.00 }
            ],
            notes: "Plan: Renal Diet + Phosphate Binders initiated. Diagnosis: CKD Stage 2."
        },
        5: {
            letter: `Dear Bella's Family,

It was good to see Bella today. Based on her symptoms of increased drinking/urination (PU/PD) and our exam findings of small irregular kidneys, we have diagnosed her with early Chronic Kidney Disease (CKD).

Blood tests (SDMA) confirmed the diagnosis.

We are starting her on a therapeutic Renal Diet to support her kidney function. Please transition her food slowly over 7 days. Ensure she always has access to fresh water.

We will review her blood values again in 2 weeks.

Best regards,
Provet Cloud Team`
        }
    }
};

export function useSimulation() {
    const [stage, setStage] = useState<SimulationStage>(0);
    const [data, setData] = useState<ConsultationState>({
        transcript: [],
        clinicalSigns: [],
        diagnoses: [],
        treatmentPlan: [],
        billingDraft: [],
        dischargeLetter: null,
        clinicalNotes: []
    });

    const [isTyping, setIsTyping] = useState(false);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-play mode
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    const isAutoPlayRef = useRef(false);

    // AI Confidence score (climbs as standardised data flows in)
    const [aiConfidence, setAiConfidence] = useState(0);

    // Sensor Data Simulation
    const [sensorData, setSensorData] = useState<SensorData>({
        heartRate: 88,
        respiratoryRate: 20,
        temperature: 38.5,
        activity: 'Resting'
    });

    // Simulate sensor fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            setSensorData(prev => ({
                ...prev,
                heartRate: Math.min(140, Math.max(60, prev.heartRate + (Math.random() - 0.5) * 4)),
                respiratoryRate: Math.min(40, Math.max(10, prev.respiratoryRate + (Math.random() - 0.5) * 2)),
                temperature: Math.min(39.5, Math.max(37.5, prev.temperature + (Math.random() - 0.5) * 0.1))
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Sync auto-play ref
    useEffect(() => {
        isAutoPlayRef.current = isAutoPlay;
    }, [isAutoPlay]);

    // Confidence score calculation — rises with evidence
    useEffect(() => {
        const signCount = data.clinicalSigns.length;
        const hasDiagnoses = data.diagnoses.length > 0;
        const hasLabs = data.clinicalSigns.some(s => s.category === 'lab');
        const hasTreatment = data.treatmentPlan.length > 0;

        let confidence = 0;
        if (stage >= 1 && signCount > 0) confidence = 15 + Math.min(signCount * 8, 25); // 15-40
        if (stage >= 2 && hasDiagnoses) confidence = 55;
        if (stage >= 3) confidence = 65;
        if (stage >= 4 && hasLabs) confidence = 85;
        if (hasTreatment) confidence = 92;
        if (stage >= 5) confidence = 98;

        // Animate the confidence climb
        setAiConfidence(prev => {
            if (confidence > prev) return confidence;
            return prev;
        });
    }, [stage, data.clinicalSigns, data.diagnoses, data.treatmentPlan]);

    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    // Queue system for lines
    const processQueue = useCallback(async (lines: { s: string, t: string }[]) => {
        for (const line of lines) {
            // Pause handling
            let paused = isPaused;
            while (paused) {
                // Check pause state periodically
                // We can't easily access the live 'isPaused' inside this loop without a ref or careful structure.
                // This simple version uses a ref to cheat the closure.
                // Actually, relying on state updates inside an async loop is tricky. 
                // Let's use a Ref for isPaused to be safe.
                await new Promise(r => setTimeout(r, 500));
                paused = isPausedRef.current;
            }

            setIsTyping(true);
            await new Promise(r => setTimeout(r, Math.min(1500, line.t.length * 20)));

            // Check pause again before showing
            paused = isPausedRef.current;
            while (paused) {
                await new Promise(r => setTimeout(r, 500));
                paused = isPausedRef.current;
            }

            setData(prev => ({
                ...prev,
                transcript: [...prev.transcript, {
                    id: Math.random().toString(36).substr(2, 9),
                    speaker: line.s as 'vet' | 'owner',
                    text: line.t
                }]
            }));

            await new Promise(r => setTimeout(r, 800));
        }
        setIsTyping(false);
    }, []); // Removed isPaused dependency to avoid breaking loops, used Ref below

    // Ref for pause access inside loop
    const isPausedRef = useRef(isPaused);
    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);


    const advanceStage = useCallback(() => {
        setStage(prev => {
            const next = (prev + 1) as SimulationStage;
            if (next > 5) return prev;
            return next;
        });
    }, []);

    // Actions
    const calculateTreatment = useCallback(() => {
        setData(prev => ({
            ...prev,
            treatmentPlan: scriptData.stages[4].protocol as TreatmentItem[]
        }));
    }, []);

    const generateLetter = useCallback(() => {
        setData(prev => ({
            ...prev,
            dischargeLetter: scriptData.stages[5].letter
        }));
    }, []);

    // State Machine
    const executedStageRef = useRef<SimulationStage | null>(null);

    useEffect(() => {
        let cancelled = false;

        const runStage = async () => {
            // Prevent re-running if we've already started this stage
            if (executedStageRef.current === stage) return;
            executedStageRef.current = stage;

            if (stage === 1) {
                // Start queue - Stage 1
                // Signs appear mid-way
                const signsTimeout = setTimeout(() => {
                    if (!cancelled) {
                        setData(prev => ({ ...prev, clinicalSigns: scriptData.stages[1].newSigns as ClinicalSign[] }));
                    }
                }, 8000);

                await processQueue(scriptData.stages[1].lines);
                if (cancelled) { clearTimeout(signsTimeout); return; }

                // Add Stage 1 Notes
                if (scriptData.stages[1].notes) {
                    setData(prev => ({ ...prev, clinicalNotes: [...prev.clinicalNotes, scriptData.stages[1].notes!] }));
                }

                // Seamless transition
                setIsProcessingAction(true);
                await new Promise(r => setTimeout(r, 1500));
                if (!cancelled) {
                    setIsProcessingAction(false);
                    advanceStage();
                }
            }
            else if (stage === 2) {
                // Reveal Dehydration early
                const dehydrationTimeout = setTimeout(() => {
                    if (!cancelled) {
                        setData(prev => ({ ...prev, clinicalSigns: [...prev.clinicalSigns, { id: '5', name: 'Dehydration (Tacky Mucous Membranes)', category: 'sign' }] }));
                    }
                }, 4000);

                // Reveal Kidneys later
                const kidneysTimeout = setTimeout(() => {
                    if (!cancelled) {
                        setData(prev => ({
                            ...prev,
                            clinicalSigns: [...prev.clinicalSigns, ...scriptData.stages[2].newSigns! as ClinicalSign[]],
                            diagnoses: scriptData.stages[2].diagnoses as Diagnosis[]
                        }));
                    }
                }, 12000);

                await processQueue(scriptData.stages[2].lines);

                // Add Stage 2 Notes
                if (scriptData.stages[2].notes) {
                    setData(prev => ({ ...prev, clinicalNotes: [...prev.clinicalNotes, scriptData.stages[2].notes!] }));
                }

                if (cancelled) {
                    clearTimeout(dehydrationTimeout);
                    clearTimeout(kidneysTimeout);
                    return;
                }

                await new Promise(r => setTimeout(r, 2000));
                if (!cancelled) advanceStage();
            }
            else if (stage === 3) {
                await processQueue(scriptData.stages[3].lines);
                // Add Stage 3 Notes
                if (scriptData.stages[3].notes) {
                    setData(prev => ({ ...prev, clinicalNotes: [...prev.clinicalNotes, scriptData.stages[3].notes!] }));
                }

                // Auto-play: automatically confirm and advance after a pause
                if (isAutoPlayRef.current && !cancelled) {
                    await new Promise(r => setTimeout(r, 2500));
                    if (!cancelled && isAutoPlayRef.current) {
                        setIsProcessingAction(true);
                        await new Promise(r => setTimeout(r, 3000));
                        if (!cancelled) {
                            setData(prev => ({
                                ...prev,
                                diagnoses: scriptData.stages[3].updatedDiagnoses as Diagnosis[]
                            }));
                            setIsProcessingAction(false);
                            advanceStage();
                        }
                    }
                }
                // Otherwise waits for user action (confirmPalpation)
            }
            else if (stage === 4) {
                // Reveal Labs early
                const labsTimeout = setTimeout(() => {
                    if (!cancelled) {
                        setData(prev => ({ ...prev, clinicalSigns: [...prev.clinicalSigns, ...scriptData.stages[4].newSigns! as ClinicalSign[]] }));
                    }
                }, 2000);

                await processQueue(scriptData.stages[4].lines);

                // Auto-play: generate protocol and advance automatically
                if (isAutoPlayRef.current && !cancelled) {
                    await new Promise(r => setTimeout(r, 2000));
                    if (!cancelled && isAutoPlayRef.current) {
                        setData(prev => ({
                            ...prev,
                            treatmentPlan: scriptData.stages[4].protocol as TreatmentItem[]
                        }));
                        await new Promise(r => setTimeout(r, 3000));
                        if (!cancelled && isAutoPlayRef.current) {
                            // Auto billing + advance to discharge
                            setData(prev => ({
                                ...prev,
                                billingDraft: [...prev.billingDraft, ...scriptData.stages[4].protocol as TreatmentItem[]],
                                treatmentPlan: []
                            }));
                            await new Promise(r => setTimeout(r, 2000));
                            if (!cancelled) advanceStage();
                        }
                    }
                }

                if (cancelled) clearTimeout(labsTimeout);
            }
            else if (stage === 5) {
                generateLetter();
                // Auto-play: stop auto-play after reaching discharge
                if (isAutoPlayRef.current) {
                    await new Promise(r => setTimeout(r, 3000));
                    setIsAutoPlay(false);
                    isAutoPlayRef.current = false;
                }
            }
        };

        runStage();

        return () => { cancelled = true; };

    }, [stage, processQueue, advanceStage, generateLetter]); // Removed calculateTreatment dependency

    const confirmPalpation = () => {
        if (stage !== 3) return;
        setIsProcessingAction(true);
        setTimeout(() => {
            setData(prev => ({
                ...prev,
                diagnoses: scriptData.stages[3].updatedDiagnoses as Diagnosis[]
            }));
            setIsProcessingAction(false);
            advanceStage();
        }, 4000);
    };

    const confirmDiagnosis = () => {
        // Diagnosis confirm logic if needed
    };

    // Renamed from calculateTreatment
    const generateProtocol = useCallback(() => {
        setData(prev => ({
            ...prev,
            treatmentPlan: scriptData.stages[4].protocol as TreatmentItem[]
        }));
    }, []);

    const addToBilling = () => {
        setData(prev => ({
            ...prev,
            billingDraft: [...prev.billingDraft, ...prev.treatmentPlan],
            treatmentPlan: []
        }));
    };

    // Auto-play starter
    const startAutoPlay = useCallback(() => {
        setIsAutoPlay(true);
        isAutoPlayRef.current = true;
        advanceStage(); // kick off stage 1
    }, [advanceStage]);

    const stopAutoPlay = useCallback(() => {
        setIsAutoPlay(false);
        isAutoPlayRef.current = false;
    }, []);

    // Standardization Logic (New Feature)
    const [isStandardized, setIsStandardized] = useState(true);

    const toggleStandardization = useCallback(() => {
        setIsStandardized(prev => !prev);
    }, []);

    const degradeData = (originalData: ConsultationState): ConsultationState => {
        if (isStandardized) return originalData;

        // Scramble Clinical Signs (simulate free text / custom lists)
        const scrambledSigns = originalData.clinicalSigns.map(sign => {
            let newName = sign.name;
            if (sign.name.includes('Polydipsia')) newName = "drinking lots of water";
            if (sign.name.includes('Polyuria')) newName = "peeing more than usual";
            if (sign.name.includes('Weight Loss')) newName = "lost some weight";
            if (sign.name.includes('Kidneys')) newName = "kidneys feel small";
            if (sign.name.includes('Dehydration')) newName = "mouth a bit dry";
            if (sign.name.includes('SDMA')) newName = "kidney blood test — high";
            if (sign.name.includes('USG')) newName = "urine test result";

            return { ...sign, name: newName, category: 'symptom' as const }; // lose category specificity
        });

        // Degrade Diagnoses (simulate poor matching)
        const degradedDiagnoses = originalData.diagnoses.map(dx => {
            let newProb = dx.probability;
            let newName = dx.name;
            let newReason = dx.reason;

            if (dx.name.includes('Kidney Disease')) {
                newProb = Math.min(dx.probability, 45); // significantly lower confidence
                newName = "Kidney problem?";
                newReason = "Partial match: 'drinking lots of water' → possible renal";
            }
            if (dx.name.includes('Diabetes')) {
                newProb = Math.min(dx.probability + 15, 40); // higher confusion
                newReason = "Partial match: 'drinking lots' also matches diabetes";
            }
            if (dx.name.includes('Cushing')) {
                newProb = Math.min(dx.probability + 5, 25);
            }

            // Lose confirmation status if degraded
            return {
                ...dx,
                name: newName,
                probability: newProb,
                reason: newReason,
                isConfirmed: false
            };
        });

        return {
            ...originalData,
            clinicalSigns: scrambledSigns,
            diagnoses: degradedDiagnoses
        };
    };

    return {
        stage,
        data: degradeData(data),
        isTyping,
        isProcessingAction,
        advanceStage,
        confirmPalpation,
        confirmDiagnosis,
        generateProtocol,
        addToBilling,
        patient: scriptData.patient,
        isPaused,
        togglePause,
        sensorData,
        isStandardized,
        toggleStandardization,
        isAutoPlay,
        startAutoPlay,
        stopAutoPlay,
        aiConfidence
    };
}
