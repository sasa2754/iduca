// Caminho: src/app/courses/[courseId]/quiz/[lessonId]/page.tsx

import { BackButton } from "@/src/components/backButton";
import { Menu } from "@/src/components/menu";
import { QuizClient } from "@/src/components/quizClient"; // Seu componente interativo
import { cookies } from 'next/headers';
import { ClientOnly } from "@/src/components/ClientOnly";
import jwt from 'jsonwebtoken';

type PageProps = {
    params: {
        courseId: string;
        lessonId: string;
    };
};

// Função para buscar os dados da API (a mesma que já usamos)
async function getQuizData(courseId: string, lessonId: string) {
    const tokenCookie = (await cookies()).get('auth_token');
    if (!tokenCookie) throw new Error("Usuário não autenticado");

    // Decodifica o token para pegar o ID do usuário
    const decodedToken = jwt.verify(tokenCookie.value, process.env.SECRET!) as { sub: string };
    const userId = decodedToken.sub;

    const headers = { 'Authorization': `Bearer ${tokenCookie.value}` };
    const baseUrl = process.env.BACKEND_API_URL;
    
    const apiUrl = `${baseUrl}/courses/${courseId}/lessons/${lessonId}`;
    const res = await fetch(apiUrl, { headers, cache: 'no-store' });

    if (!res.ok) {
        throw new Error(`Falha ao buscar dados do quiz: ${res.statusText}`);
    }

    return res.json();
}

const QuizPage = async ({ params }: PageProps) => {
    const { courseId, lessonId } = params;

    let quizData: any;
    try {
        quizData = await getQuizData(courseId, lessonId);
    } catch (error) {
        console.error("ERRO AO BUSCAR DADOS DO QUIZ:", error);
        return <div>Ocorreu um erro ao carregar o quiz.</div>;
    }

    if (!quizData || quizData.type !== 3) {
        return <div>Esta atividade não é um quiz válido.</div>;
    }

    return (
        <>
            <ClientOnly>
            <Menu />
            </ClientOnly>

            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                <div className="flex gap-8 items-center w-full p-1">
                    <BackButton />
                    <h1 className="md:text-2xl text-xl font-bold text-(--text)">{quizData.title}</h1>
                </div>

                {/* Passamos todos os dados necessários como props para o componente de cliente */}
                <QuizClient 
                    courseId={courseId}
                    activityId={lessonId}
                    initialQuizData={quizData} 
                />
            </div>
        </>
    )
}

export default QuizPage;