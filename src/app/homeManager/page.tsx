"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Menu } from "@/src/components/menu";
import { CuteButton } from "@/src/components/cuteButton";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ROUTES } from "@/src/constants/routes";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from "@mui/x-charts";
import api from "@/src/constants/api";


// --- INTERFACES PARA OS DADOS DO DASHBOARD ---

interface IPerformanceByCategory {
    category: string;
    score: number;
}

interface ICourseStatus {
    completed: number;
    inProgress: number;
    notStarted: number;
}

interface IDashboardData {
    username: string;
    totalEmployees: number;
    totalCourses: number;
    totalRegistrations: number;
    completionRate: number;
    performanceByCategory: IPerformanceByCategory[];
    courseStatus: ICourseStatus;
}


const HomeManager = () => {
    const router = useRouter();

    // --- ESTADOS PARA OS DADOS E UI ---
    const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- BUSCA OS DADOS QUANDO A PÁGINA CARREGA ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get('/manager/dashboard');
                setDashboardData(response.data);
            } catch (err) {
                console.error("Erro ao buscar dados do dashboard:", err);
                setError("Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // Array vazio para rodar apenas uma vez.

    // --- PREPARA OS DADOS PARA OS GRÁFICOS ---
    // Fazemos isso aqui para não poluir o JSX.
    const barChartData = {
        labels: dashboardData?.performanceByCategory.map(item => item.category) || [],
        values: dashboardData?.performanceByCategory.map(item => item.score) || [],
    };
    
    const pieChartData = dashboardData?.courseStatus ? [
        { id: 0, value: dashboardData.courseStatus.completed, label: 'Concluído' },
        { id: 1, value: dashboardData.courseStatus.inProgress, label: 'Em andamento' },
        { id: 2, value: dashboardData.courseStatus.notStarted, label: 'Não iniciado' },
    ] : [];


    if (isLoading) {
        return (
            <>
                <Menu />
                <div className="text-center p-20">Carregando dashboard...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Menu />
                <div className="text-center p-20 text-red-500">{error}</div>
            </>
        );
    }
    
    return (
        <>
            <Menu />
            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                {/* Title */}
                <div className="flex flex-col gap-1 items-center p-1 md:items-start">
                    <h1 className="md:text-2xl text-xl font-bold text-(--text)">Bem vindo(a), {dashboardData?.username}!</h1>
                    <p className="text-(--gray) text-sm md:text-lg text-center md:text-start">Acompanhe o progresso geral dos seus colaboradores!</p>
                </div>

                {/* Card progress */}
                <div className="flex bg-(--card) border border-(--stroke) flex-col p-5 rounded-2xl gap-4 shadow-(--shadow)">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-bold text-(--text)">Progresso Geral da Equipe</h1>
                        <CuteButton text="Ver time" icon={ArrowForwardIcon} onClick={() => router.push(ROUTES.collaborators)} />
                    </div>
                    <div className="flex justify-between gap-3 md:flex-row flex-col">
                        <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-(--gray)">Total de colaboradores</p>
                                <h1 className="font-bold text-(--text)">{dashboardData?.totalEmployees || 0}</h1>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-(--gray)">Total de cursos</p>
                                <h1 className="font-bold text-(--text)">{dashboardData?.totalCourses || 0}</h1>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-(--gray)">Total de Inscrições</p>
                                <h1 className="font-bold text-(--text)">{dashboardData?.totalRegistrations || 0}</h1>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-(--gray)">Taxa de Conclusão</p>
                                <h1 className="font-bold text-(--text)">{dashboardData?.completionRate || 0}%</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="flex flex-col gap-4">
                    <div className="flex sm:flex-row flex-col gap-2 justify-between items-center">
                        <h1 className="md:text-2xl text-xl font-bold text-(--text)">Desempenho em Cursos</h1>
                        <CuteButton text="Ver cursos" icon={ArrowForwardIcon} onClick={() => router.push(ROUTES.coursesManager)} />
                    </div>
                    <div className="grid grid-cols-1 place-items-center lg:grid-cols-2 lg:gap-6 gap-4">
                        <div className="flex gap-3 flex-col w-full h-full bg-(--card) min-h-96 border border-(--stroke) p-4 rounded-2xl shadow-(--shadow)">
                            <h1 className="text-xl font-bold text-(--text)">Desempenho por categoria</h1>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: barChartData.labels }]}
                                series={[{ data: barChartData.values, color: 'var(--aquamarine)' }]}
                                sx={{ width: "100%" }}
                                height={330}
                            />
                        </div>
                        <div className="flex gap-3 flex-col w-full h-full bg-(--card) min-h-96 border border-(--stroke) p-4 rounded-2xl shadow-(--shadow)">
                            <h1 className="text-xl font-bold text-(--text)">Status dos Cursos</h1>
                            <PieChart
                                series={[{ data: pieChartData }]}
                                height={330}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeManager;