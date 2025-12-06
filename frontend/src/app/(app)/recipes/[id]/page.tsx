
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';
import { recipesService, RecipeDetails, Ingredient } from '@/lib/recipes.service';
import { use } from 'react';

// Next.js 13+ params are async in some contexts, or passed as props.
// In app directory, params are passed as props to the page component.
// However, unwrapping might be needed depending on Next.js version strictness.
// For standard client component in Next 15 (which we might be assuming or compatible with):
// params is a Promise in recent versions for async server components, but for client components it's simpler to access if we receive it.

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use()
    const { id } = use(params);

    const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const loadRecipe = async () => {
            try {
                const data = await recipesService.getRecipe(id);
                setRecipe(data);
            } catch (err) {
                console.error(err);
                setError('Impossible de charger la recette.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadRecipe();
        }
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error || 'Recette introuvable.'}</p>
                            <button
                                onClick={() => router.back()}
                                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 underline"
                            >
                                Retour
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Parse JSON fields safely
    let parsedIngredients: Ingredient[] = [];
    let parsedSteps: string[] = [];

    try {
        parsedIngredients = typeof recipe.ingredients === 'string'
            ? JSON.parse(recipe.ingredients)
            : recipe.ingredients;

        parsedSteps = typeof recipe.steps === 'string'
            ? JSON.parse(recipe.steps)
            : recipe.steps;
    } catch (e) {
        console.error('JSON Parse error', e);
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Header / Navigation */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                </button>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Hero Section */}
                    <div className="relative bg-black text-white p-8 md:p-12">
                        <div className="flex justify-between items-start">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm uppercase tracking-wider">
                                {recipe.phaseTag}
                            </span>
                            {recipe.calories && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500/90 text-white shadow-sm">
                                    {recipe.calories} Kcal
                                </span>
                            )}
                        </div>
                        <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            {recipe.title}
                        </h1>
                        {recipe.description && (
                            <p className="mt-4 text-lg text-gray-300 max-w-2xl font-light">
                                {recipe.description}
                            </p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-0">
                        {/* Ingredients Column */}
                        <div className="md:col-span-1 bg-gray-50 p-8 border-b md:border-b-0 md:border-r border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center">
                                <span className="w-1 h-6 bg-black mr-3 rounded-full"></span>
                                Ingrédients
                            </h3>
                            <ul className="space-y-4">
                                {Array.isArray(parsedIngredients) ? parsedIngredients.map((ing, idx) => (
                                    <li key={idx} className="flex items-center text-gray-700 text-sm">
                                        <span className="w-2 h-2 bg-gray-300 rounded-full mr-3 shrink-0"></span>
                                        <span className="font-medium mr-1">{ing.name}</span>
                                        {ing.qty && <span className="text-gray-500">({ing.qty} {ing.unit})</span>}
                                    </li>
                                )) : (
                                    <span className="text-sm text-gray-500">Aucun ingrédient listé.</span>
                                )}
                            </ul>
                        </div>

                        {/* Preparation Column */}
                        <div className="md:col-span-2 p-8 bg-white">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-6 flex items-center">
                                <span className="w-1 h-6 bg-orange-500 mr-3 rounded-full"></span>
                                Préparation
                            </h3>
                            <div className="space-y-6">
                                {Array.isArray(parsedSteps) ? parsedSteps.map((step, idx) => (
                                    <div key={idx} className="flex">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold mr-4 shadow-md">
                                            {idx + 1}
                                        </span>
                                        <p className="text-gray-700 leading-relaxed pt-1">
                                            {step}
                                        </p>
                                    </div>
                                )) : (
                                    <p className="text-gray-500">Aucune étape listée.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
