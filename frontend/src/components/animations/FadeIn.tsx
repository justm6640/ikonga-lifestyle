'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function FadeIn({
    children,
    delay = 0,
    duration = 0.5,
    direction = 'none',
    className = '',
    ...props
}: FadeInProps) {
    const directions = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 },
        none: { x: 0, y: 0 },
    };

    const initial = {
        opacity: 0,
        ...directions[direction],
    };

    const animate = {
        opacity: 1,
        x: 0,
        y: 0,
    };

    return (
        <motion.div
            initial={initial}
            animate={animate}
            transition={{
                duration,
                delay,
                ease: 'easeOut',
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
