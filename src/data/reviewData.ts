export type ReviewSymptomCategory = 'complaint' | 'finding' | 'vital' | 'lab' | 'signalment';

export interface ReviewSymptom {
    id: string;
    category: ReviewSymptomCategory;
    name: string;
    level: 1 | 2 | 3 | 4 | 5; // 1=Least, 5=Pathognomonic
    aiConfidence: number; // 0-1
    status: 'pending' | 'approved' | 'rejected' | 'modified';
}

export interface ReviewDisease {
    id: string;
    name: string;
    category: string;
    aiGeneratedDate: string;
    status: 'pending' | 'reviewed' | 'approved';
    sources: string[];
    symptoms: ReviewSymptom[];
}

export const MOCK_REVIEW_DATA: ReviewDisease[] = [
    {
        id: '1',
        name: 'Canine Parvovirus (CPV)',
        category: 'Infectious / Gastroenterology',
        aiGeneratedDate: '2025-12-14',
        status: 'pending',
        sources: [
            "Ettinger's Textbook of Vet. Internal Medicine, 8th Ed, p.1240-1245",
            "Merck Veterinary Manual (Online) - Nov 2024",
            "Greene's Infectious Diseases of the Dog and Cat, 5th Ed"
        ],
        symptoms: [
            { id: 's0', category: 'signalment', name: 'Age < 6 months (Puppy)', level: 4, aiConfidence: 0.99, status: 'pending' },
            { id: 's_v1', category: 'vital', name: 'Fever (>39.5°C)', level: 3, aiConfidence: 0.75, status: 'pending' },
            { id: 's1', category: 'complaint', name: 'Severe Lethargy', level: 4, aiConfidence: 0.98, status: 'pending' },
            { id: 's2', category: 'complaint', name: 'Anorexia', level: 4, aiConfidence: 0.95, status: 'pending' },
            { id: 's3', category: 'finding', name: 'Hematochezia (Bloody Diarrhea)', level: 5, aiConfidence: 0.88, status: 'pending' },
            { id: 's5', category: 'lab', name: 'Leukopenia (Lymphopenia)', level: 4, aiConfidence: 0.99, status: 'pending' },
            { id: 's7', category: 'finding', name: 'Dehydration', level: 4, aiConfidence: 0.90, status: 'pending' }
        ]
    },
    {
        id: '2',
        name: 'Addison\'s Disease (Hypoadrenocorticism)',
        category: 'Endocrinology',
        aiGeneratedDate: '2025-12-15',
        status: 'pending',
        sources: [
            "Feldman & Nelson's Canine and Feline Endocrinology, 4th Ed",
            "Journal of Vet. Internal Medicine (JVIM) 2023 Meta-analysis"
        ],
        symptoms: [
            { id: 's_sig', category: 'signalment', name: 'Female, Young to Middle-aged', level: 3, aiConfidence: 0.85, status: 'pending' },
            { id: 's1', category: 'complaint', name: 'Intermittent Vomiting', level: 3, aiConfidence: 0.85, status: 'pending' },
            { id: 's2', category: 'complaint', name: 'Waxing/Waning Lethargy', level: 4, aiConfidence: 0.90, status: 'pending' },
            { id: 's5', category: 'vital', name: 'Bradycardia (Relative)', level: 2, aiConfidence: 0.60, status: 'pending' },
            { id: 's3', category: 'lab', name: 'Hyperkalemia (High Potassium)', level: 4, aiConfidence: 0.95, status: 'pending' },
            { id: 's4', category: 'lab', name: 'Hyponatremia (Low Sodium)', level: 4, aiConfidence: 0.95, status: 'pending' },
            { id: 's6', category: 'complaint', name: 'Polyuria / Polydipsia (PU/PD)', level: 2, aiConfidence: 0.50, status: 'pending' }
        ]
    },
    {
        id: '3',
        name: 'Leptospirosis',
        category: 'Infectious / Nephrology',
        aiGeneratedDate: '2025-12-15',
        status: 'pending',
        sources: [
            "ACVIM Consensus Statement on Leptospirosis (2023 update)",
            "Greene's Infectious Diseases"
        ],
        symptoms: [
            { id: 's1', category: 'lab', name: 'Azotemia (Acute Kidney Injury)', level: 4, aiConfidence: 0.96, status: 'pending' },
            { id: 's2', category: 'vital', name: 'Fever', level: 2, aiConfidence: 0.65, status: 'pending' },
            { id: 's3', category: 'finding', name: 'Muscle Tenderness / Pain', level: 3, aiConfidence: 0.40, status: 'pending' },
            { id: 's4', category: 'finding', name: 'Icterus (Jaundice)', level: 2, aiConfidence: 0.80, status: 'pending' },
            { id: 's5', category: 'lab', name: 'Thrombocytopenia', level: 3, aiConfidence: 0.70, status: 'pending' }
        ]
    },
    {
        id: '4',
        name: 'Cushing\'s Disease (Hyperadrenocorticism)',
        category: 'Endocrinology',
        aiGeneratedDate: '2025-12-16',
        status: 'pending',
        sources: [
            "Feldman & Nelson's Canine and Feline Endocrinology",
            "Ettinger's Internal Medicine"
        ],
        symptoms: [
            { id: 's1', category: 'complaint', name: 'Polyuria / Polydipsia (PU/PD)', level: 5, aiConfidence: 0.98, status: 'pending' },
            { id: 's2', category: 'complaint', name: 'Polyphagia (Increased Appetite)', level: 4, aiConfidence: 0.95, status: 'pending' },
            { id: 's3', category: 'finding', name: 'Pot-bellied appearance', level: 4, aiConfidence: 0.92, status: 'pending' },
            { id: 's4', category: 'finding', name: 'Alopecia (Truncal, Bilateral)', level: 3, aiConfidence: 0.85, status: 'pending' },
            { id: 's5', category: 'finding', name: 'Calcinosis Cutis', level: 5, aiConfidence: 0.70, status: 'pending' }
        ]
    },
    {
        id: '5',
        name: 'Pancreatitis (Acute, Canine)',
        category: 'Gastroenterology',
        aiGeneratedDate: '2025-12-16',
        status: 'pending',
        sources: [
            "Washabau & Day's Canine and Feline Gastroenterology",
            "J Small Anim Pract Protocols"
        ],
        symptoms: [
            { id: 's1', category: 'complaint', name: 'Vomiting', level: 5, aiConfidence: 0.97, status: 'pending' },
            { id: 's2', category: 'finding', name: 'Cranial Abdominal Pain', level: 4, aiConfidence: 0.88, status: 'pending' },
            { id: 's3', category: 'complaint', name: 'Anorexia', level: 4, aiConfidence: 0.90, status: 'pending' },
            { id: 's4', category: 'complaint', name: 'Diarrhea', level: 2, aiConfidence: 0.60, status: 'pending' },
            { id: 's4b', category: 'lab', name: 'cPLI (Elevated)', level: 4, aiConfidence: 0.95, status: 'pending' },
            { id: 's5', category: 'finding', name: 'Prayer Posture', level: 5, aiConfidence: 0.95, status: 'pending' }
        ]
    }
];
