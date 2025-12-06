
import Link from 'next/link';
import { MenuDay, Recipe } from '@/lib/menus.service';
import { Card } from '@/components/ui/Card';

interface Props {
    day: MenuDay;
}

const MealLink = ({ label, recipe }: { label: string, recipe?: Recipe }) => (
    <div className="py-2 border-b border-gray-50 last:border-0 last:pb-0">
        <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</span>
        {recipe ? (
            <Link href={`/recipes/${recipe.id}`} className="block text-sm font-medium text-gray-800 hover:text-ikonga-primary transition-colors">
                {recipe.title}
            </Link>
        ) : (
            <span className="text-sm text-gray-400 italic">Non défini</span>
        )}
    </div>
);

export default function MenuDayCard({ day }: Props) {
    return (
        <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
            <h4 className="text-lg font-bold text-ikonga-text border-b border-gray-100 pb-3 mb-3 flex items-center">
                <span className="bg-ikonga-secondary text-ikonga-primaryDark w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 font-extrabold">
                    {day.jourNumero}
                </span>
                Jour {day.jourNumero}
            </h4>

            <div className="space-y-1 flex-grow">
                <MealLink label="Petit Déjeuner" recipe={day.petitDejeuner} />
                <MealLink label="Déjeuner" recipe={day.dejeuner} />
                <MealLink label="Dîner" recipe={day.diner} />
            </div>
        </Card>
    );
}
