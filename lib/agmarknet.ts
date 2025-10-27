// lib/agmarknet.ts
import NodeCache from "node-cache";

const BASE_URL = "https://api.ceda.ashoka.edu.in/v1/agmarknet";
const API_KEY = process.env.AGMARKNET_API_KEY;

// Cache for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

async function safeFetch(url: string, options?: RequestInit) {
    const headers = {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
    };

    const cacheKey = `${url}:${JSON.stringify(options?.body || {})}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }

    const data = await res.json();
    cache.set(cacheKey, data);
    return data;
}

export async function getCommodities() {
    const data = await safeFetch(`${BASE_URL}/commodities`);
    return data.output?.data || [];
}

export async function getGeographies() {
    const data = await safeFetch(`${BASE_URL}/geographies`);
    return data.output?.data || [];
}

export async function getMarkets(commodity_id: number, state_id: number, district_id: number) {
    const body = { commodity_id, state_id, district_id, indicator: "price" };
    const data = await safeFetch(`${BASE_URL}/markets`, {
        method: "POST",
        body: JSON.stringify(body),
    });
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
    const body = {
        commodity_id,
        state_id,
        district_id: [district_id],
        market_id: [market_id],
        from_date,
        to_date,
        indicator: "price",
    };

    const data = await safeFetch(`${BASE_URL}/prices`, {
        method: "POST",
        body: JSON.stringify(body),
    });

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

