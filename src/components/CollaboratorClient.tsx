"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LinearProgress } from "@mui/material";
import { 
    CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
    ClassOutlined as ClassOutlinedIcon
} from '@mui/icons-material';
import { CuteButton } from "@/src/components/cuteButton";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ROUTES } from "@/src/constants/routes";
import { CardCourse } from "@/src/components/cardCourse";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from "@mui/x-charts";

// Interfaces para os dados
interface Competency {
  category: string;
  competenceLevel: number;
}
interface Course {
  id: string;
  image: string;
  title: string;
  category: string;
  difficulty: number;
  score?: number;
  progress?: number;
}
interface CollaboratorData {
  employeeId: number;
  name: string;
  email: string;
  competencies: Competency[];
  courses: {
    completed: Course[];
    inProgress: Course[];
    notStarted: Course[];
  };
  averageScore: number;
  totalCourses: number;
  coursesCompleted: number;
}

interface CollaboratorClientProps {
  initialData: CollaboratorData;
}

export const CollaboratorClient = ({ initialData }: CollaboratorClientProps) => {
  const router = useRouter();

  const competencyData = useMemo(() => {
    if (!initialData) return { labels: [], values: [] };
    return {
        labels: initialData.competencies.map(item => item.category),
        values: initialData.competencies.map(item => item.competenceLevel)
    };
  }, [initialData]);

  const courseStatusData = useMemo(() => {
    if (!initialData) return [];
    return [
      { id: 0, label: "Concluídos", value: initialData.courses.completed.length, color: 'var(--green)' },
      { id: 1, label: "Em andamento", value: initialData.courses.inProgress.length, color: 'var(--yellow)' },
      { id: 2, label: "Não iniciados", value: initialData.courses.notStarted.length, color: 'var(--lightGray)' },
    ];
  }, [initialData]);

  return (
    <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 items-center p-1 md:items-start">
        <h1 className="md:text-2xl text-xl font-bold text-(--text)">{initialData.name}</h1>
        <p className="text-(--gray) text-sm md:text-lg text-center md:text-start">
          Detalhes do desempenho e progresso
        </p>
      </div>

      {/* Info Cards */}
      <div className="flex bg-(--card) border border-(--stroke) flex-col p-5 rounded-2xl gap-4 shadow-(--shadow)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
            <div className="flex flex-col gap-0.5">
              <p className="text-(--gray)">ID do Funcionário</p>
              <h1 className="font-bold text-(--text)">{initialData.employeeId}</h1>
            </div>
          </div>
          <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
            <div className="flex flex-col gap-0.5">
              <p className="text-(--gray)">Email</p>
              <h1 className="font-bold text-(--text)">{initialData.email}</h1>
            </div>
          </div>
          <div className="flex gap-4 items-center bg-(--lightGray) rounded w-full px-3 py-1.5 border border-(--stroke)">
            <div className="flex flex-col gap-0.5">
              <p className="text-(--gray)">Score Médio</p>
              <h1 className="font-bold text-(--text)">{initialData.averageScore.toFixed(1)}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Competencies Section */}
      <div className="flex flex-col gap-4">
        <h1 className="md:text-2xl text-xl font-bold text-(--text)">Competências</h1>
        <div className="flex gap-3 flex-col w-full bg-(--card) border border-(--stroke) p-4 rounded-2xl shadow-(--shadow)">
          <BarChart
            xAxis={[{ data: competencyData.labels, scaleType: 'band' }]}
            series={[{ data: competencyData.values, color: 'var(--aquamarine)' }]}
            height={300}
          />
        </div>
      </div>

      {/* Courses Section */}
      <div className="flex flex-col gap-4">
        <h1 className="md:text-2xl text-xl font-bold text-(--text)">Cursos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3 flex-col w-full bg-(--card) border border-(--stroke) p-4 rounded-2xl shadow-(--shadow)">
            <h2 className="text-lg font-bold text-(--text)">Status dos Cursos</h2>
            <PieChart series={[{ data: courseStatusData, innerRadius: 80 }]} height={300} />
          </div>
          <div className="flex gap-3 flex-col w-full bg-(--card) border border-(--stroke) p-4 rounded-2xl shadow-(--shadow)">
            <h2 className="text-lg font-bold text-(--text)">Progresso nos Cursos</h2>
            {initialData.courses.inProgress.map((course, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-(--text)">{course.title}</span>
                  <span className="text-(--text)">{course.progress}%</span>
                </div>
                <LinearProgress 
                  variant="determinate" 
                  value={course.progress} 
                  sx={{ height: 10, borderRadius: 5, backgroundColor: 'var(--lightGray)', '& .MuiLinearProgress-bar': { backgroundColor: 'var(--aquamarine)' } }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Lists */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex sm:flex-row flex-col gap-2 justify-between items-center">
            <h1 className="md:text-2xl text-xl font-bold text-(--text) flex items-center gap-2"><CheckCircleOutlineOutlinedIcon /> Cursos Concluídos</h1>
            {initialData.courses.completed.length > 0 && (<CuteButton text="Ver todos" icon={ArrowForwardIcon} onClick={() => router.push(ROUTES.coursesManager)} />)}
          </div>
          <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-4">
            {initialData.courses.completed.length > 0 ? (
              initialData.courses.completed.map(course => (
                <CardCourse key={course.id} id={course.id} image={course.image} title={course.title} description={`Nota: ${course.score} | ${course.category}`} progress={100} rating={0} participants={0} difficulty={course.difficulty} />
              ))
            ) : (<p className="text-(--gray) col-span-full">Nenhum curso concluído</p>)}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex sm:flex-row flex-col gap-2 justify-between items-center">
            <h1 className="md:text-2xl text-xl font-bold text-(--text) flex items-center gap-2"><ClassOutlinedIcon /> Cursos em Andamento</h1>
            {initialData.courses.inProgress.length > 0 && (<CuteButton text="Ver todos" icon={ArrowForwardIcon} onClick={() => router.push(ROUTES.coursesManager)} />)}
          </div>
          <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-4">
            {initialData.courses.inProgress.length > 0 ? (
              initialData.courses.inProgress.map(course => (
                <CardCourse key={course.id} id={course.id} image={course.image} title={course.title} description={course.category} progress={course.progress || 0} rating={0} participants={0} difficulty={course.difficulty} />
              ))
            ) : (<p className="text-(--gray) col-span-full">Nenhum curso em andamento</p>)}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex sm:flex-row flex-col gap-2 justify-between items-center">
            <h1 className="md:text-2xl text-xl font-bold text-(--text) flex items-center gap-2"><ClassOutlinedIcon /> Cursos Não Iniciados</h1>
            {initialData.courses.notStarted.length > 0 && (<CuteButton text="Ver todos" icon={ArrowForwardIcon} onClick={() => router.push(ROUTES.coursesManager)} />)}
          </div>
          <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-4">
            {initialData.courses.notStarted.length > 0 ? (
              initialData.courses.notStarted.map(course => (
                <CardCourse key={course.id} id={course.id} image={course.image} title={course.title} description={course.category} progress={0} rating={0} participants={0} difficulty={course.difficulty} />
              ))
            ) : (<p className="text-(--gray) col-span-full">Nenhum curso não iniciado</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};