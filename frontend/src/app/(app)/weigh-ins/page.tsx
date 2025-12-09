'use client';

import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { weighInsService, WeighIn, WeighInPeriod } from '@/lib/weigh-ins.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function WeighInsPage() {
    // Data States
    const [weighIns, setWeighIns] = useState<WeighIn[]>([]);
    const [period, setPeriod] = useState<WeighInPeriod>('7d');
    const [viewMode, setViewMode] = useState<'chart' | 'photos'>('chart');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    // UI States
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [formWeight, setFormWeight] = useState<string>('');
    const [formNote, setFormNote] = useState<string>('');
    const [formPhoto, setFormPhoto] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (period !== 'custom') {
            fetchData();
        }
    }, [period]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await weighInsService.getAll(period, customStart, customEnd);
            setWeighIns(data);
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
                photo: formPhoto || undefined,
            });

            // Reset form
            setFormWeight('');
            setFormNote('');
            setFormPhoto(null);
            setFormDate(new Date().toISOString().split('T')[0]);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Close modal & Refresh data
            setIsModalOpen(false);
            await fetchData();
        } catch (error) {
            console.error('Failed to add weigh-in', error);
            const message = error instanceof Error ? error.message : 'Erreur lors de l\'ajout de la pesée.';
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormPhoto(e.target.files[0]);
        }
    };

    // Chart Data Formatting
    const chartData = weighIns.map(w => ({
        date: new Date(w.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        poids: w.weightKg,
    }));

    // Photos Data Filtering (Mock logic: Assuming photoUrl exists, or temporarily checking note content for demo)
    // For now, filter items that have a photoUrl (after backend update)
    const photosData = weighIns.filter(w => w.photoUrl);

    return (
        <div className="space-y-8 relative pb-24">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900 mb-1">Suivi de mon poids</h1>
                    <p className="text-gray-500">Suivez votre progression vers votre objectif</p>
                </div>
                {/* Button moved to bottom fixed position */}
            </div>

            {/* Evolution Section (Chart & Photos) */}
            <Card>
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-serif text-gray-800">Évolution</h2>

                            {/* View Toggle */}
                            <div className="bg-gray-100 p-1 rounded-full flex items-center relative">
                                {/* Active Indicator */}
                                <motion.div
                                    className="absolute top-1 bottom-1 bg-white shadow-sm rounded-full z-0"
                                    initial={false}
                                    animate={{
                                        left: viewMode === 'chart' ? '4px' : '50%',
                                        width: 'calc(50% - 4px)'
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />

                                <button
                                    onClick={() => setViewMode('chart')}
                                    className={`relative z-10 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 rounded-full transition-colors ${viewMode === 'chart' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <span>📈</span> <span className="hidden sm:inline">Graphique</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('photos')}
                                    className={`relative z-10 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 rounded-full transition-colors ${viewMode === 'photos' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <span>📸</span> <span className="hidden sm:inline">Photos</span>
                                </button>
                            </div>
                        </div>

                        {/* Segmented Control - iOS Style */}
                        <div className="bg-gray-100/80 backdrop-blur-sm rounded-full p-1 flex gap-1 items-center w-full max-w-md mx-auto">
                            {(['3d', '7d', '30d', 'all', 'custom'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`flex-1 px-3 py-1.5 text-[13px] font-medium rounded-full transition-all duration-300 ${period === p
                                            ? 'bg-white text-gray-900 shadow-sm font-bold transform scale-100'
                                            : 'text-gray-500 hover:text-gray-700 bg-transparent hover:bg-gray-200/50'
                                        }`}
                                >
                                    {p === '3d' ? '3j' : p === '7d' ? '7j' : p === '30d' ? '30j' : p === 'all' ? 'Tout' : '📅'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Date Inputs */}
                    <AnimatePresence>
                        {period === 'custom' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">Du</span>
                                    <input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ikonga-orange/50 focus:border-ikonga-orange outline-none bg-gray-50"
                                    />
                                    <span className="text-sm text-gray-500">Au</span>
                                    <input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ikonga-orange/50 focus:border-ikonga-orange outline-none bg-gray-50"
                                    />
                                    <button
                                        onClick={fetchData}
                                        disabled={!customStart || !customEnd}
                                        className="ml-2 px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Valider
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="min-h-[300px] w-full">
                    <AnimatePresence mode="wait">
                        {viewMode === 'chart' ? (
                            <motion.div
                                key="chart"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-[300px] w-full"
                            >
                                {loading ? (
                                    <div className="h-full flex items-center justify-center text-gray-400">Chargement...</div>
                                ) : weighIns.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorPoids" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#F79A32" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#F79A32" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                domain={['dataMin - 1', 'dataMax + 1']}
                                                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                                unit="kg"
                                            />
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100">
                                                                <p className="text-xs font-bold text-gray-900 mb-1">{payload[0].payload.date}</p>
                                                                <p className="text-sm font-bold text-ikonga-orange">
                                                                    {payload[0].value} <span className="text-xs font-normal text-gray-500">kg</span>
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="poids"
                                                stroke="#F79A32"
                                                strokeWidth={2.5}
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
                            </motion.div>
                        ) : (
                            <motion.div
                                key="photos"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                {loading ? (
                                    <div className="h-[300px] flex items-center justify-center text-gray-400">Chargement...</div>
                                ) : photosData.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {photosData.map((w, idx) => (
                                            <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md group border border-gray-100">
                                                {/* Using standard img tag since photoUrl is already an absolute or relative URL string */}
                                                <img
                                                    src={w.photoUrl}
                                                    alt={`Pesée du ${w.date}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
                                                    <p className="text-white font-bold text-lg">{w.weightKg} <span className="text-sm font-normal opacity-80">kg</span></p>
                                                    <p className="text-gray-200 text-xs font-medium">{new Date(w.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <span className="text-4xl mb-4 opacity-50">📸</span>
                                        <p className="text-center px-4">Ajoutez une photo à vos pesées pour voir votre transformation.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>

            {/* History Table Section */}
            <Card>
                <div className="mb-4">
                    <h2 className="text-lg font-serif text-gray-800">Historique</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500">
                                <th className="py-3 text-left font-medium">Date</th>
                                <th className="py-3 text-left font-medium">Poids</th>
                                <th className="py-3 text-left font-medium">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {weighIns.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 text-gray-900 font-medium">
                                        {new Date(item.date).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="py-3 text-ikonga-orange font-bold">
                                        {item.weightKg} kg
                                    </td>
                                    <td className="py-3 text-gray-500">
                                        {item.note || '-'}
                                    </td>
                                </tr>
                            ))}
                            {!loading && weighIns.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-400">
                                        Aucune donnée pour cette période.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Glass Gradient Fade + Floating Action Button */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-40" />
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto">
                <Button
                    variant="premium-gradient"
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 text-lg shadow-xl shadow-[#FF5E62]/40 hover:shadow-2xl hover:shadow-[#FF5E62]/60 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                    <span className="mr-2 text-xl">+</span> Nouvelle pesée
                </Button>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 border-b border-orange-100">
                                    <h3 className="text-xl font-serif text-gray-900">Nouvelle pesée</h3>
                                    <p className="text-sm text-gray-500 mt-1">Enregistrez votre progression du jour</p>
                                </div>

                                <form onSubmit={handleAddWeighIn} className="p-6 space-y-5">
                                    {/* Date Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={formDate}
                                            onChange={(e) => setFormDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ikonga-orange/50 transition-shadow bg-gray-50/50"
                                        />
                                    </div>

                                    {/* Weight Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.1"
                                                required
                                                placeholder="ex: 65.5"
                                                value={formWeight}
                                                onChange={(e) => setFormWeight(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ikonga-orange/50 transition-shadow bg-gray-50/50 text-lg font-bold text-gray-900"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                                        </div>
                                    </div>

                                    {/* Photo Input (Optional) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optionnel)</label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full px-4 py-3 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-colors cursor-pointer flex items-center justify-center gap-2 group"
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <span className="text-xl group-hover:scale-110 transition-transform">📸</span>
                                            <span className="text-sm text-gray-500 group-hover:text-ikonga-orange">
                                                {formPhoto ? formPhoto.name : "Ajouter une photo"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Note Input (Optional) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optionnel)</label>
                                        <input
                                            type="text"
                                            placeholder="Comment vous sentez-vous ?"
                                            value={formNote}
                                            onChange={(e) => setFormNote(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ikonga-orange/50 transition-shadow bg-gray-50/50"
                                        />
                                    </div>

                                    <div className="pt-2 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <Button
                                            type="submit"
                                            variant="premium-gradient"
                                            disabled={submitting}
                                            className="flex-1 shadow-lg shadow-[#FF5E62]/25 hover:shadow-[#FF5E62]/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? 'Enregistrement...' : 'Enregistrer'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
