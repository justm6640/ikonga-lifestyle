'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFF9F5] to-white pt-12 pb-16 lg:pt-20 lg:pb-24">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Column: Text */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-ikonga-orange font-bold text-xs uppercase tracking-wider mb-6">
                                Nouveau Programme 2025
                            </span>
                            <h1 className="text-4xl lg:text-6xl font-serif font-medium text-[#2D2D2D] leading-[1.15] mb-6">
                                Révélez votre <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F79A32] to-[#E5488A]">
                                    meilleure version
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
                                La méthode IKONGA allie nutrition, sport et bien-être pour une transformation durable. Rejoignez des milliers de femmes qui ont changé leur vie.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Link href="/register" className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#F79A32] to-[#E5488A] text-white font-bold text-lg shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-1">
                                    Commencer maintenant
                                    <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link href="/tarifs" className="px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-700 font-bold text-lg shadow-sm hover:bg-gray-50 transition-all hover:-translate-y-1">
                                    Voir les programmes
                                </Link>
                            </div>
                        </motion.div>

                        {/* Social Proof / Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="mt-12 flex items-center gap-4 text-sm font-medium text-gray-500"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <span className="text-[10px]">User</span>
                                    </div>
                                ))}
                            </div>
                            <p>Déjà <span className="text-ikonga-orange font-bold">10,000+</span> ikonga girls</p>
                        </motion.div>
                    </div>

                    {/* Right Column: Visual */}
                    <motion.div
                        className="w-full lg:w-1/2 relative"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        {/* Abstract Decor Elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                        {/* App Phone Mockup */}
                        <div className="relative z-10 mx-auto max-w-[200px] lg:max-w-[280px]">
                            <div className="relative rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl bg-white aspect-[9/19] group">
                                {/* Glass Reflection / Glare */}
                                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50"></div>

                                {/* Mockup Screen Content */}
                                <div className="absolute inset-0 bg-gray-50 flex flex-col">
                                    {/* Mock Header */}
                                    <div className="h-20 bg-gradient-to-r from-[#F79A32] to-[#E5488A] p-5 flex flex-col justify-end relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                                        <div className="w-14 h-3 bg-white/40 rounded-full mb-2"></div>
                                        <div className="w-20 h-5 bg-white rounded-full shadow-sm"></div>
                                    </div>

                                    {/* Mock Body */}
                                    <div className="p-5 space-y-3 flex-1 overflow-hidden">
                                        <div className="flex gap-3 mb-6">
                                            <div className="w-1/2 aspect-square rounded-xl bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] p-3 flex flex-col justify-between hover:scale-105 transition-transform duration-300">
                                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-xs">🔥</div>
                                                <div className="w-12 h-2 bg-gray-100 rounded-full"></div>
                                            </div>
                                            <div className="w-1/2 aspect-square rounded-xl bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] p-3 flex flex-col justify-between hover:scale-105 transition-transform duration-300 delay-75">
                                                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 text-xs">💧</div>
                                                <div className="w-12 h-2 bg-gray-100 rounded-full"></div>
                                            </div>
                                        </div>

                                        <div className="h-28 rounded-xl bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] p-3 w-full relative overflow-hidden">
                                            <div className="absolute top-3 left-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">Progression</div>
                                            <div className="w-full h-full flex items-end pt-4">
                                                {/* Chart Line Mock */}
                                                <svg className="w-full h-12" viewBox="0 0 100 40" preserveAspectRatio="none">
                                                    <path d="M0 40 L0 30 L10 32 L20 25 L30 28 L40 15 L50 18 L60 8 L70 12 L80 5 L90 10 L100 20 L100 40 Z" fill="url(#gradMock)" className="text-orange-100" />
                                                    <path d="M0 30 L10 32 L20 25 L30 28 L40 15 L50 18 L60 8 L70 12 L80 5 L90 10 L100 20" fill="none" stroke="#F79A32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <defs>
                                                        <linearGradient id="gradMock" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0" stopColor="#F79A32" stopOpacity="0.2" />
                                                            <stop offset="1" stopColor="#F79A32" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-10 w-full bg-white rounded-lg shadow-sm flex items-center px-3 gap-2 border border-gray-50/50">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${i === 1 ? 'bg-green-50 text-green-600' : 'bg-gray-100'}`}>
                                                        {i === 1 ? '✓' : ''}
                                                    </div>
                                                    <div className="flex-1 h-2 bg-gray-50 rounded-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge - Premium Redesign */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1, duration: 0.6, type: "spring", bounce: 0.5 }}
                                className="absolute top-[25%] -right-8 lg:-right-12 bg-white/95 backdrop-blur-sm p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center gap-3 z-30 transform hover:-translate-y-1 transition-transform cursor-default"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-900 font-extrabold text-sm leading-tight">-7kg/mois</p>
                                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-bold">en moyenne</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
