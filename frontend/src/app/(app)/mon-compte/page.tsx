'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService, UserProfile } from '@/lib/user.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { authService } from '@/lib/auth.service';

export default function MonComptePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await userService.getProfile();
                setProfile(data);
            } catch (err: any) {
                console.error('Erreur chargement profil:', err);
                setError('Impossible de charger votre profil. Veuillez vous reconnecter.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Chargement du profil...</div>;

    if (error) return (
        <div className="p-8 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => router.push('/login')}>Se connecter</Button>
        </div>
    );

    if (!profile) return null;

    const formatDate = (isoString?: string) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900 mb-1">Mon Compte</h1>
                    <p className="text-gray-500">Gérez vos informations personnelles</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-50 to-pink-50 text-ikonga-orange rounded-full text-sm font-medium border border-orange-100">
                        {profile.role}
                    </span>
                    <Button variant="ghost" onClick={handleLogout} className="text-red-500 border border-red-200 hover:bg-red-50 hover:text-red-600">
                        Déconnexion
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Informations de base */}
                <Card>
                    <h2 className="text-lg font-serif text-ikonga-orange mb-4 flex items-center gap-2">
                        <span>👤</span> Identité
                    </h2>
                    <div className="space-y-3">
                        <ProfileRow label="Prénom" value={profile.firstName} />
                        <ProfileRow label="Nom" value={profile.lastName} />
                        <ProfileRow label="Email" value={profile.email} />
                        <ProfileRow label="Compte créé le" value={formatDate(profile.createdAt)} />
                    </div>
                </Card>

                {/* Informations personnelles */}
                <Card>
                    <h2 className="text-lg font-serif text-ikonga-orange mb-4 flex items-center gap-2">
                        <span>🧬</span> Détails Personnels
                    </h2>
                    <div className="space-y-3">
                        <ProfileRow label="Sexe" value={profile.sexe === 'F' ? 'Femme' : profile.sexe === 'M' ? 'Homme' : profile.sexe} />
                        <ProfileRow label="Date de naissance" value={formatDate(profile.dateNaissance)} />
                        <ProfileRow label="Taille" value={profile.tailleCm ? `${profile.tailleCm} cm` : '-'} />
                    </div>
                </Card>

                {/* Localisation */}
                <Card>
                    <h2 className="text-lg font-serif text-ikonga-orange mb-4 flex items-center gap-2">
                        <span>🌍</span> Localisation
                    </h2>
                    <div className="space-y-3">
                        <ProfileRow label="Pays d'origine" value={profile.paysOrigine} />
                        <ProfileRow label="Pays de résidence" value={profile.paysResidence} />
                        <ProfileRow label="Ville de résidence" value={profile.villeResidence} />
                    </div>
                </Card>

                {/* Contact */}
                <Card>
                    <h2 className="text-lg font-serif text-ikonga-orange mb-4 flex items-center gap-2">
                        <span>📱</span> Contact
                    </h2>
                    <div className="space-y-3">
                        <ProfileRow label="Téléphone / WhatsApp" value={profile.contact} />
                    </div>
                </Card>

            </div>
        </div>
    );
}

function ProfileRow({ label, value }: { label: string, value?: string | number | null }) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
            <span className="text-sm text-gray-500 mb-1 sm:mb-0 font-medium">{label}</span>
            <span className="text-gray-900">{value || '-'}</span>
        </div>
    );
}
