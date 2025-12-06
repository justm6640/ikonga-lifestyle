import React from 'react';

interface TileProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    className?: string;
}

export function Tile({ children, variant = 'primary', className = '' }: TileProps) {
    const variantClass = variant === 'secondary' ? 'ik-tile-secondary' : 'ik-tile-primary';

    return (
        <div className={`${variantClass} ${className}`}>
            {children}
        </div>
    );
}
