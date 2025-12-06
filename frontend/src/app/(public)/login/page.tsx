
'use client';

import { useState } from 'react';
import { authService } from '@/lib/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.login({ email, password });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Échec de la connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-ikonga-text">Connexion à IKONGA</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Entre ton email et ton mot de passe pour accéder à ton espace.
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ikonga-primary focus:border-ikonga-primary sm:text-sm"
                            placeholder="exemple@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            {/* Optional Forgot Password Link */}
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ikonga-primary focus:border-ikonga-primary sm:text-sm"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        disabled={loading}
                        variant="primary"
                        className="w-full"
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                </div>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Pas encore de compte ?{' '}
                        <Link href="/signup" className="font-medium text-ikonga-primary hover:text-ikonga-primaryDark transition-colors">
                            S’inscrire
                        </Link>
                    </p>
                </div>
            </form>
        </Card>
    );
}
