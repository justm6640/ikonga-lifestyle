'use client';

import { useState } from 'react';
import { authService } from '@/lib/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { COUNTRIES } from '@/utils/countries';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        // Nouveaux champs
        sexe: '',
        paysOrigine: '',
        paysResidence: '',
        villeResidence: '',
        dateNaissance: '',
        contact: '',
        tailleCm: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            const data = await authService.signup({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                sexe: formData.sexe || undefined,
                paysOrigine: formData.paysOrigine || undefined,
                paysResidence: formData.paysResidence || undefined,
                villeResidence: formData.villeResidence || undefined,
                // Le backend convertira la string ISO (YYYY-MM-DD) en Date
                dateNaissance: formData.dateNaissance || undefined,
                contact: formData.contact || undefined,
                tailleCm: formData.tailleCm ? parseInt(formData.tailleCm, 10) : undefined,
            });

            if (data.access_token) {
                router.push('/profile');
            } else {
                router.push('/login');
            }
        } catch (err: any) {
            setError(err.message || 'Échec de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Créer un compte</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Déjà membre ?{' '}
                    <Link href="/login" className="font-medium text-black hover:text-gray-800 underline">
                        Se connecter
                    </Link>
                </p>
            </div>

            <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-100" onSubmit={handleSubmit}>
                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    {/* Identité */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                placeholder="Prénom"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                placeholder="Nom"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Email & Password */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            placeholder="exemple@email.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Informations Complémentaires */}
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du Profil</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                                <select
                                    id="sexe"
                                    name="sexe"
                                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    value={formData.sexe}
                                    onChange={handleChange}
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="F">Femme</option>
                                    <option value="M">Homme</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                                <input
                                    id="dateNaissance"
                                    name="dateNaissance"
                                    type="date"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    value={formData.dateNaissance}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="tailleCm" className="block text-sm font-medium text-gray-700 mb-1">Taille (cm)</label>
                                <input
                                    id="tailleCm"
                                    name="tailleCm"
                                    type="number"
                                    min="50"
                                    max="250"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="165"
                                    value={formData.tailleCm}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact (Tél/WhatsApp)</label>
                                <input
                                    id="contact"
                                    name="contact"
                                    type="text"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="+33 6 12 34 56 78"
                                    value={formData.contact}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label htmlFor="paysOrigine" className="block text-sm font-medium text-gray-700 mb-1">Pays d'origine</label>
                                <select
                                    id="paysOrigine"
                                    name="paysOrigine"
                                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    value={formData.paysOrigine}
                                    onChange={handleChange}
                                >
                                    <option value="">Sélectionnez un pays</option>
                                    {COUNTRIES.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="paysResidence" className="block text-sm font-medium text-gray-700 mb-1">Pays de résidence</label>
                                <select
                                    id="paysResidence"
                                    name="paysResidence"
                                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    value={formData.paysResidence}
                                    onChange={handleChange}
                                >
                                    <option value="">Sélectionnez un pays</option>
                                    {COUNTRIES.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="villeResidence" className="block text-sm font-medium text-gray-700 mb-1">Ville de résidence</label>
                                <input
                                    id="villeResidence"
                                    name="villeResidence"
                                    type="text"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="Paris"
                                    value={formData.villeResidence}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                    >
                        {loading ? 'Création de compte...' : 'S\'inscrire'}
                    </button>
                </div>
            </form>
        </div>
    );
}
