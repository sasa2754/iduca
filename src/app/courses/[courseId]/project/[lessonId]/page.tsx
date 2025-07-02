
import { BackButton } from "@/src/components/backButton";
import { Menu } from "@/src/components/menu";
import { PdfUploader } from "@/src/components/pdfUploarder";
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
    if (!tokenCookie) throw new Error("Usuário não autenticado");

    const headers = { 'Authorization': `Bearer ${tokenCookie.value}` };
    const baseUrl = process.env.BACKEND_API_URL;
    
    const apiUrl = `${baseUrl}/courses/${courseId}/lessons/${lessonId}`;
    const res = await fetch(apiUrl, { headers, cache: 'no-store' });

    if (!res.ok) {
        throw new Error(`Falha ao buscar dados da atividade: ${res.statusText}`);
    }

    return res.json();
}


const ProjectPage = async ({ params }: PageProps) => {
    const { courseId, lessonId } = params;

    let activityData: any;
    try {
        activityData = await getLessonData(courseId, lessonId);
    } catch (error) {
        console.error("ERRO AO BUSCAR DADOS DA ATIVIDADE:", error);
        return <div>Ocorreu um erro ao carregar a atividade.</div>;
    }

    if (!activityData) {
        return <div>Atividade não encontrada.</div>;
    }

    return (
        <>
            <ClientOnly>
            <Menu />
            </ClientOnly>

            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                {/* Title - Usando dados da API */}
                <div className="flex gap-8 items-center w-full p-1">
                    <BackButton />
                    <h1 className="md:text-2xl text-xl font-bold text-(--text)">{activityData.title}</h1>
                </div>

                <div className="flex w-full flex-col gap-5">
                    {/* Descrição da atividade vinda da API */}
                    <p className="text-(--text) self-center text-justify">{activityData.description}</p>
                    
                    <h1 className="text-xl font-bold text-(--text) self-center mt-8">Envie seu PDF</h1>
                    
                    {/* 3. Passando os IDs para o seu Client Component.
                      O componente <PdfUploader> agora sabe exatamente para qual curso e 
                      atividade o upload deve ser enviado.
                    */}
                    <div className="self-center w-full max-w-lg">
                        <PdfUploader 
                            courseId={courseId} 
                            activityId={lessonId} 
                        />
                    </div>
                </div>
            </div>

            <LessonCompleter courseId={courseId} lessonId={lessonId} />
        </>
    )
}

export default ProjectPage;