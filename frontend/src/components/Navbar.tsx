
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getToken, removeToken } from '@/lib/api';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check auth state on mount and when path changes
    useEffect(() => {
        const checkAuth = () => {
            const token = getToken();
            setIsLoggedIn(!!token);
        };

        checkAuth();

        // Listen for custom event 'auth-change' if we want immediate updates without nav
        const handleAuthChange = () => checkAuth();
        window.addEventListener('auth-change', handleAuthChange);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
        };
    }, [pathname]);

    const handleLogout = () => {
        removeToken();
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-900 tracking-wider">IKONGA</span>
                        </Link>

                        {isLoggedIn && (
                            <div className="hidden md:ml-8 md:flex md:space-x-8">
                                <Link
                                    href="/dashboard"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/dashboard'
                                            ? 'border-black text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/menus"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname.startsWith('/menus')
                                            ? 'border-black text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    Menus
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/profile"
                                    className={`text-sm font-medium ${pathname === '/profile' ? 'text-black' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Mon Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-red-600 hover:text-red-800"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                    Connexion
                                </Link>
                                <Link href="/signup" className="text-sm font-medium text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-md transition-colors">
                                    Inscription
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile Menu (Simplified) */}
            {isLoggedIn && (
                <div className="md:hidden border-t border-gray-100 flex justify-around py-2">
                    <Link href="/dashboard" className="text-xs font-medium text-gray-900">Dashboard</Link>
                    <Link href="/menus" className="text-xs font-medium text-gray-900">Menus</Link>
                    <Link href="/profile" className="text-xs font-medium text-gray-900">Profil</Link>
                </div>
            )}
        </nav>
    );
}
