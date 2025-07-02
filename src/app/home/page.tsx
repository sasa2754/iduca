"use client";

import { useEffect, useState } from "react";
import { Menu } from "@/src/components/menu";
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import LinearProgress from "@mui/material/LinearProgress";
import { CuteButton } from "@/src/components/cuteButton";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/src/constants/routes";
import { CardCourse } from "@/src/components/cardCourse";
import { CalendarComp } from "@/src/components/calendar";
import api from "@/src/constants/api";

interface IProgressData {
    username: string;
    totalCourses: number;
    ongoingCourses: number;
    completeCourses: number;
    percenteGeneral: number;
}

interface ICourseInProgress {
    id: string;
    title: string;
    image: string;
    progress: number;
    description: string;
    rating: number;
    participants: number;
    difficulty: number;
    category: string;
}

interface ICalendarEvent {
    title: string;
    date: Date;
    type: number;
}

const Home = () => {
    const router = useRouter();

    const [progressData, setProgressData] = useState<IProgressData | null>(null);
    const [inProgressCourses, setInProgressCourses] = useState<ICourseInProgress[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<ICalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [progressRes, coursesRes, calendarRes] = await Promise.allSettled([
                    api.get('/home/progress'),
                    api.get('/home/coursesInProgress'),
                    api.get('/calendar/next')
                ]);

                if (progressRes.status === 'fulfilled') {
                    setProgressData(progressRes.value.data);
                }
                if (coursesRes.status === 'fulfilled') {
                    setInProgressCourses(coursesRes.value.data);
                }
                if (calendarRes.status === 'fulfilled') {
                    const formattedEvents = calendarRes.value.data.map((event: any) => ({
                        title: event.description,
                        date: new Date(event.date),
                        type: event.type
                    }));
                    setCalendarEvents(formattedEvents);
                }

            } catch (error) {
                console.error("Erro ao buscar dados da home:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <>
            <Menu />
                <div className="text-center p-10">Carregando dados da Home...</div>
            </>
        )
    }

    return (
        <>
            <Menu/>
            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                {/* Title */}
                <div className="flex flex-col gap-1 items-center p-1 md:items-start">
                    <h1 className="md:text-2xl text-xl font-bold text-(--text)">Bem vindo(a), {progressData?.username}!</h1>
                    <p className="text-(--gray) text-sm md:text-lg text-center md:text-start">Acompanhe seu progresso e próximos eventos!</p>
                </div>

                {/* Card progress */}
                <div className="flex bg-(--card) border border-(--stroke) flex-col p-5 rounded-2xl gap-4 shadow-(--shadow)">
                    <h1 className="text-xl font-bold text-(--text)">Seu Progresso</h1>
                    <div className="flex flex-col gap-2">
                        <div className="flex w-full justify-between">
                            <h2 className="text-(--text)">Progresso geral</h2>
                            <h2 className="text-(--text)">{progressData?.percenteGeneral || 0}%</h2>
                        </div>
                        <LinearProgress variant="determinate" value={progressData?.percenteGeneral || 0} />
                    </div>
                    <div className="flex justify-between gap-3 md:flex-row flex-col">
                        {/* Card Total de Cursos */}
                        <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
                            <div className="flex items-center justify-center p-1 bg-(--blueOpacity) rounded-full">
                                <ClassOutlinedIcon sx={{ color: "var(--blue)" }}/>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <h1 className="font-bold text-(--text)">{progressData?.totalCourses|| 0}</h1>
                                <p className="text-(--gray)">Total de cursos</p>
                            </div>
                        </div>
                         {/* Card Cursos em Andamento */}
                        <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
                            <div className="flex items-center justify-center p-1 bg-(--yellowOpacity) rounded-full">
                                <ClassOutlinedIcon sx={{ color: "var(--yellow)" }}/>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <h1 className="font-bold text-(--text)">{progressData?.ongoingCourses || 0}</h1>
                                <p className="text-(--gray)">Em andamento</p>
                            </div>
                        </div>
                        {/* Card Cursos Completos */}
                        <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
                            <div className="flex items-center justify-center p-1 bg-(--greenOpacity) rounded-full">
                                <CheckCircleOutlineOutlinedIcon sx={{ color: "var(--green)" }}/>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <h1 className="font-bold text-(--text)">{1}</h1>
                                <p className="text-(--gray)">Completos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Cursos em Andamento */}
                <div className="flex flex-col gap-4">
                    <div className="flex sm:flex-row flex-col gap-2 justify-between items-center">
                        <h1 className="md:text-2xl text-xl font-bold text-(--text)">Cursos em andamento</h1>
                        <CuteButton text="Ver todos" icon={ArrowForwardIcon} onClick={() => router.push(ROUTES.courses)}></CuteButton>
                    </div>
                    <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-4">
                        {inProgressCourses.map(course => (
                            <CardCourse
                                key={course.id}
                                id={course.id} 
                                image={course.image} 
                                title={course.title} 
                                description={course.description} 
                                progress={course.progress} 
                                rating={course.rating} 
                                participants={course.participants} 
                                difficulty={course.difficulty}
                            />
                        ))}
                    </div>
                </div>

                {/* Calendário */}
                <div className="flex flex-col gap-4 mb-10">
                    <div className="flex sm:flex-row flex-col gap-2 justify-between items-center">
                        <h1 className="md:text-2xl text-xl font-bold text-(--text)">Calendário de aulas</h1>
                        <CuteButton text="Ver todos" icon={ArrowForwardIcon} onClick={() => router.push(ROUTES.calendar)}></CuteButton>
                    </div>
                    <CalendarComp events={calendarEvents}/>
                </div>
            </div>
        </>
    )
}

export default Home;