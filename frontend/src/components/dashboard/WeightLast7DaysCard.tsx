'use client';

import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { getToken } from '@/lib/api';

type WeightPoint = {
    id: string;
    date: string;
    value: number;
};

interface WeightLast7DaysCardProps {
    userId?: string | null;
}

export default function WeightLast7DaysCard({ userId }: WeightLast7DaysCardProps) {
    const [data, setData] = useState<WeightPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const token = getToken();
                const response = await fetch(`/api/weights/last-7-days?userId=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch weight data');
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error(err);
                setError('Impossible de charger la courbe');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    // Format date "DD/MM"
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <Card variant="glass" className="h-64 flex items-center justify-center border-0 !rounded-[24px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ikonga-orange"></div>
            </Card>
        );
    }

    return (
        <Card variant="glass" className="border-0 !rounded-[24px] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#FA8662] font-serif text-lg">Évolution du poids</h3>
                <Link
                    href="/weigh-ins"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors"
                    title="Voir le détail"
                >
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 9L5 5L1 1" stroke="#FA8662" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>

            <div className="h-48 w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '8px 12px' }}
                                itemStyle={{ color: '#FA8662', fontWeight: 600 }}
                                labelStyle={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}
                                labelFormatter={formatDate}
                                formatter={(value: number) => [`${value} kg`, 'Poids']}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#F79A32"
                                strokeWidth={3}
                                activeDot={{ r: 6, fill: '#E5488A', stroke: '#fff', strokeWidth: 2 }}
                                dot={{ r: 4, fill: '#F79A32', strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm italic bg-gray-50/30 rounded-2xl border border-dashed border-gray-100">
                        <p>Pas encore de pesées sur les 7 derniers jours</p>
                        <Link href="/weigh-ins" className="mt-2 text-xs text-ikonga-orange font-medium hover:underline">
                            Ajouter une pesée
                        </Link>
                    </div>
                )}
            </div>
        </Card>
    );
}
