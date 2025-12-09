
'use client';

import Link from 'next/link';
import Navbar from './Navbar';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-ikonga-background font-sans text-ikonga-text pt-24 md:pt-28">
            {/* New Glassmorphism Navbar */}
            <Navbar />

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
