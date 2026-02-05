export type Pair = { word: string; result: number };

const BASE_URL = "https://wordle-solver-7w9k.onrender.com";

export type GetCandidateReq = {
    pairs: Pair[];
    start: number;
};

export type GetCandidateRes = {
    candidates: string[];
    nxt_start: number;
    has_more: boolean;
};

export async function getCandidate(req: GetCandidateReq): Promise<GetCandidateRes> {
    const res = await fetch(`${BASE_URL}/api/get_candidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`get_candidate failed: ${res.status}`);
    return res.json();
}

export type GetRecommendationReq = {
    pairs: Pair[];
    start: number; 
};

export type GetRecommendationRes = {
    recommendation: string[];
};

export async function getRecommendation(
    req: GetRecommendationReq
): Promise<GetRecommendationRes> {
    const res = await fetch(`${BASE_URL}/api/get_recommendation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`get_recommendation failed: ${res.status}`);
    return res.json();
}