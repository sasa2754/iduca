import { Menu } from "@/src/components/menu";
import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, LinearProgress } from "@mui/material";
import {
    AccessTimeOutlined as AccessTimeOutlinedIcon,
    PeopleAltOutlined as PeopleAltOutlinedIcon,
    StarOutlined as StarOutlinedIcon,
    ExpandMore as ExpandMoreIcon,
    FeedOutlined as FeedOutlinedIcon,
    FilePresentOutlined as FilePresentOutlinedIcon,
    VideocamOutlined as VideocamOutlinedIcon,
    ContentPasteOutlined as ContentPasteOutlinedIcon,
    CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
} from '@mui/icons-material';
import { cookies } from 'next/headers';
import { ClientOnly } from "@/src/components/ClientOnly";
import jwt from 'jsonwebtoken';
import { BackButton } from "@/src/components/backButton";
import { DeleteCourseButton } from "@/src/components/DeleteCourseButton";

type PageProps = {
    params: {
        courseId: string;
    };
};

// Interface para os dados do token
interface IDecodedToken {
    sub: string;
    role: 'admin' | 'manager' | 'employee';
}

// Função para buscar TODOS os dados da página
async function getPageData(courseId: string) {
    const tokenCookie = (await cookies()).get('auth_token');
    if (!tokenCookie) throw new Error("Usuário não autenticado");

    const decodedToken = jwt.verify(tokenCookie.value, process.env.SECRET!) as IDecodedToken;
    
    const headers = { 'Authorization': `Bearer ${tokenCookie.value}` };
    const baseUrl = process.env.BACKEND_API_URL;

    const [courseRes, examRes] = await Promise.all([
        fetch(`${baseUrl}/courses/${courseId}`, { headers, cache: 'no-store' }),
        fetch(`${baseUrl}/test/${courseId}`, { headers, cache: 'no-store' })
    ]);

    if (!courseRes.ok) throw new Error(`Falha ao buscar dados do curso`);
    
    const courseData = await courseRes.json();
    const examData = examRes.ok ? await examRes.json() : null;

    // Retornamos a role do usuário junto
    return { courseData, examData, userRole: decodedToken.role };
}

