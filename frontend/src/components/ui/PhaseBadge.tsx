
import React from 'react';

type PhaseType = 'DETOX' | 'EQUILIBRE' | 'CONSOLIDATION' | 'ENTRETIEN';

interface PhaseBadgeProps {
    phase: PhaseType | string;
    className?: string;
}

export function PhaseBadge({ phase, className = '' }: PhaseBadgeProps) {
    // Normalize string key
    const normalizedPhase = phase.toUpperCase();

    const getColors = (p: string) => {
        switch (p) {
            case 'DETOX':
                return 'bg-ikonga-primary text-white';
            case 'EQUILIBRE':
                return 'bg-green-100 text-green-800';
            case 'CONSOLIDATION':
                return 'bg-blue-100 text-blue-800';
            case 'ENTRETIEN':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getColors(normalizedPhase)} ${className}`}>
            {phase}
        </span>
    );
}
