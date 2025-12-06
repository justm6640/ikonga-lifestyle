import { ShoppingListItem } from '@/lib/shopping-list.service';

interface Props {
    category: string;
    items: ShoppingListItem[];
}

const categoryIcons: Record<string, string> = {
    'Fruits': '🍎',
    'Légumes': '🥦',
    'Viandes': '🥩',
    'Poissons': '🐟',
    'Féculents': '🌾',
    'Produits laitiers': '🥛',
    'Épicerie': '🏪',
    'Boissons': '🥤',
    'Condiments': '🧂',
    'Autres': '📦',
};

export default function ShoppingCategoryCard({ category, items }: Props) {
    const icon = categoryIcons[category] || '📦';

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-shadow">
            {/* Gradient Top Border */}
            <div className="h-1 bg-gradient-to-r from-[#F79A32] to-[#E5488A]"></div>

            <div className="p-5">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="text-lg font-serif text-gray-900">{category}</h3>
                    <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                        {items.length}
                    </span>
                </div>

                {/* Items List */}
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between text-sm group">
                            <div className="flex items-center gap-2 flex-1">
                                <span className="text-ikonga-orange text-xs">●</span>
                                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                                    {item.ingredient}
                                </span>
                            </div>
                            <span className="text-ikonga-orange font-medium ml-2 flex-shrink-0">
                                {item.quantity} {item.unit}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
