// lib/agmarknet.ts
import NodeCache from "node-cache";

const BASE_URL = "https://api.ceda.ashoka.edu.in/v1/agmarknet";
const API_KEY = process.env.AGMARKNET_API_KEY;

// Cache for 10 minutes (600 seconds)
const cache = new NodeCache({ stdTTL: 600 });

async function getCachedData<T>(cacheKey: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = cache.get<T>(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const data = await fetchFn();
        cache.set(cacheKey, data);
        return data;
    } catch (error: any) {
        if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
            throw new Error('AgMarkNet API rate limit exceeded. Please try again later.');
        }
        throw error;
    }
}

async function safeFetch(url: string, options?: RequestInit) {
    const headers = {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }

    return await res.json();
}

export async function getCommodities() {
    const cacheKey = 'commodities';

    const data = await getCachedData(
        cacheKey,
        () => safeFetch(`${BASE_URL}/commodities`)
    );

    return data.output?.data || [];
}

export async function getGeographies() {
    const cacheKey = 'geographies';

    const data = await getCachedData(
        cacheKey,
        () => safeFetch(`${BASE_URL}/geographies`)
    );

    return data.output?.data || [];
}

export async function getMarkets(commodity_id: number, state_id: number, district_id: number) {
    const cacheKey = `markets:${commodity_id}:${state_id}:${district_id}`;
    const body = { commodity_id, state_id, district_id, indicator: "price" };

    const data = await getCachedData(
        cacheKey,
        () => safeFetch(`${BASE_URL}/markets`, {
            method: "POST",
            body: JSON.stringify(body),
        })
    );

    return data.output?.data || [];
}

export async function getPrices({
    commodity_id,
    state_id,
    district_id,
    market_id,
    from_date,
    to_date,
}: {
    commodity_id: number;
    state_id: number;
    district_id: number;
    market_id: number;
    from_date: string;
    to_date: string;
}) {
    const cacheKey = `prices:${commodity_id}:${state_id}:${district_id}:${market_id}:${from_date}:${to_date}`;
    const body = {
        commodity_id,
        state_id,
        district_id: [district_id],
        market_id: [market_id],
        from_date,
        to_date,
        indicator: "price",
    };

    const data = await getCachedData(
        cacheKey,
        () => safeFetch(`${BASE_URL}/prices`, {
            method: "POST",
            body: JSON.stringify(body),
        })
    );

    return data.output?.data || [];
}

export async function getMarketData(params: {
    commodity_id: number
    state_id: number
    district_id?: number
    market_id?: number
    from_date?: string
    to_date?: string
    indicator?: string
}) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agmarknet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    })

    if (!res.ok) throw new Error(`AgmarkNet fetch failed: ${res.statusText}`)
    return res.json()
}

