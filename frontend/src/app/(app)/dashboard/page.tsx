'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardService, DashboardKpis } from '@/lib/dashboard.service';
import { userService } from '@/lib/user.service';
import { Card } from '@/components/ui/Card';
import { Tile } from '@/components/ui/Tile';
import WeightLast7DaysCard from '@/components/dashboard/WeightLast7DaysCard';

export default function DashboardPage() {
    const router = useRouter();
    const [kpis, setKpis] = useState<DashboardKpis | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [dashboardData, userProfile] = await Promise.all([
                    dashboardService.getDashboard(),
                    userService.getProfile()
                ]);

                setKpis(dashboardData);
                setUserId(userProfile.id);
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

    if (!kpis) return null;

    const formatWeight = (weight: number | null) => {
        if (weight === null) return null;
        return weight.toFixed(1);
    };

    const getPhaseDisplay = (phase: string | null) => {
        if (!phase) return 'Aucun programme actif';
        const phaseNames: Record<string, string> = {
            'DETOX': 'Détox',
            'EQUILIBRE': 'Équilibre',
            'CONSOLIDATION': 'Consolidation',
            'ENTRETIEN': 'Entretien',
        };
        return phaseNames[phase] || phase;
    };

    return (
        <div className="gap-6 flex flex-col">
            <div className="flex items-end justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900 leading-tight">Bonjour !</h1>
                    <p className="text-gray-500 text-sm">Prêt à atteindre vos objectifs ?</p>
                </div>
            </div>

            <div className="grid-cards-2">
                <div className="space-y-6">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-serif text-ikonga-orange">Poids actuel</h2>
                            <span className="text-2xl opacity-70">⚖️</span>
                        </div>
                        {kpis.poidsActuel !== null ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-gray-800">
                                    {formatWeight(kpis.poidsActuel)}
                                </span>
                                <span className="text-lg text-gray-400">kg</span>
                            </div>
                        ) : (
                            <div className="text-gray-400 italic text-sm">Aucune donnée</div>
                        )}
                    </Card>

                    <div className="grid-cards-2">
                        <Tile variant="primary">
                            <h3 className="text-xs font-bold uppercase opacity-80 mb-1">Poids perdu</h3>
                            <div className="text-2xl font-bold">
                                {kpis.poidsTotalPerdu ? `-${formatWeight(kpis.poidsTotalPerdu)}` : '0'} kg
                            </div>
                        </Tile>
                        <Tile variant="secondary">
                            <h3 className="text-xs font-bold uppercase opacity-80 mb-1">Phase</h3>
                            <div className="text-xl font-bold truncate">
                                {getPhaseDisplay(kpis.phaseActuelle)}
                            </div>
                        </Tile>
                    </div>
                </div>

                <div>
                    <WeightLast7DaysCard userId={userId} />
                </div>
            </div>

            <Card>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
                    <h2 className="text-xl font-serif text-gray-800">Menu du jour</h2>
                    <span className="text-xl">🍽️</span>
                </div>
                {kpis.menuDuJour ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <MenuRow label="Matin" value={kpis.menuDuJour.petitDejeuner} />
                        <MenuRow label="Midi" value={kpis.menuDuJour.dejeuner} />
                        <MenuRow label="Soir" value={kpis.menuDuJour.diner} />
                        {kpis.menuDuJour.collation && <MenuRow label="Collation" value={kpis.menuDuJour.collation} />}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-400 italic text-sm">
                        Aucun menu disponible pour aujourd'hui.
                    </div>
                )}
            </Card>
        </div>
    );
}

function MenuRow({ label, value }: { label: string; value: string | null }) {
    if (!value) return null;
    return (
        <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase">{label}</span>
            <span className="text-gray-700 font-medium">{value}</span>
        </div>
    );
}
