
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// CONSTANTS FOR CHECKOUT URLS
// TODO: Replace with real WordPress/Stripe links
const CHECKOUT_URLS = {
    STANDARD_6: '#',
    STANDARD_12: '#',
    STANDARD_24: '#',
    STANDARD_48: '#',
    VIP_12: '#',
    VIP_PLUS_16: '#',
};

interface Plan {
    id: string;
    name: string;
    duration: string;
    type: 'STANDARD' | 'VIP' | 'VIP_PLUS';
    description: string;
    features: string[];
    highlight?: boolean;
    url: string;
}

export default function TarifsPage() {
    const plans: Plan[] = [
        // STANDARD
        {
            id: 'std_6',
            name: 'Standard 6 Semaines',
            duration: '6 semaines',
            type: 'STANDARD',
            description: "2 semaines de Détox + 4 semaines d’Équilibre (1 cycle complet).",
            features: ['Alternance Détox & Équilibre', 'Menus hebdomadaires', 'Listes de courses', 'Accès groupe Facebook'],
            url: CHECKOUT_URLS.STANDARD_6
        },
        {
            id: 'std_12',
            name: 'Standard 12 Semaines',
            duration: '12 semaines',
            type: 'STANDARD',
            description: "2 semaines de Détox + 4 semaines d’Équilibre, répétés 2 fois.",
            features: ['Programme complet', 'Phases de Consolidation incluses', 'Support communauté'],
            highlight: true,
            url: CHECKOUT_URLS.STANDARD_12
        },
        {
            id: 'std_24',
            name: 'Standard 24 Semaines',
            duration: '24 semaines',
            type: 'STANDARD',
            description: "2 semaines de Détox + 4 semaines d’Équilibre, répétés 4 fois (programme long).",
            features: ['Suivi long terme', 'Adaptation aux saisons', 'Accès prioritaire aux défis'],
            url: CHECKOUT_URLS.STANDARD_24
        },
        {
            id: 'std_48',
            name: 'Standard 48 Semaines',
            duration: '48 semaines',
            type: 'STANDARD',
            description: "Programme sur 1 an : 2 semaines de Détox + 4 semaines d’Équilibre, répétés 8 fois.",
            features: ['Transformation totale', 'Expertise IKONGA maximale', 'Tarif mensuel avantageux'],
            url: CHECKOUT_URLS.STANDARD_48
        },
        // VIP
        {
            id: 'vip_12',
            name: 'VIP 12 Semaines',
            duration: '12 semaines',
            type: 'VIP',
            description: "3 semaines de Détox + 3 semaines d’Équilibre, répétés 2 fois. Formule plus intensive.",
            features: ['Suivi personnalisé par coach', 'Bilan bi-mensuel', 'Réponses sous 24h'],
            url: CHECKOUT_URLS.VIP_12
        },
        {
            id: 'vip_plus_16',
            name: 'VIP++ 16 Semaines',
            duration: '16 semaines',
            type: 'VIP_PLUS',
            description: "3 semaines de Détox + 3 semaines d’Équilibre + 3 semaines de Détox + 3 semaines d’Équilibre + 4 semaines de phase finale personnalisée.",
            features: ['Coaching individuel rapproché', 'Appels de suivi', 'Accès WhatsApp direct'],
            highlight: true,
            url: CHECKOUT_URLS.VIP_PLUS_16
        },
    ];

    const getBorderColor = (type: Plan['type']) => {
        switch (type) {
            case 'VIP': return 'border-t-purple-500';
            case 'VIP_PLUS': return 'border-t-black';
            default: return 'border-t-ikonga-primary';
        }
    };

    const getBadge = (type: Plan['type']) => {
        if (type === 'VIP') return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded uppercase">VIP</span>;
        if (type === 'VIP_PLUS') return <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded uppercase">VIP++</span>;
        return <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded uppercase">Standard</span>;
    };

    return (
        <div className="space-y-16">

            {/* HEADER */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-ikonga-text sm:text-5xl">
                    Choisis la formule IKONGA qui te correspond
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-500">
                    Standard, VIP, VIP++... toutes nos formules suivent la méthode éprouvée IKONGA avec ses 4 phases : Détox, Équilibre, Consolidation et Entretien.
                </p>
            </div>

            {/* PLANS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`flex flex-col justify-between hover:shadow-xl transition-shadow border-t-4 ${getBorderColor(plan.type)} ${plan.highlight ? 'ring-2 ring-ikonga-primary ring-opacity-50 transform scale-105 z-10' : ''}`}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                {getBadge(plan.type)}
                                {plan.highlight && <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">Populaire</span>}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-3xl font-extrabold text-gray-900 mt-2">{plan.duration}</p>
                            <p className="mt-4 text-sm text-gray-600 italic">
                                "{plan.description}"
                            </p>

                            <ul className="mt-6 space-y-4">
                                {/* Common base features */}
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span className="text-sm text-gray-700">Méthode IKONGA complète</span>
                                </li>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-sm text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8">
                            <a href={plan.url} target="_blank" rel="noopener noreferrer">
                                <Button
                                    className="w-full"
                                    variant={plan.highlight ? 'primary' : 'secondary'}
                                >
                                    Je choisis cette formule
                                </Button>
                            </a>
                        </div>
                    </Card>
                ))}
            </div>

            {/* FAQ SECTION */}
            <div className="max-w-3xl mx-auto pt-8 border-t border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Questions fréquentes</h2>

                <div className="space-y-8">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">Quand est-ce que je reçois mes menus ?</h4>
                        <p className="mt-2 text-gray-600">
                            Les menus sont disponibles dès le démarrage de ta cure dans ton tableau de bord personnel. Chaque semaine, le nouveau menu se débloque automatiquement.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">Comment se fait le suivi ?</h4>
                        <p className="mt-2 text-gray-600">
                            Tu enregistres tes pesées régulièrement dans l'application. En formule Standard, tu suis tes phases en autonomie guidée. En VIP, un coach analyse tes résultats.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">Puis-je prolonger mon abonnement ?</h4>
                        <p className="mt-2 text-gray-600">
                            Oui, absolument ! À la fin de ton programme, tu peux renouveler ton abonnement ou passer sur une formule d'entretien pour conserver tes acquis.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
