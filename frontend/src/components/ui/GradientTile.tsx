import React from 'react';

interface GradientTileProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export function GradientTile({ children, variant = 'primary', className = '' }: GradientTileProps) {
    const baseStyles = {
        color: '#ffffff',
        borderRadius: 'var(--ik-radius-md)',
        padding: '20px',
        boxShadow: 'var(--ik-shadow-soft)',
    };

    const variantStyles = {
        primary: {
            background: 'linear-gradient(135deg, var(--ik-primary-start), var(--ik-primary-end))',
        },
        secondary: {
            background: 'linear-gradient(135deg, var(--ik-secondary-start), var(--ik-secondary-end))',
        }
    };

    return (
        <div
            className={className}
            style={{
                ...baseStyles,
                ...variantStyles[variant],
            }}
        >
            {children}
        </div>
    );
}
