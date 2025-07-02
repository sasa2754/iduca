"use client";

import Image, { StaticImageData } from "next/image";
import StarRateIcon from '@mui/icons-material/StarRate';
import LinearProgress from "@mui/material/LinearProgress";
import Link from "next/link";

interface ICardCourse {
    image: string | StaticImageData;
    title: string;
    description: string;
    progress: number;
    rating: number;
    participants: number;
    difficulty: number;
    id: string;
}

export const CardCourse = ({ image, title, description, progress, rating, participants, id, difficulty } : ICardCourse) => {
    return (
        <Link href={`/courses/${id}`} className="flex items-center justify-center">
            <div className="bg-(--card)  border border-(--stroke) transition-all duration-300 ease-in-out transform hover:scale-[1.01] sm:w-full w-10/12 min-h-80 rounded-2xl shadow-(--shadow)">
            <div className="relative rounded-t-2xl overflow-hidden min-h-36 w-full">
                    <Image
                        className="object-cover w-full h-[166px]"
                        src={image}
                        alt={`${title}.png`}
                        width={500}
                        height={500}
                        priority
                    />
                    <span className={`absolute top-2 left-2 ${difficulty == 1 ? "bg-(--green)" : difficulty == 2 ? "bg-(--blue)" : "bg-(--purple)"} text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-lg`}>
                        {difficulty == 1 ? "Iniciante" : difficulty == 2 ? "Intermediário" : "Avançado"}
                    </span>
                </div>
                <div className="p-3 pb-6 flex flex-col gap-3 md:gap-4 ">
                    <div className="flex lg:flex-row flex-col justify-between">
                        <h1 className="font-bold text-(--text)">{title}</h1>
                    </div>
                    <p className="overflow-hidden text-ellipsis line-clamp-2 text-(--text)">{description}</p>
                    <div className="">
                        <div className="flex w-full justify-between">
                            <h2 className="text-(--gray)">Progresso</h2>
                            <h2 className="text-(--gray)">{progress.toString()}%</h2>
                        </div>
                        <LinearProgress variant="determinate" value={progress} />
                    </div>
                </div>
            </div>
        </Link>
    )
}