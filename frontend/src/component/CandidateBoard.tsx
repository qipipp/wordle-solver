import "./css/CandidateBoard.css";
import "./css/Common.css";

type Props = {
    words: string[];
    hasMore: boolean;
    onMore?: () => void;
    onWordClick?: (word: string) => void;
    isLoading?: boolean;
};
export function CandidateBoard({ words, hasMore, onMore, onWordClick, isLoading }: Props) {
    return (
        <div className="candScroll">
            {isLoading ? (
                <div className="noResult">Loading...</div>
            ) : words.length === 0 ? (
                <div className="noResult">No Results</div>
            ) : (
                <>
                    <div className="candGrid">
                        {words.map((w, i) => (
                            <div
                                key={`${w}-${i}`}
                                onClick={() => onWordClick && onWordClick(w)}
                                style={{ cursor: "pointer" }}
                            >
                                {w}
                            </div>
                        ))}
                    </div>
                    {hasMore && <button onClick={onMore}>More</button>}
                </>
            )}
        </div>
    );
}