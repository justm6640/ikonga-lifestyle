'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dashboardService, DashboardKpis } from '@/lib/dashboard.service';
import { userService, UserProfile } from '@/lib/user.service';
import { Card } from '@/components/ui/Card';
import { Tile } from '@/components/ui/Tile';
import WeightLast7DaysCard from '@/components/dashboard/WeightLast7DaysCard';

// --- Icons Definitions ---
const Icons = {
    // Suivi : orange #FA8662
    Tracking: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FA8662" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
        </svg>
    ),
    // Communauté : violet pastel (using a soft purple like #A78BFA or similar to match request "violet pastel")
    Community: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    // Nutrition : vert pastel (#86EFAC is a nice pastel green, or similar)
    Nutrition: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.94c1.76 1.41 4.5 1.55 6.44.15a4.7 4.7 0 0 0 1.28-5.74L12 2" />
            <path d="M12 2L4.28 15.35a4.7 4.7 0 0 0 1.28 5.74c1.94 1.4 4.68 1.26 6.44-.15" />
            <path d="M12 2v19" />
        </svg>
    ),
    // Fitness : bleu pastel (#60A5FA)
    Fitness: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5l5 5" />
            <path d="M21 21l-1-1" />
            <path d="M3 3l1 1" />
            <path d="M18 22l4-4" />
            <path d="M2 6l4-4" />
            <path d="M3 10l7-7" />
            <path d="M14 21l7-7" />
        </svg>
    ),
    // Wellness : jaune pastel (#FACC15 is yellow, maybe a bit softer like #FDE047)
    Wellness: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
    ),
    // Beauté : rose pastel (#F472B6)
    Beauty: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C7.03 2 3 6.03 3 11c0 6.5 9 13 9 13s9-6.5 9-13c0-4.97-4.03-9-9-9z" />
            <path d="M12 11m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        </svg>
    ),
    // Coming Soon (Gray)
    Shop: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
    ),
    Chat: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    ),
    Academy: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    )
};

