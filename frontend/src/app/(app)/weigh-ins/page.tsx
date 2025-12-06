'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Tile } from '@/components/ui/Tile';
import { Button } from '@/components/ui/Button';
import { weighInsService, WeighIn, WeighInStats, WeighInPeriod } from '@/lib/weigh-ins.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeighInsPage() {
    // Data States
    const [weighIns, setWeighIns] = useState<WeighIn[]>([]);
    const [stats, setStats] = useState<WeighInStats | null>(null);
    const [period, setPeriod] = useState<WeighInPeriod>('7d');

    // UI States
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [formWeight, setFormWeight] = useState<string>('');
    const [formNote, setFormNote] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [data, statsData] = await Promise.all([
                weighInsService.getAll(period),
                weighInsService.getStats(),
            ]);
            setWeighIns(data);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch weigh-ins', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddWeighIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formWeight) return;

        setSubmitting(true);
        try {
            await weighInsService.create({
                date: formDate,
                weightKg: parseFloat(formWeight),
                note: formNote || undefined,
            });
            // Reset form
            setFormWeight('');
            setFormNote('');
            setFormDate(new Date().toISOString().split('T')[0]);

            // Refresh data
            await fetchData();
        } catch (error) {
            console.error('Failed to add weigh-in', error);
            const message = error instanceof Error ? error.message : 'Erreur lors de l\'ajout de la pesée.';
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    // Chart Data Formatting
    const chartData = weighIns.map(w => ({
        date: new Date(w.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        poids: w.weightKg,
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif text-gray-900 mb-1">Suivi de mon poids</h1>
                <p className="text-gray-500">Suivez l'évolution de votre poids au fil du temps</p>
            </div>

            {/* Top Section: Stats & Add Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Stats Card */}
                <div className="space-y-4">
                    {stats && stats.lastWeightKg && (
                        <Tile variant="primary">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-bold uppercase opacity-80 mb-1">Dernier Poids</h3>
                                    <div className="text-3xl font-bold">
                                        {stats.lastWeightKg.toFixed(1)} <span className="text-lg">kg</span>
                                    </div>
                                </div>
                                <span className="text-3xl opacity-80">⚖️</span>
                            </div>
                        </Tile>
                    )}

                    <Card>
                        <h2 className="text-lg font-serif text-ikonga-orange mb-4">Statistiques</h2>
                        {stats ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">Min / Max</span>
                                    <span className="font-medium">
                                        {stats.minWeightKg} - {stats.maxWeightKg} kg
                                    </span>
                                </div>

                                {/* IMC Section */}
                                {stats.imc && (
                                    <>
                                        <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">IMC Actuel</span>
                                            <span className="text-lg font-bold text-blue-600">{stats.imc}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stats.imcCategory === 'Poids normal' ? 'bg-green-100 text-green-800' :
                                                    stats.imcCategory === 'Surpoids' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {stats.imcCategory}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Aucune donnée disponible.</p>
                        )}
                    </Card>
                </div>

                {/* Add Form Card */}
                <Card className="lg:col-span-2">
                    <h2 className="text-lg font-serif text-gray-800 mb-4">Ajouter une pesée</h2>
                    <form onSubmit={handleAddWeighIn} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ikonga-orange/50"
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                placeholder="0.0"
                                value={formWeight}
                                onChange={(e) => setFormWeight(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ikonga-orange/50"
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optionnel)</label>
                            <input
                                type="text"
                                placeholder="..."
                                value={formNote}
                                onChange={(e) => setFormNote(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ikonga-orange/50"
                            />
                        </div>
                        <div className="w-full md:w-auto">
                            <Button type="submit" variant="primary" disabled={submitting}>
                                {submitting ? '...' : 'Enregistrer'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Chart Section */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-lg font-serif text-gray-800">Historique</h2>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        {(['7d', '30d', 'all'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${period === p
                                        ? 'bg-ikonga-orange text-white font-medium shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {p === '7d' ? '7 Jours' : p === '30d' ? '30 Jours' : 'Tout'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-gray-400">Chargement...</div>
                    ) : weighIns.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorPoids" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F79A32" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F79A32" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    domain={['dataMin - 1', 'dataMax + 1']}
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    unit="kg"
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="poids"
                                    stroke="#F79A32"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPoids)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Aucune pesée enregistrée pour cette période.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
