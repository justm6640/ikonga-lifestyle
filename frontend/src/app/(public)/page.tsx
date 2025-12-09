import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="space-y-24">

      {/* HERO SECTION */}
      <Hero />

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Comment fonctionne le programme IKONGA</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            IKONGA n'est pas un régime restrictif ponctuel, c’est l'adoption d'un nouveau mode de vie sain à travers 4 phases clés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all border-l-4 border-l-ikonga-primary">
            <h3 className="font-bold text-lg text-ikonga-primary mb-2">1. Phase Détox</h3>
            <p className="text-gray-600 text-sm">
              Une phase essentielle pour relancer votre métabolisme, éliminer les toxines et désenflammer votre corps pour un départ sain.
            </p>
          </Card>
          <Card className="hover:shadow-lg transition-all border-l-4 border-l-green-500">
            <h3 className="font-bold text-lg text-green-600 mb-2">2. Phase Équilibre</h3>
            <p className="text-gray-600 text-sm">
              Réintroduction progressive des aliments. Apprenez à composer des assiettes gourmandes sans reprendre de poids.
            </p>
          </Card>
          <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-500">
            <h3 className="font-bold text-lg text-blue-600 mb-2">3. Phase Consolidation</h3>
            <p className="text-gray-600 text-sm">
              L'étape clé pour stabiliser vos résultats sur le long terme et éviter l’effet yo-yo redouté.
            </p>
          </Card>
          <Card className="hover:shadow-lg transition-all border-l-4 border-l-gray-400">
            <h3 className="font-bold text-lg text-gray-600 mb-2">4. Phase Entretien</h3>
            <p className="text-gray-600 text-sm">
              Vivez votre nouvelle vie ! Maintenez votre silhouette et votre énergie avec des habitudes ancrées.
            </p>
          </Card>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="bg-ikonga-secondary/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="relative z-10 text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Ce que tu reçois concrètement</h2>
          <p className="text-gray-600 mt-2">Tout ce dont tu as besoin pour réussir est inclus.</p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4 text-2xl">🍽️</div>
            <h4 className="font-bold text-gray-900">Menus Personnalisés</h4>
            <p className="text-sm text-gray-600 mt-2">Adaptés à chaque phase pour ne jamais manquer d'inspiration.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4 text-2xl">🛒</div>
            <h4 className="font-bold text-gray-900">Listes de Courses</h4>
            <p className="text-sm text-gray-600 mt-2">Prêtes à l'emploi pour gagner du temps en magasin.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4 text-2xl">📈</div>
            <h4 className="font-bold text-gray-900">Suivi Progression</h4>
            <p className="text-sm text-gray-600 mt-2">Visualisez votre perte de poids et l'évolution de vos mensurations.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4 text-2xl">💬</div>
            <h4 className="font-bold text-gray-900">Communauté Exclusive</h4>
            <p className="text-sm text-gray-600 mt-2">Échangez avec des femmes qui partagent les mêmes objectifs.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4 text-2xl">🧘‍♀️</div>
            <h4 className="font-bold text-gray-900">Coaching Lifestyle</h4>
            <p className="text-sm text-gray-600 mt-2">Conseils sur le sommeil, le stress et le mouvement.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4 text-2xl">🌍</div>
            <h4 className="font-bold text-gray-900">Culture & Saveurs</h4>
            <p className="text-sm text-gray-600 mt-2">Des recettes qui célèbrent la diversité culinaire.</p>
          </div>
        </div>
      </section>

      {/* CULTURE FOCUS */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Une méthode qui respecte ton quotidien</h2>
        <div className="prose prose-lg mx-auto text-gray-600">
          <p>
            Chez IKONGA, nous croyons que manger sainement ne signifie pas manger triste.
            Notre méthode intègre fièrement des <strong>plats afro-caribéens</strong> aux côtés de classiques occidentaux revisités.
          </p>
          <p className="mt-4">
            Finis les régimes à base de "vapeur sans goût". Ici, on mange de <strong>vrais plats</strong>, épicés, savoureux et adaptés à votre vie de famille et professionnelle.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ikonga-text text-white rounded-3xl p-12 text-center shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Prête à commencer ton parcours IKONGA ?</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg">
          Rejoins des milliers de femmes qui ont transformé leur silhouette et retrouvé leur énergie.
        </p>
        <Link href="/tarifs">
          <Button variant="primary" className="text-lg px-10 py-4 shadow-lg transform hover:scale-105 transition-transform duration-200">
            Voir les formules
          </Button>
        </Link>
      </section>
    </div>
  );
}
