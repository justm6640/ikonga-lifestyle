'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authService } from '@/lib/auth.service';
import { adminService, AdminUserOverview } from '@/lib/admin.service';
import { adminSubscriptionsService } from '@/lib/adminSubscriptions.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminUserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<AdminUserOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

    // Form state for subscription assignment
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [assignError, setAssignError] = useState<string | null>(null);
    const [assignSuccess, setAssignSuccess] = useState(false);
    const [formData, setFormData] = useState({
        type: 'STANDARD12',
        startDate: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check Admin
                const profile = await authService.getProfile();
                if (profile.role !== 'ADMIN') {
                    setError("Accès réservé aux administrateurs");
                    return;
                }

                // Fetch Overview
                const id = params.id as string;
                if (!id) return;

                const overview = await adminService.getUserOverview(id);
                setData(overview);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erreur lors du chargement');
            } finally {
                setLoading(false);
            }
        };

        const fetchSubscriptions = async () => {
            try {
                const id = params.id as string;
                if (!id) return;
                setLoadingSubscriptions(true);
                const subs = await adminSubscriptionsService.getUserSubscriptions(id);
                setSubscriptions(subs);
            } catch (err: any) {
                console.error('Error fetching subscriptions:', err);
            } finally {
                setLoadingSubscriptions(false);
            }
        };

        fetchData();
        fetchSubscriptions();
    }, [params.id]);

    const handleAssignSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAssignLoading(true);
        setAssignError(null);
        setAssignSuccess(false);

        try {
            await adminSubscriptionsService.assignSubscriptionToUser({
                userId: params.id as string,
                type: formData.type as any,
                startDate: formData.startDate,
            });

            setAssignSuccess(true);
            setShowAssignForm(false);
            setFormData({ type: 'STANDARD12', startDate: '' });

            // Reload subscriptions and user data
            const id = params.id as string;
            const [subs, overview] = await Promise.all([
                adminSubscriptionsService.getUserSubscriptions(id),
                adminService.getUserOverview(id),
            ]);
            setSubscriptions(subs);
            setData(overview);
        } catch (err: any) {
            // Check for specific backend error message regarding active subscription
            // The backend returns: "Cet utilisateur a déjà un abonnement actif..."
            const msg = err.message || 'Erreur lors de l\'assignation';
            setAssignError(msg);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleDeleteSubscription = async (subscriptionId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ? Cette action supprimera également les phases associées.')) {
            return;
        }

        try {
            await adminSubscriptionsService.deleteSubscription(subscriptionId);

            // Reload subscriptions
            const id = params.id as string;
            const subs = await adminSubscriptionsService.getUserSubscriptions(id);
            setSubscriptions(subs);

            // Reload overview to update active subscription status if needed
            const overview = await adminService.getUserOverview(id);
            setData(overview);
        } catch (err: any) {
            alert('Erreur lors de la suppression: ' + err.message);
        }
    };

    if (loading) return <div className="p-8 text-white">Chargement...</div>;

    if (error) {
        return (
            <div className="p-8 text-center bg-red-500/10 rounded-xl m-8 border border-red-500/30">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Erreur</h1>
                <p className="text-gray-300">{error}</p>
                <div className="mt-6">
                    <Button onClick={() => router.push('/admin')}>Retour Admin</Button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { user, activeSubscription, programStatus, weightStats } = data;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" className="mb-2 pl-0 hover:pl-2 transition-all text-gray-500 hover:text-gray-900" onClick={() => router.back()}>
                        ← Retour
                    </Button>
                    <h1 className="text-3xl font-serif text-gray-900">
                        {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-500">Fiche client détaillée</p>
                </div>
                <div className="text-right">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border ${user.role === 'ADMIN' ? 'border-red-500/50 text-red-700 bg-red-100' :
                        user.role === 'COACH' ? 'border-yellow-500/50 text-yellow-800 bg-yellow-100' :
                            'border-blue-500/50 text-blue-700 bg-blue-100'
                        }`}>
                        {user.role}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Informations Personnelles */}
                <Card className="bg-white border-gray-200 shadow-sm text-gray-700">
                    <h2 className="text-xl font-serif text-ikonga-primary mb-4 flex items-center gap-2">
                        <span>👤</span> Informations
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Nom Complet</span>
                            <span className="font-medium">{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Inscrit le</span>
                            <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-gray-500">ID</span>
                            <span className="text-xs text-gray-400 font-mono">{user.id}</span>
                        </div>
                    </div>
                </Card>

                {/* 2. Abonnement Actif */}
                <Card className="bg-white border-gray-200 shadow-sm text-gray-700">
                    <h2 className="text-xl font-serif text-ikonga-primary mb-4 flex items-center gap-2">
                        <span>💳</span> Abonnement Actif
                    </h2>
                    {activeSubscription ? (
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Type</span>
                                <span className="font-bold text-gray-900">{activeSubscription.type}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Statut</span>
                                <span className={
                                    activeSubscription.status === 'ACTIVE' ? 'text-green-600' :
                                        activeSubscription.status === 'SUSPENDED' ? 'text-orange-500' : 'text-red-500'
                                }>{activeSubscription.status}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Du</span>
                                <span className="font-medium">{new Date(activeSubscription.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-gray-500">Au</span>
                                <span className="font-medium">{new Date(activeSubscription.endDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            Aucun abonnement actif
                        </div>
                    )}
                </Card>

                {/* 3. Statut Programme */}
                <Card className="bg-white border-gray-200 shadow-sm text-gray-700">
                    <h2 className="text-xl font-serif text-ikonga-primary mb-4 flex items-center gap-2">
                        <span>📅</span> Avancement Programme
                    </h2>
                    {programStatus && programStatus.hasActiveSubscription && !programStatus.isFinished ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                                <div className="text-sm text-gray-500">Phase</div>
                                <div className="text-xl font-bold text-gray-900">{programStatus.phase || 'En attente'}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                                <div className="text-sm text-gray-500">Semaine</div>
                                <div className="text-xl font-bold text-gray-900">{programStatus.weekInPhase || '-'}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                                <div className="text-sm text-gray-500">Jour Phase</div>
                                <div className="text-xl font-bold text-ikonga-primary">{programStatus.dayInPhase || '-'}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                                <div className="text-sm text-gray-500">Jour Total</div>
                                <div className="text-xl font-bold text-gray-700">{programStatus.dayInProgram || '-'}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            Programme non démarré ou terminé
                        </div>
                    )}
                </Card>

                {/* 4. Santé & Poids */}
                <Card className="bg-white border-gray-200 shadow-sm text-gray-700">
                    <h2 className="text-xl font-serif text-ikonga-primary mb-4 flex items-center gap-2">
                        <span>⚖️</span> Santé & Poids
                    </h2>
                    {weightStats ? (
                        <div className="space-y-4">
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-gray-500 text-sm">Dernier Poids</div>
                                    <div className="text-3xl font-bold text-gray-900">{weightStats.lastWeightKg} <span className="text-sm text-gray-500">kg</span></div>
                                    <div className="text-xs text-gray-400">{new Date(weightStats.lastDate).toLocaleDateString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-sm">IMC</div>
                                    <div className="text-3xl font-bold text-ikonga-primary">{weightStats.imc || '-'}</div>
                                    <div className="text-xs text-yellow-600">{weightStats.imcCategory}</div>
                                </div>
                            </div>

                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex mt-2 border border-gray-100">
                                <div className="bg-blue-300 w-1/3 opacity-50"></div>
                                <div className="bg-green-300 w-1/3 opacity-50"></div>
                                <div className="bg-red-300 w-1/3 opacity-50"></div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                                <span>Min: {weightStats.minWeightKg} kg</span>
                                <span>Max: {weightStats.maxWeightKg} kg</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            Aucune donnée de poids
                        </div>
                    )}
                </Card>
            </div>

            {/* 5. Gestion des Abonnements */}
            <Card className="bg-white border-gray-200 shadow-sm text-gray-700">
                <h2 className="text-xl font-serif text-ikonga-primary mb-4 flex items-center gap-2">
                    <span>📋</span> Abonnements IKONGA
                </h2>

                {assignSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        ✓ Abonnement créé avec succès !
                    </div>
                )}

                {/* Liste des abonnements */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Historique</h3>
                    {loadingSubscriptions ? (
                        <div className="text-gray-500">Chargement...</div>
                    ) : subscriptions.length > 0 ? (
                        <div className="space-y-2">
                            {subscriptions.map((sub: any) => (
                                <div key={sub.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center group">
                                    <div>
                                        <div className="font-bold text-gray-900 flex items-center gap-2">
                                            {sub.type}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                sub.status === 'SUSPENDED' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-gray-200 text-gray-600'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 text-sm px-3 py-1 h-auto"
                                        onClick={() => handleDeleteSubscription(sub.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            Aucun abonnement
                        </div>
                    )}
                </div>

                {/* Bouton pour afficher le formulaire */}
                {!showAssignForm && (
                    <Button
                        onClick={() => setShowAssignForm(true)}
                        className="w-full"
                    >
                        + Assigner un nouvel abonnement
                    </Button>
                )}

                {/* Formulaire d'assignation */}
                {showAssignForm && (
                    <form onSubmit={handleAssignSubmit} className="border-t border-gray-200 pt-6 space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Nouvel Abonnement</h3>

                        {assignError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {assignError}
                            </div>
                        )}

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                Type d'abonnement
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                required
                            >
                                <option value="STANDARD6">Standard 6 semaines</option>
                                <option value="STANDARD12">Standard 12 semaines</option>
                                <option value="STANDARD24">Standard 24 semaines</option>
                                <option value="STANDARD48">Standard 48 semaines</option>
                                <option value="VIP12">VIP 12 semaines</option>
                                <option value="VIPPP16">VIP++ 16 semaines</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Date de début
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">La date de fin sera calculée automatiquement</p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={assignLoading}
                                className="flex-1"
                            >
                                {assignLoading ? 'Création...' : 'Créer l\'abonnement'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setShowAssignForm(false);
                                    setAssignError(null);
                                }}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
}
