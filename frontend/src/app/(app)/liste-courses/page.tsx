'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';
import { shoppingListService, WeeklyShoppingList } from '@/lib/shopping-list.service';
import ShoppingCategoryCard from '@/components/ShoppingCategoryCard';
import { Card } from '@/components/ui/Card';

export default function ListeCoursesPage() {
    const router = useRouter();
    const [list, setList] = useState<WeeklyShoppingList | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const loadList = async () => {
            try {
                const data = await shoppingListService.getWeeklyShoppingList();
                setList(data);
            } catch (err) {
                console.error(err);
                setError('Impossible de charger la liste de courses.');
            } finally {
                setLoading(false);
            }
        };

        loadList();
    }, [router]);

    const handlePrint = () => {
        window.print();
    };

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

    if (!list) {
        return (
            <Card className="text-center py-12 border-dashed border-2">
                <h3 className="mt-2 text-lg font-serif text-gray-900">Aucune liste disponible</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Impossible de générer la liste pour le moment (menu manquant ?).
                </p>
            </Card>
        );
    }

    const totalItems = Object.values(list.categories).reduce((sum, items) => sum + items.length, 0);
    const categoryCount = Object.keys(list.categories).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900 mb-1">Ma liste de courses</h1>
                    <div className="flex items-center mt-2 gap-2">
                        <span className="text-sm text-gray-500">Semaine {list.week}</span>
                        <span className="text-gray-300">•</span>
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#F79A32] to-[#E5488A] text-white text-xs font-bold uppercase">
                            {list.phase}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F79A32] to-[#E5488A] text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                    <span className="text-lg">🖨️</span>
                    Imprimer ma liste
                </button>
            </div>

            <div className="hidden print:block mb-8">
                <h1 className="text-2xl font-bold">Liste de courses IKONGA</h1>
                <p className="text-sm">Semaine {list.week} - Phase {list.phase}</p>
            </div>

            <div className="grid-cards">
                <div className="lg:col-span-2">
                    <div className="grid-cards-2">
                        {Object.entries(list.categories).map(([category, items]) => (
                            <ShoppingCategoryCard key={category} category={category} items={items} />
                        ))}
                    </div>
                </div>

                <div className="space-y-5 print:hidden">
                    <Card>
                        <h3 className="text-lg font-serif text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-xl">📋</span>
                            Résumé
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Articles</span>
                                <span className="text-2xl font-bold text-ikonga-orange">{totalItems}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Catégories</span>
                                <span className="text-xl font-bold text-gray-700">{categoryCount}</span>
                            </div>
                            <div className="pt-2">
                                <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-3 border border-orange-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Programme</p>
                                    <p className="text-sm font-medium text-gray-800">
                                        Semaine {list.week} • <span className="text-ikonga-orange">{list.phase}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">💡</span>
                            <div>
                                <h4 className="font-serif text-sm text-gray-900 mb-1">Astuce</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Organisez vos courses par rayon pour gagner du temps au supermarché !
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