const SelectCoursePage = async ({ params }: PageProps) => {
    const { courseId } = params;
    
    const { courseData, examData, userRole } = await getPageData(courseId).catch(err => {
        console.error("ERRO AO BUSCAR DADOS DA PÁGINA:", err);
        return { courseData: null, examData: null, userRole: null };
    });

    if (!courseData) {
        return <div>Ocorreu um erro ao carregar o curso.</div>;
    }

    const getIconForType = (type: number) => {
        if (type === 1) return <FeedOutlinedIcon sx={{ color: "var(--blue)"}}/>;
        if (type === 2) return <VideocamOutlinedIcon sx={{ color: "var(--red)"}}/>;
        if (type === 3) return <ContentPasteOutlinedIcon sx={{ color: "var(--yellow)"}}/>;
        if (type === 4) return <FilePresentOutlinedIcon sx={{ color: "var(--green)"}}/>;
        return null;
    };

    const getLinkForContent = (content: any) => {
        if (!content || !content.id) return `/courses/${courseId}`;
        
        let pathSegment = '';
        if (content.type === 3) {
            pathSegment = content.completed ? 'quizCompleted' : 'quiz';
        } else {
            const typeMap: { [key: number]: string } = { 1: 'textLesson', 2: 'videoLesson', 4: 'project' };
            pathSegment = typeMap[content.type] || 'lesson';
        }
        return `/courses/${courseId}/${pathSegment}/${content.id}`;
    };

    const firstUncompletedLesson = courseData.modules.flatMap((m: any) => m.content).find((c: any) => !c.completed);
    const continueLink = getLinkForContent(firstUncompletedLesson || courseData.modules[0]?.content[0]);
    
    const isExamCompleted = examData?.completed || false;
    const examLink = isExamCompleted ? `/quizCompleted/${examData.id}?courseId=${courseId}` : `/exam/${courseId}`;
    
    return (
        <>
            <ClientOnly>
                <Menu />
            </ClientOnly>

            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                {/* Title e Botão de Ação do Admin */}
                <div className="flex flex-row justify-between items-center p-1 md:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="md:text-2xl text-xl font-bold text-(--text)">{courseData.title}</h1>
                        <div className="flex gap-2 flex-wrap items-center">
                            <span className={`${courseData.difficulty == 1 ? "bg-(--green)" : courseData.difficulty == 2 ? "bg-(--blue)" : "bg-(--purple)"} text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-lg`}>
                                {courseData.difficulty == 1 ? "Iniciante" : courseData.difficulty == 2 ? "Intermediário" : "Avançado"}
                            </span>
                            <div className="flex items-center gap-1">
                                <AccessTimeOutlinedIcon sx={{ color: "var(--gray)", fontSize: 18 }} />
                                <p className="text-(--gray) text-sm text-center md:text-start">{courseData.duration}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <PeopleAltOutlinedIcon sx={{ color: "var(--gray)", fontSize: 18 }} />
                                <p className="text-(--gray) text-sm text-center md:text-start">{courseData.participants} participantes</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <StarOutlinedIcon sx={{ color: "var(--yellow)", fontSize: 18 }} />
                                <p className="text-(--gray) text-sm text-center md:text-start">{courseData.rating}</p>
                            </div>
                        </div>
                    </div>
                    {userRole === 'admin' && (
                        <ClientOnly>
                            <DeleteCourseButton courseId={courseId} />
                        </ClientOnly>
                    )}
                </div>

                {/* Details e Imagem do Curso */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 p-1">
                    <div className="flex flex-col gap-5 justify-around">
                        <p className="text-(--text) text-justify">{courseData.description}</p>
                        
                        {/* Seção de Progresso - SÓ PARA ALUNOS */}
                        {userRole === 'employee' && (
                            <div className="flex flex-col gap-2">
                                <div>
                                    <div className="flex w-full justify-between">
                                        <h2 className="text-(--text)">Seu Progresso</h2>
                                        <h2 className="text-(--text)">{courseData.progress}%</h2>
                                    </div>
                                    <LinearProgress variant="determinate" value={courseData.progress} />
                                </div>
                                <Link href={continueLink} className="w-full md:w-3/6 self-start">
                                    <div className="bg-(--normalBlue) flex items-center justify-center w-full rounded-2xl hover:bg-(--normalBlueHover) text-white">
                                        <Button className="w-full" disableElevation variant="contained" sx={{ boxShadow: 'var(--shadow)', backgroundColor: "inherit", color: "inherit", height: "45px" }}>{courseData.progress > 0 ? "Continuar Curso" : "Iniciar Curso"}</Button>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                    <Image className="object-cover w-full h-full md:w-auto rounded-2xl justify-self-center" src={courseData.image} alt={`${courseData.title}.png`} width={500} height={300} priority />
                </div>

                <Divider sx={{ borderColor: 'var(--gray)' }} />

                {/* Módulos e Aulas - SÓ PARA ALUNOS */}
                {userRole === 'employee' && (
                    <div>
                        {courseData.modules.map((module: any, index: number) =>
                            <Accordion key={module.id} sx={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "var(--text)" }} />}>
                                    <h1 className="text-(--blue) font-bold mr-2">Módulo {index + 1} -</h1>
                                    <p>{module.title}</p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {module.content.map((content: any) =>
                                        <div key={content.id}>
                                            <Link href={getLinkForContent(content)}>
                                                <div className="flex mb-2 mt-2 p-2 gap-3 items-center w-full hover:bg-(--blueOpacity) transition-colors duration-100 rounded-lg">
                                                    <div className={`w-1 min-h-10 ${content.type === 1 ? 'bg-(--blue)' : content.type === 2 ? 'bg-(--red)' : content.type === 3 ? 'bg-(--yellow)' : 'bg-(--green)'}`}></div>
                                                    {getIconForType(content.type)}
                                                    <h1 className="flex-grow">{content.title}</h1>
                                                    {content.completed && <CheckCircleOutlineOutlinedIcon sx={{ color: "var(--green)" }} />}
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        )}
                        
                        {courseData.haveExam && examData && (
                             <Accordion sx={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "var(--text)" }} />}>
                                    <h1 className="text-(--blue) font-bold mr-2">Módulo Final -</h1>
                                    <p>{examData.title}</p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Link href={examLink}>
                                        <div className="flex mb-2 mt-2 p-2 gap-3 items-center w-full hover:bg-(--purpleOpacity) transition-colors duration-100 rounded-lg">
                                            <div className="bg-(--purple) w-1 min-h-10"></div>
                                            <ContentPasteOutlinedIcon sx={{ color: "var(--purple)" }} />
                                            <h1 className="flex-grow">{examData.title}</h1>
                                            {isExamCompleted && <CheckCircleOutlineOutlinedIcon sx={{ color: "var(--green)" }} />}
                                        </div>
                                    </Link>
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default SelectCoursePage;