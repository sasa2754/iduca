import { BackButton } from "@/src/components/backButton";
import { Menu } from "@/src/components/menu";
import { QuizClient } from "@/src/components/quizClient";
import { cookies } from 'next/headers';
import { ClientOnly } from "@/src/components/ClientOnly";
import jwt from 'jsonwebtoken';

type PageProps = {
    params: {
        courseId: string;
        lessonId: string;
    };
};

// A função de busca de dados é a mesma, pois nosso endpoint é genérico
async function getLessonData(courseId: string, lessonId: string) {
    const tokenCookie = (await cookies()).get('auth_token');
    if (!tokenCookie) throw new Error("Usuário não autenticado");

    const headers = { 'Authorization': `Bearer ${tokenCookie.value}` };
    const baseUrl = process.env.BACKEND_API_URL;
    
    const apiUrl = `${baseUrl}/courses/${courseId}/lessons/${lessonId}`;
    const res = await fetch(apiUrl, { headers, cache: 'no-store' });

    if (!res.ok) throw new Error(`Falha ao buscar dados do quiz`);
    
    return res.json();
}

const QuizPage = async ({ params }: PageProps) => {
    const { courseId, lessonId } = params;

    let quizData: any;
    try {
        quizData = await getLessonData(courseId, lessonId);
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