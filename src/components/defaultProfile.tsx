"use client";

import { useEffect, useState } from "react";

interface IDefaultProfile {
    onClick?: () => void;
    firstLetter: string;
    lastLetter: string;
}

export const DefaultProfile = ({ onClick, firstLetter, lastLetter } : IDefaultProfile) => {
    const [color, setColor] = useState("");

    const defaultColors: string[] = [
        '#FF8C66', // Vermelho claro
        '#66FF99', // Verde claro
        '#6699FF', // Azul claro
        '#FFEB3B', // Amarelo claro
        '#9B59B6', // Roxo claro
        '#F1948A', // Vermelho claro suave
        '#A9DFBF', // Verde claro suave
        '#85C1AE', // Azul claro suave
        '#D2B4DE', // Roxo pastel
        '#F5B041', // Laranja claro
        '#F39C12', // Laranja suave
        '#7D8B8C', // Verde água suave
    ];
     
    // Função para sortear uma cor aleatória
    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * defaultColors.length);
        setColor(defaultColors[randomIndex]);
    }

    useEffect(() => {
        getRandomColor();
    }, []);

    return (
        <button onClick={onClick} className="md:flex hidden p-1 rounded-full w-9 h-9 items-center justify-center cursor-pointer" style={{ backgroundColor: color }}>
            <h1 className="text-white dark:text-black">{firstLetter}</h1>
            <h1 className="text-white dark:text-black">{lastLetter}</h1>
        </button>
      );
}

