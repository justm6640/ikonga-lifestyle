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
                // Use the proxy endpoint
                // We need to attach the token for the proxy to forward it
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

    // Calculate trend
    let trendText = null;
    let trendColor = 'text-gray-500';

    if (data.length >= 2) {
        const first = data[0].value;
        const last = data[data.length - 1].value;
        const diff = last - first;
        const sign = diff > 0 ? '+' : '';
        trendText = `${sign}${diff.toFixed(1)} kg sur 7 jours`;

        if (diff < 0) trendColor = 'text-green-600'; // Weight loss is good
        else if (diff > 0) trendColor = 'text-red-500'; // Weight gain
    }

    if (loading) {
        return (
            <Card variant="glass" className="h-64 flex items-center justify-center border-0">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ikonga-orange"></div>
            </Card>
        );
    }

    return (
        <Card variant="glass" className="border-0">
            <div className="mb-4">
                <h3 className="text-[#FA8662] font-serif text-lg">Évolution du poids sur 7 jours</h3>
                {data.length > 0 ? (
                    <p className={`text-sm ${trendColor} font-medium mt-1`}>
                        {trendText || 'Stable'}
                    </p>
                ) : (
                    <p className="text-sm text-gray-400 mt-1">Pas encore de données</p>
                )}
            </div>

            <div className="h-48 w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                labelFormatter={formatDate}
                                formatter={(value: number) => [`${value} kg`, 'Poids']}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#F79A32"
                                strokeWidth={3}
                                activeDot={{ r: 6, fill: '#E5488A', stroke: '#fff', strokeWidth: 2 }}
                                dot={{ r: 4, fill: '#E5488A', strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm italic bg-gray-50/50 rounded-lg">
                        <p>Pas encore de pesées sur les 7 derniers jours</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
