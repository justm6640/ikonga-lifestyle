import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'glass';
    className?: string;
}

export function Card({ children, variant = 'default', className = '' }: CardProps) {
    const variantClass = variant === 'glass' ? 'ik-card-glass' : 'ik-card';

    return (
        <div className={`${variantClass} ${className}`}>
            {children}
        </div>
    );
}
