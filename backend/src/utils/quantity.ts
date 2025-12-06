
interface Quantity {
    quantity: number;
    unit: string;
}

export function formatQuantity(quantity: number, unit: string): Quantity {
    const q = Number(quantity);
    if (isNaN(q)) {
        return { quantity, unit };
    }

    // Grammes -> Kilogrammes
    if (unit.toLowerCase() === 'g' && q >= 1000) {
        return {
            quantity: parseFloat((q / 1000).toFixed(2)),
            unit: 'kg'
        };
    }

    // Millilitres -> Litres
    if (unit.toLowerCase() === 'ml' && q >= 1000) {
        return {
            quantity: parseFloat((q / 1000).toFixed(2)),
            unit: 'l'
        };
    }

    // Default: return as is, maybe rounded to 2 decimals if needed
    return {
        quantity: parseFloat(q.toFixed(2)),
        unit: unit
    };
}
