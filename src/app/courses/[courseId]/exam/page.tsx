import { BackButton } from "@/src/components/backButton";
import { Menu } from "@/src/components/menu";
import { QuizClient } from "@/src/components/quizClient";
import { cookies } from 'next/headers';
import { ClientOnly } from "@/src/components/ClientOnly";
import jwt from 'jsonwebtoken';

type PageProps = {
    params: {
        courseId: string;
    };
};

// Esta função busca os dados da PROVA, não de uma lição
async function getExamData(courseId: string) {
    const tokenCookie = (await cookies()).get('auth_token');
    if (!tokenCookie) throw new Error("Usuário não autenticado");

    const headers = { 'Authorization': `Bearer ${tokenCookie.value}` };
    const baseUrl = process.env.BACKEND_API_URL;
    
    // Chamando o endpoint correto que busca a prova final de um curso
    const apiUrl = `${baseUrl}/test/${courseId}`;
    const res = await fetch(apiUrl, { headers, cache: 'no-store' });

    if (!res.ok) {
        throw new Error(`Falha ao buscar dados da prova`);
    }

    return res.json();
}

const ExamPage = async ({ params }: PageProps) => {
    const { courseId } = params;

    let examData: any;
    try {
        examData = await getExamData(courseId);
    } catch (error) {
        console.error("ERRO AO BUSCAR DADOS DA PROVA:", error);
        return <div>Ocorreu um erro ao carregar a prova.</div>;
    }

    if (!examData) {
        return <div>Prova não encontrada para este curso.</div>;
    }

    return (
        <>
            <ClientOnly>
            <Menu />
            </ClientOnly>

            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                <div className="flex gap-8 items-center w-full p-1">
                    <BackButton />
                    <h1 className="md:text-2xl text-xl font-bold text-(--text)">{examData.title}</h1>
                </div>

                <QuizClient 
                    courseId={courseId}
                    activityId={examData.id}
                    initialQuizData={examData} 
                    isExam
                />
            </div>
        </>
    )
}

export default ExamPage;