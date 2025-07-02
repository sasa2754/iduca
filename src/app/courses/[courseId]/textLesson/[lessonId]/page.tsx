import { Menu } from "@/src/components/menu";
import { BackButton } from "@/src/components/backButton";
import React from "react";
import Image from "next/image";
import { NextLessonButton } from "@/src/components/nextLessonButton";
import { cookies } from 'next/headers';
import { ClientOnly } from "@/src/components/ClientOnly";
import { LessonCompleter } from "@/src/components/LessonCompleter";

type PageProps = {
    params: {
        courseId: string;
        lessonId: string;
    };
};

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

const TextLessonPage = async ({ params }: PageProps) => {
    const { courseId, lessonId } = params;

    let lessonData: any;
    try {
        lessonData = await getLessonData(courseId, lessonId);
    } catch (error) {
        console.error("ERRO AO BUSCAR DADOS DA AULA:", error);
        return <div>Ocorreu um erro ao carregar a aula.</div>;
    }

    if (!lessonData) {
        return <div>Aula não encontrada.</div>;
    }

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

                {/* Details - Renderizando o conteúdo dinâmico */}
                <div className="flex flex-col md:p-10 p-3 bg-(--card) shadow-(--shadow) rounded-2xl gap-10">
                    {lessonData.content.map((contentBlock: any, index: number) => (
                        <React.Fragment key={index}>
                            {contentBlock.type === 1 ?
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-(--text) text-xl font-bold">{contentBlock.title}</h1>
                                    <p className="text-(--text)">{contentBlock.value}</p>
                                </div>
                                :
                                <Image className="self-center md:max-w-10/12 rounded-xl" src={contentBlock.value} alt={contentBlock.title || 'Imagem da aula'} width={800} height={450} priority />
                            }
                        </React.Fragment>
                    ))}
                    
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

export default TextLessonPage;