'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api';
import { menusService, CurrentMenuResponse, MenuDay, Recipe } from '@/lib/menus.service';
import { Card } from '@/components/ui/Card';

export default function MenusPage() {
    const router = useRouter();
    const [data, setData] = useState<CurrentMenuResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState(1);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const loadMenu = async () => {
            try {
                const response = await menusService.getCurrentMenu();
                setData(response);
            } catch (err) {
                console.error(err);
                setError('Impossible de charger le menu.');
            } finally {
                setLoading(false);
            }
        };

        loadMenu();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ikonga-orange"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                <p>{error}</p>
            </div>
        );
    }

    if (!data || !data.menu) {
        return (
            <Card className="text-center py-12 border-dashed border-2">
                <h3 className="mt-2 text-lg font-serif text-gray-900">Aucun menu disponible</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Votre programme n'a pas de menu assigné pour cette semaine.
                </p>
            </Card>
        );
    }

    const { menu } = data;
    const currentDayData = menu.days.find(d => d.jourNumero === selectedDay) || menu.days[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900 mb-1">Mes menus de la semaine</h1>
                    <p className="text-sm text-gray-500">Organisez vos repas et suivez le programme</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-100">
                    <span className="text-xs font-bold text-gray-500 uppercase">Phase</span>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#F79A32] to-[#E5488A] text-white text-sm font-bold">
                        {menu.phase}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm font-semibold text-gray-700">Semaine {menu.semaineNumero}</span>
                </div>
            </div>

            {/* Day Navigation */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {menu.days.map((day) => (
                    <button
                        key={day.id}
                        onClick={() => setSelectedDay(day.jourNumero)}
                        className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl transition-all ${selectedDay === day.jourNumero
                                ? 'bg-gradient-to-br from-[#F79A32] to-[#E5488A] text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                            }`}
                    >
                        <span className={`text-xs font-medium mb-1 ${selectedDay === day.jourNumero ? 'opacity-90' : 'text-gray-400'}`}>
                            Jour
                        </span>
                        <span className="text-2xl font-bold">
                            {day.jourNumero}
                        </span>
                    </button>
                ))}
            </div>

            {/* Day Detail Card */}
            <Card className="bg-gradient-to-br from-white to-orange-50/30">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F79A32] to-[#E5488A] flex items-center justify-center text-white shadow-lg">
                        <span className="text-3xl font-bold">{currentDayData.jourNumero}</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif text-gray-900">Jour {currentDayData.jourNumero}</h2>
                        <p className="text-sm text-gray-500">Vos repas pour la journée</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MealSection
                        icon="🌅"
                        label="Petit-déjeuner"
                        recipe={currentDayData.petitDejeuner}
                    />
                    <MealSection
                        icon="☀️"
                        label="Déjeuner"
                        recipe={currentDayData.dejeuner}
                    />
                    <MealSection
                        icon="🌙"
                        label="Dîner"
                        recipe={currentDayData.diner}
                    />
                </div>

                {currentDayData.collation && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <MealSection
                            icon="🍎"
                            label="Collation"
                            recipe={currentDayData.collation}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}

function MealSection({ icon, label, recipe }: { icon: string; label: string; recipe?: Recipe }) {
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</span>
            </div>
            {recipe ? (
                <Link
                    href={`/recipes/${recipe.id}`}
                    className="block group"
                >
                    <h3 className="text-lg font-serif text-gray-900 group-hover:text-ikonga-orange transition-colors leading-tight">
                        {recipe.title}
                    </h3>
                    <span className="inline-flex items-center text-xs text-ikonga-orange mt-2 group-hover:underline">
                        Voir la recette →
                    </span>
                </Link>
            ) : (
                <p className="text-sm text-gray-400 italic">Non défini</p>
            )}
        </div>
    );
}
