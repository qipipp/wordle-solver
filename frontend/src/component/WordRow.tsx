import { useState } from "react";
import { Cell } from "./Cell";
import "./css/WordRow.css";
import "./css/Common.css";

type Color = 0 | 1 | 2;

type Props = {
    letters: string; //5글자
    onUpdate: (value: number) => void;
    onDelete: () => void;
};

const pow3 = [1, 3, 9, 27, 81];

export function WordRow({ letters, onUpdate, onDelete }: Props) {
    const [colors, setColors] = useState<Color[]>([0, 0, 0, 0, 0]);

    function cellClick(idx: number) {
        const next = [...colors]; 
        next[idx] = ((next[idx] + 1) % 3) as Color;

        setColors(next);

        const value = next.reduce<number>((acc, c, i) => acc + c * pow3[i], 0);
        onUpdate(value);
    }

    const safeLetters = Array.from({ length: 5 }).map(
        (_, i) => letters[i] ?? ""
    );

    return (
        <div className="row">
            
            <div className="cells">
                {safeLetters.map((ch, i) => (
                    <Cell key={i} letter={ch} color={colors[i]} onClick={() => cellClick(i)} />
                ))}
            </div>

            <button className="delBtn" onClick={onDelete}>✕</button>
        </div>
    );
};
