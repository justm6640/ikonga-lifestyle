
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-ikonga-background font-sans text-ikonga-text">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-ikonga-primary tracking-tight hover:opacity-90 transition-opacity">
                        IKONGA
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-ikonga-primary transition-colors">
                            Accueil
                        </Link>
                        <Link href="/tarifs" className="text-sm font-medium text-gray-600 hover:text-ikonga-primary transition-colors">
                            Tarifs
                        </Link>
                        <Link href="/login">
                            <Button variant="primary" className="ml-4">
                                Connexion
                            </Button>
                        </Link>
                    </nav>

                    {/* Mobile Menu Button - Placeholder */}
                    <div className="md:hidden">
                        <Link href="/login" className="text-sm font-medium text-ikonga-primary">
                            Connexion
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col">
                <div className="w-full max-w-5xl mx-auto px-4 py-12 flex-grow">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Programme IKONGA - Minceur et bien-être</p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <Link href="#" className="hover:text-gray-900 transition-colors">
                            Conditions générales
                        </Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">
                            Mentions légales
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
