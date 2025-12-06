
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, UserProfile } from '@/lib/auth.service';
import { adminService, AdminUser } from '@/lib/admin.service';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [usersList, setUsersList] = useState<AdminUser[]>([]);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const profile = await authService.getProfile();
                if (profile.role !== 'ADMIN') {
                    // Redirect or show access denied
                    setLoading(false);
                    return;
                }
                setUser(profile);

                // Fetch users
                const { data } = await adminService.getUsers(1, 20); // Default first page
                setUsersList(data);
            } catch (error) {
                console.error('Failed to load admin data', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    if (loading) {
        return <div className="p-8 text-white">Chargement...</div>;
    }

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Accès Refusé 🚫</h1>
                <p className="text-gray-300">Cette page est réservée aux administrateurs.</p>
                <div className="mt-6">
                    <Button onClick={() => router.push('/dashboard')}>Retour au Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-gray-900">Administration</h1>
                    <p className="text-gray-500 mt-1">Gérez les utilisateurs et les abonnements.</p>
                </div>
                {/* <Button>Nouvel Utilisateur</Button> */}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                <th className="p-4 font-serif">Utilisateur</th>
                                <th className="p-4 font-serif">Email</th>
                                <th className="p-4 font-serif">Rôle</th>
                                <th className="p-4 font-serif">Inscrit le</th>
                                <th className="p-4 font-serif text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {usersList.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">
                                        {u.firstName} {u.lastName}
                                    </td>
                                    <td className="p-4 text-gray-600">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                            u.role === 'COACH' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button
                                            variant="secondary"
                                            className="text-sm px-3 py-1"
                                            onClick={() => router.push(`/admin/users/${u.id}`)}
                                        >
                                            Voir
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {usersList.length === 0 && (
                    <div className="p-8 text-center text-gray-500">Aucun utilisateur trouvé.</div>
                )}
            </div>
        </div>
    );
}