export default function DashboardPage() {
    const router = useRouter();
    const [kpis, setKpis] = useState<DashboardKpis | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [dashboardData, profile] = await Promise.all([
                    dashboardService.getDashboard(),
                    userService.getProfile()
                ]);

                setKpis(dashboardData);
                setUserProfile(profile);
            } catch (err: any) {
                console.error('Erreur chargement dashboard:', err);
                setError('Impossible de charger le tableau de bord. Veuillez vous reconnecter.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ikonga-orange"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 bg-ikonga-orange text-white rounded-lg hover:opacity-90"
                >
                    Se connecter
                </button>
            </div>
        );
    }

    if (!kpis || !userProfile) return null;

    const formatWeight = (weight: number | null) => {
        if (weight === null) return "--";
        return weight.toFixed(1);
    };

    const getPhaseDisplay = (phase: string | null) => {
        if (!phase) return 'Aucun programme';
        const phaseNames: Record<string, string> = {
            'DETOX': 'Détox',
            'EQUILIBRE': 'Équilibre',
            'CONSOLIDATION': 'Consolidation',
            'ENTRETIEN': 'Entretien',
        };
        return phaseNames[phase] || phase;
    };

    // Calculate progress for gauge
    const dayProgress = kpis.jourDansLaPhase || 0;
    const maxDays = 21;
    const percentage = Math.min((dayProgress / maxDays) * 100, 100);
    // 175 is the approx ref circumference from before
    const targetOffset = 175 - (175 * percentage) / 100;

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-20 md:pb-10">
            {/* 1. Header */}
            <header className="flex items-center justify-between animate-slide-down">
                <div>
                    <h1 className="text-xl md:text-3xl font-serif text-gray-900 leading-tight">
                        Hello, {userProfile.firstName || 'Ikonga Girl'}
                    </h1>
                    <p className="text-gray-500 text-xs md:text-sm">Ton espace bien-être</p>
                </div>
                <div className="relative w-10 h-10 md:w-12 md:h-12">
                    <div className="w-full h-full rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                        {/* Placeholder Avatar */}
                        <span className="text-gray-500 font-bold text-base md:text-lg">
                            {userProfile.firstName ? userProfile.firstName.charAt(0) : 'U'}
                        </span>
                    </div>
                    {/* Online Dot Pulse */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse-green"></div>
                </div>
            </header>

            {/* 2. Phase Card */}
            <div className="relative overflow-hidden rounded-[24px] md:rounded-[28px] bg-gradient-to-r from-[#F79A32] to-[#E5488A] p-5 md:p-6 text-white shadow-lg shadow-orange-500/20 animate-scale-in">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] md:text-sm font-medium opacity-90 uppercase tracking-wide mb-1">Phase en cours</p>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-1 md:mb-2 leading-none">{getPhaseDisplay(kpis.phaseActuelle)}</h2>
                        <p className="text-xs md:text-sm opacity-90">
                            Jour {kpis.jourDansLaPhase || 1} <span className="opacity-60">/ {maxDays}</span>
                        </p>
                    </div>
                    {/* Circular Gauge */}
                    <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="6"
                                fill="none"
                            />
                            <circle
                                className="gauge-circle-fill"
                                cx="50%"
                                cy="50%"
                                r="45%"
                                stroke="white"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={175}
                                strokeDashoffset={targetOffset}
                                strokeLinecap="round"
                                style={{ '--target-offset': targetOffset } as any}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-xs md:text-sm animate-fade-in delay-200">
                            {Math.round(percentage)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Indicators & Chart */}
            <div className="space-y-6 md:space-y-8">
                {/* Indicators - 2 Cols even on mobile */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <Card className="flex flex-col items-center justify-center py-5 md:py-6 !rounded-[20px] md:!rounded-[24px] animate-slide-up delay-100 hover-lift transition-all duration-300">
                        <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">Poids actuel</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl md:text-3xl font-bold text-gray-900">{formatWeight(kpis.poidsActuel)}</span>
                            <span className="text-[10px] md:text-xs text-gray-400">kg</span>
                        </div>
                    </Card>
                    <Card className="flex flex-col items-center justify-center py-5 md:py-6 !rounded-[20px] md:!rounded-[24px] animate-slide-up delay-200 hover-lift transition-all duration-300">
                        <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">Poids perdu</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl md:text-3xl font-bold text-ikonga-orange">
                                {kpis.poidsTotalPerdu ? `-${formatWeight(kpis.poidsTotalPerdu)}` : '0'}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-400">kg</span>
                        </div>
                    </Card>
                </div>

                {/* Weight Chart - Full Width */}
                <div className="w-full animate-slide-up delay-300">
                    <WeightLast7DaysCard userId={userProfile.id} />
                </div>
            </div>

            {/* 4. Section: TON PROGRAMME */}
            <section className="animate-slide-up delay-400">
                <h3 className="text-base md:text-lg font-serif text-gray-900 mb-3 md:mb-4">Ton Programme</h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <FeatureCard
                        icon={Icons.Tracking}
                        title="Suivi Global"
                        href="/weigh-ins"
                        color="bg-white"
                    />
                    <FeatureCard
                        icon={Icons.Community}
                        title="Communauté"
                        href="#"
                        color="bg-white"
                    />
                </div>
            </section>

            {/* 5. Section: TES PILIERS */}
            <section className="animate-slide-up delay-500">
                <h3 className="text-base md:text-lg font-serif text-gray-900 mb-3 md:mb-4">Tes Piliers</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <PillarCard title="Nutrition" icon={Icons.Nutrition} color="bg-green-50 text-green-700" href="/menus" />
                    <PillarCard title="Fitness" icon={Icons.Fitness} color="bg-blue-50 text-blue-700" />
                    <PillarCard title="Wellness" icon={Icons.Wellness} color="bg-yellow-50 text-yellow-700" />
                    <PillarCard title="Beauté" icon={Icons.Beauty} color="bg-pink-50 text-pink-700" />
                </div>
            </section>

            {/* 6. Section: Bientôt disponible */}
            <section className="animate-fade-in delay-600">
                <h3 className="text-base md:text-lg font-serif text-gray-400 mb-3 md:mb-4">Bientôt disponible</h3>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <ComingSoonCard icon={Icons.Shop} label="Shop" />
                    <ComingSoonCard icon={Icons.Chat} label="Chat" />
                    <ComingSoonCard icon={Icons.Academy} label="Academy" />
                </div>
            </section>

        </div>
    );
}

// --- Helper Components ---

function FeatureCard({ icon, title, href, color }: { icon: ReactNode, title: string, href: string, color: string }) {
    return (
        <Link href={href} className={`${color} p-3 md:p-4 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover-scale-sm h-24 md:h-28`}>
            <div className="transform scale-90 md:scale-100">{icon}</div>
            <span className="font-medium text-gray-800 text-xs md:text-sm text-center leading-tight">{title}</span>
        </Link>
    );
}

function PillarCard({ icon, title, color, href }: { icon: ReactNode, title: string, color: string, href?: string }) {
    const content = (
        <div className={`${color} p-3 md:p-4 rounded-[20px] md:rounded-[24px] flex flex-col items-center justify-center gap-2 md:gap-3 h-28 md:h-32 transition-transform duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer`}>
            <div className="transform scale-90 md:scale-100">{icon}</div>
            <span className="font-serif font-medium text-sm text-gray-800">{title}</span>
        </div>
    );

    if (href) return <Link href={href} className="block">{content}</Link>;
    return content;
}

function ComingSoonCard({ icon, label }: { icon: ReactNode, label: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 p-2 md:p-3 opacity-60 hover-brightness transition-all duration-500 group cursor-default">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500">
                {icon}
            </div>
            <span className="text-[10px] md:text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">{label}</span>
        </div>
    );
}
