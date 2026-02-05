import "./css/Cell.css";

type Color = 0 | 1 | 2;

type Props = {
    letter: string;
    color: Color;
    onClick: () => void;
};

export function Cell({ color, letter, onClick }: Props) {

    function handleCellClick() {
        onClick();
    }

    return (
        <div className={`cell c${color}`} onClick={handleCellClick}>
            {letter}
        </div>
    );
}
