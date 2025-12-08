import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required' },
            { status: 400 }
        );
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://application.ikonga.shop/api';
        const backendUrl = `${apiUrl}/weigh-ins/last-7-days?userId=${userId}`;

        // Forward Authorization header if present
        const authHeader = request.headers.get('Authorization');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            // Forward the error from backend
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error fetching weights:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
