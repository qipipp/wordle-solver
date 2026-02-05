import "./App.css";
import { WordBoard, type WordBoardHandle } from "./component/WordBoard";
import { CandidateBoard } from "./component/CandidateBoard";
import { useState, useEffect, useRef } from "react";
import { getCandidate, getRecommendation, type Pair } from "./api";

export default function App() {
    
    const [pairs, setPairs] = useState<Pair[]>([]);
    const [candWords, setCandWords] = useState<string[]>([]);
    const [start, setStart] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [recoWords, setRecoWords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function runSearch(newPairs: Pair[]) {
        setIsLoading(true);
        setPairs(newPairs);
        setCandWords([]);
        setStart(0);
        try {
            const r = await getCandidate({ pairs: newPairs, start: 0 });
            setCandWords(r.candidates);
            setStart(r.nxt_start);
            setHasMore(r.has_more);
            setRecoWords([]);

            const recoRes = await getRecommendation({ pairs: newPairs, start: 0 });
            setRecoWords(recoRes.recommendation);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    async function onMore() {
        if (!hasMore) return;
        const r = await getCandidate({ pairs, start });
        setCandWords((prev) => [...prev, ...r.candidates]);
        setStart(r.nxt_start);
        setHasMore(r.has_more);
    }

    const wordBoardRef = useRef<WordBoardHandle>(null);
    function handleWordClick(word: string) {
        wordBoardRef.current?.addWord(word);
    }

    useEffect(() => {
        const fetchData = async () => {
            await runSearch([]);
        };
        fetchData();
    }, []);

    return (
        <div className="layout">
            <div className="left">
                <h3 className="boardTitle">Guessed Word</h3>
                <WordBoard ref={wordBoardRef} onSearch={runSearch} />
            </div>

            <div className="right">
                <h3 className="boardTitle">Candidate Word</h3>
                <CandidateBoard words={candWords} hasMore={hasMore} onMore={onMore} onWordClick={handleWordClick} isLoading={isLoading} />
                <h3 className="boardTitle">Recommended Word</h3>
                <CandidateBoard words={recoWords} hasMore={false} onWordClick={handleWordClick} isLoading={isLoading} />
            </div>
        </div>
    );
}
