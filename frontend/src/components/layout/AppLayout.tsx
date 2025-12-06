'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { authService } from '@/lib/auth.service';
import { SidebarIcon } from '@/components/ui/SidebarIcon';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        authService.getProfile().then(user => {
            if (user && user.role === 'ADMIN') {
                setIsAdmin(true);
            }
        }).catch(() => {
            // Ignore error
        });
    }, []);

    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <div className="ik-dashboard-root">
            {/* Sidebar Gauche */}
            <aside className="ik-sidebar">
                <div className="mb-4 hidden md:block">
                    <span className="text-xl font-bold text-ikonga-primary tracking-tighter">IK</span>
                </div>

                <nav className="flex flex-col md:flex-col flex-row gap-4 md:gap-4 gap-2 items-center w-full">
                    <SidebarIcon
                        icon="dashboard"
                        href="/dashboard"
                        title="Tableau de bord"
                        active={isActive('/dashboard')}
                    />
                    <SidebarIcon
                        icon="menus"
                        href="/menus"
                        title="Menus"
                        active={isActive('/menus')}
                    />
                    <SidebarIcon
                        icon="shopping"
                        href="/liste-courses"
                        title="Liste de courses"
                        active={isActive('/liste-courses')}
                    />
                    <SidebarIcon
                        icon="phases"
                        href="/weigh-ins"
                        title="Pesées"
                        active={isActive('/weigh-ins')}
                    />

                    {isAdmin && (
                        <SidebarIcon
                            icon="vip"
                            href="/admin"
                            title="Administration"
                            active={isActive('/admin')}
                        />
                    )}

                    <SidebarIcon
                        icon="profile"
                        href="/mon-compte"
                        title="Mon Profil"
                        active={isActive('/mon-compte')}
                    />
                </nav>
            </aside>

            {/* Contenu Principal */}
            <main className="ik-dashboard-main">
                {children}
            </main>

            {/* Colonne Droite (Résumé) - Hidden on tablet and mobile via CSS */}
            <aside className="ik-dashboard-right">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-serif font-semibold text-gray-700">Mon Profil</h3>
                    <a href="/mon-compte" className="text-xs text-ikonga-primary hover:underline">Voir tout</a>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ikonga-primary to-pink-500 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-md">
                        IK
                    </div>
                    <p className="font-medium text-gray-900">Bienvenue !</p>
                    <p className="text-xs text-gray-500">Membre Standard</p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Rappel</p>
                        <p className="text-sm text-gray-700">N'oubliez pas de peser vos aliments pour le déjeuner !</p>
                    </div>
                </div>
            </aside>
        </div>
    );
}
