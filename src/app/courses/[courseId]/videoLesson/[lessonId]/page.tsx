
import { BackButton } from "@/src/components/backButton";
import { Menu } from "@/src/components/menu";
import { NextLessonButton } from "@/src/components/nextLessonButton";
import { cookies } from 'next/headers';
import { ClientOnly } from "@/src/components/ClientOnly";
import { LessonCompleter } from "@/src/components/LessonCompleter";

// 1. Interface para os parâmetros da URL
type PageProps = {
    params: {
        courseId: string;
        lessonId: string;
    };
};

// 2. Função para buscar os dados da nossa API no servidor
async function getLessonData(courseId: string, lessonId: string) {
    const tokenCookie = (await cookies()).get('auth_token');
    if (!tokenCookie) {
        throw new Error("Usuário não autenticado");
    }

    const headers = { 'Authorization': `Bearer ${tokenCookie.value}` };
    const baseUrl = process.env.BACKEND_API_URL;
    
    const apiUrl = `${baseUrl}/courses/${courseId}/lessons/${lessonId}`;
    const res = await fetch(apiUrl, { headers, cache: 'no-store' });

    if (!res.ok) {
        throw new Error(`Falha ao buscar dados da aula: ${res.statusText}`);
    }

    return res.json();
}

// 3. O componente da página agora é 'async'
const VideoLessonPage = async ({ params }: PageProps) => {
    const { courseId, lessonId } = params;

    let lessonData: any;
    try {
        lessonData = await getLessonData(courseId, lessonId);
    } catch (error) {
        console.error("ERRO AO BUSCAR DADOS DA AULA:", error);
        return <div>Ocorreu um erro ao carregar o vídeo.</div>;
    }

    if (!lessonData) {
        return <div>Aula não encontrada.</div>;
    }

    // 4. Função auxiliar para criar o link da próxima aula dinamicamente
    const createNextLessonLink = (nextLesson: any) => {
        if (!nextLesson) {
            // Se não houver próxima aula, podemos levar de volta para a página do curso
            return `/courses/${courseId}`;
        }
        
        const typeMap: { [key: number]: string } = {
            1: 'textLesson',
            2: 'videoLesson',
            3: 'quiz',
            4: 'project'
        };
        const path = typeMap[nextLesson.type] || 'lesson';
        return `/courses/${courseId}/${path}/${nextLesson.id}`;
    };

    // Pega o link do vídeo do primeiro item do array de conteúdo
    const videoUrl = lessonData.content?.[0]?.value || "";

    return (
        <>
            <ClientOnly>
            <Menu />
            </ClientOnly>
            
            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                {/* Title - Usando dados da API */}
                <div className="flex gap-8 items-center w-full p-1">
                    <BackButton />
                    <h1 className="md:text-2xl text-xl font-bold text-(--text)">{lessonData.title}</h1>
                </div>

                {/* Details - Renderizando o vídeo dinâmico */}
                <div className="flex flex-col md:p-10 p-3 bg-(--card) shadow-(--shadow) rounded-2xl gap-10 items-center">
                    <div className="relative w-full pb-[56.25%]">
                        <iframe
                            src={videoUrl}
                            title="YouTube video player"
                            className="absolute top-0 left-0 w-full h-full rounded-xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                    
                    <div className="self-center">
                        {/* Renderiza o botão apenas se houver uma próxima aula */}
                        {lessonData.nextLesson && (
                            <NextLessonButton href={createNextLessonLink(lessonData.nextLesson)} />
                        )}
                    </div>
                </div>
            </div>

            <LessonCompleter courseId={courseId} lessonId={lessonId} />
        </>
    )
}

export default VideoLessonPage;