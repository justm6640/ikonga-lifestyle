'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect if needed (optional since it's always fixed/glass)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'Tarifs', href: '/tarifs' },
        { name: 'À propos', href: '/about' }, // Added hypothetical link for balance
    ];

    return (
        <>
            <header className="fixed top-4 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4 pointer-events-none">
                <nav className="pointer-events-auto flex items-center justify-between rounded-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_18px_45px_rgba(15,23,42,0.08)] px-6 py-3 transition-all duration-300">

                    {/* 1. Left: Logo */}
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="p-[2px] rounded-lg bg-gradient-to-tr from-[#F79A32] via-[#FA8662] to-[#E5488A] group-hover:scale-105 transition-transform">
                            <div className="h-5 w-5 rounded-md bg-white flex items-center justify-center">
                                <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#F79A32] to-[#E5488A]">IK</span>
                            </div>
                        </div>
                        <span className="font-semibold text-slate-900 text-base tracking-tight">IKONGA</span>
                    </Link>

                    {/* 2. Center: Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${pathname === link.href
                                    ? 'text-slate-900 font-semibold'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* 3. Right: Auth Buttons */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                            Login
                        </Link>

                        <Link href="/signup" className="inline-flex items-center rounded-full bg-gradient-to-r from-[#F79A32] via-[#FA8662] to-[#E5488A] p-[1.5px] group hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
                            <span className="block rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-slate-900 group-hover:bg-white transition-colors">
                                Sign up
                            </span>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col items-center gap-8 text-center"
                    >
                        <div className="flex flex-col gap-6 w-full max-w-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-medium text-slate-800 hover:text-[#F79A32] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="w-full max-w-sm h-px bg-gray-100 my-2"></div>

                        <div className="flex flex-col gap-4 w-full max-w-sm">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 text-slate-700 font-medium hover:text-slate-900 transition-colors">
                                Se connecter
                            </Link>
                            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#F79A32] to-[#E5488A] text-white font-bold shadow-lg hover:shadow-orange-500/25 transition-all">
                                Commencer maintenant
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
