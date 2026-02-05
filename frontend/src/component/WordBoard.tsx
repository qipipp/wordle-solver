import { WordRow } from "./WordRow";
import { useState, forwardRef, useImperativeHandle } from "react";
import "./css/WordBoard.css";

export type WordBoardHandle = {
    addWord: (word: string) => void;
};

type Props = {
    onSearch?: (pairs: { word: string; result: number }[]) => void;
};
export const WordBoard = forwardRef<WordBoardHandle, Props>(({ onSearch }, ref) => {
    const [rows, setRows] = useState<{ id: number; val: number }[]>([]);
    const [rowLetters, setRowLetters] = useState<string[]>([]);
    const [input, setInput] = useState("");

    const maxRows = 6;

    const normalized = input.trim().toUpperCase();
    function rowUpdate(idx: number, value: number) {
        setRows((prev) => {
            const next = [...prev];
            next[idx].val = value;
            return next;
        });
    }

    function addRow(optWord?: string) {
        const targetWord = optWord ? optWord.toUpperCase() : normalized;

        if (!/^[A-Z]{5}$/.test(targetWord)) {
            alert("Input is not valid.");
            return;
        }
        if (rows.length >= maxRows) {
            alert("six word is max");
            return;
        }

        setRows((prev) => {
            const maxId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) : -1;
            const newId = maxId + 1;
            return [...prev, { id: newId, val: 0 }];
        });
        setRowLetters((prev) => [...prev, targetWord]);
        if (!optWord) { setInput(""); }
    }

    useImperativeHandle(ref, () => ({
        addWord: (word: string) => {
            addRow(word);
        }
    }));

    function removeRow(idx: number) {
        setRows((prev) => prev.filter((_, i) => i !== idx));
        setRowLetters((prev) => prev.filter((_, i) => i !== idx));
    }
    function onClickSearch() {
        if (!onSearch) return;
        const pairs = rows.map((r, i) => ({
            word: rowLetters[i].toLowerCase(),
            result: r.val,
        }));

        onSearch(pairs);
    }

    return (
        <div>
            <div className="wordListArea">
                {rows.map((row, i) => (
                    <WordRow
                        key={row.id}
                        letters={rowLetters[i]}
                        onUpdate={(value) => rowUpdate(i, value)}
                        onDelete={() => removeRow(i)}
                    />
                ))}
            </div>
            <div className="inputArea">
                <div>
                    <input
                        value={input}
                        onChange={(e) => {
                            const v = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z]/g, "");
                            setInput(v);
                        }}
                        placeholder="5-letter word"
                        maxLength={5}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") addRow();
                        }}
                    />
                    <button onClick={() => addRow()}>Add</button>
                </div>
                <button onClick={onClickSearch}>Search</button>
            </div>
        </div>
    );
});