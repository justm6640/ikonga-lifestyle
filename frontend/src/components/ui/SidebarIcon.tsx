import React from 'react';
import Link from 'next/link';

type IconType = 'dashboard' | 'menus' | 'shopping' | 'phases' | 'vip' | 'profile';

interface SidebarIconProps {
    icon: IconType;
    active?: boolean;
    href: string;
    title: string;
}

const iconSvgs: Record<IconType, (color: string) => React.ReactElement> = {
    dashboard: (color) => (
        <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-6 9 6"></path>
            <path d="M9 22V12h6v10"></path>
        </svg>
    ),
    menus: (color) => (
        <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M3 12h3M18 12h3"></path>
            <path d="M12 3v3M12 18v3"></path>
        </svg>
    ),
    shopping: (color) => (
        <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
    ),
    phases: (color) => (
        <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v3"></path>
            <path d="M6 7l-2 7a6 6 0 0 0 12 0l-2-7"></path>
            <path d="M6 7h12"></path>
        </svg>
    ),
    vip: (color) => (
        <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18l2-8 4 4 4-4 4 4 2-8"></path>
            <path d="M3 18h18l-1 3H4l-1-3z"></path>
        </svg>
    ),
    profile: (color) => (
        <svg width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="7" r="4"></circle>
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6"></path>
        </svg>
    ),
};

export function SidebarIcon({ icon, active = false, href, title }: SidebarIconProps) {
    const color = active ? '#FA8662' : '#666666';
    const IconSvg = iconSvgs[icon];

    return (
        <Link
            href={href}
            title={title}
            className={`ik-sidebar-icon ${active ? 'ik-sidebar-icon--active' : ''}`}
        >
            {IconSvg(color)}
        </Link>
    );
}
