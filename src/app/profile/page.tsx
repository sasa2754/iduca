"use client";

import { Menu } from "@/src/components/menu";
import Image, { StaticImageData } from "next/image";
import pessoa from "../../../public/image/pessoa.jpg"; // Fallback se o usuário não tiver foto
import { 
    Autocomplete, 
    Box, 
    Chip, 
    TextField, 
    CircularProgress, 
    Snackbar 
} from "@mui/material";
import { CuteButton } from "@/src/components/cuteButton";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { Card } from "@/src/components/card";
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useAuth } from "@/src/contexts/AuthContext";
import api from "@/src/constants/api";

// --- INTERFACES PARA OS DADOS ---

interface ICompletedCourse {
    id: string;
    title: string;
    image: string;
    certificateAvailable: boolean;
}

interface IProfileData {
    photoUser: string | null;
    name: string;
    email: string;
    interests: string[];
    completedCourses: number;
    averageTest: number;
    completedCoursesList: ICompletedCourse[];
}

interface IInterest {
    id: number;
    name: string;
}

const Profile = () => {
    const router = useRouter();
    const { loading: authLoading } = useAuth(); // Pega o estado de loading da autenticação

    // --- ESTADOS PARA OS DADOS E UI ---
    const [profileData, setProfileData] = useState<IProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // --- ESTADOS PARA O MODO DE EDIÇÃO ---
    const [editOn, setEditOn] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [preview, setPreview] = useState<StaticImageData | string>(pessoa);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const [allInterests, setAllInterests] = useState<string[]>([]);

    const interests = [
        {title: "Programação"},
        {title: "Gestão"},
        {title: "Marketing"},
        {title: "Administração"},
        {title: "Design"},
    ]
    // --- LÓGICA DE BUSCA DE DADOS ---
    const fetchProfileData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [profileRes, interestsRes] = await Promise.all([
                api.get('/profile'),
                api.get('/interests')
            ]);
            
            setProfileData(profileRes.data);
            // Inicializa os estados de edição com os dados atuais
            setSelectedInterests(profileRes.data.interests || []);
            setPreview(profileRes.data.photoUser || pessoa.src);
            setAllInterests(interestsRes.data.map((i: IInterest) => i.name));
        } catch (err) {
            console.error("Erro ao buscar dados do perfil:", err);
            setError("Não foi possível carregar os dados do perfil.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Só busca os dados depois que a autenticação estiver pronta
        if (!authLoading) {
            fetchProfileData();
        }
    }, [authLoading]);

    // --- LÓGICA DE EDIÇÃO ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleEditClick = () => {
        if (profileData) {
            setSelectedInterests(profileData.interests);
            setSelectedPhoto(null);
            setPreview(profileData.photoUser || pessoa.src);
        }
        setEditOn(true);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const formData = new FormData();

        if (selectedPhoto) {
            formData.append('photoUser', selectedPhoto);
        }
        
        selectedInterests.forEach(interest => {
            formData.append('interests', interest);
        });

        try {
            await api.put('/profile', formData);
            setSnackbar({ open: true, message: "Perfil atualizado com sucesso!" });
            setEditOn(false);
            fetchProfileData(); // Re-busca os dados para mostrar as atualizações
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Erro ao salvar o perfil.";
            setSnackbar({ open: true, message: errorMessage });
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const goToCertificate = (id : string) => {
        router.push(`/certificate/${id}`)
    }

    // --- RENDERIZAÇÃO CONDICIONAL ---
    if (isLoading || authLoading) {
        return (
            <>
                <Menu />
                <div className="flex justify-center items-center h-screen"><CircularProgress /></div>
            </>
        );
    }

    if (error || !profileData) {
        return (
            <>
                <Menu />
                <div className="text-center p-20 text-red-500">{error || "Não foi possível carregar o perfil."}</div>
            </>
        );
    }

    return (
        <>
            <Menu />
            <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
                {/* Title */}
                <div className="flex flex-col gap-1 items-center p-1 md:items-start">
                    <h1 className="md:text-2xl text-xl font-bold text-(--text)">Perfil</h1>
                    <p className="text-(--gray) text-sm md:text-lg text-center md:text-start">Gerencie suas informações pessoais!</p>
                </div>

                {/* Profile info */}
                <div className="grid xl:grid-cols-[1.1fr_1.5fr] grid-cols-1 w-full gap-6">
                    <div className="bg-(--card)  border border-(--stroke) shadow-(--shadow) rounded-2xl px-6 py-10 flex flex-col gap-8 items-center">
                        {!editOn ? (
                            <>
                                <Image className="rounded-full object-cover aspect-square w-52" src={profileData.photoUser || pessoa} alt="Foto de perfil" width={300} height={300} priority></Image>
                                <div className="flex flex-col gap-6 text-(--text) w-full">
                                    <TextField label="Nome completo" variant="outlined" value={profileData.name} InputProps={{ readOnly: true }} fullWidth/>
                                    <TextField label="E-mail corporativo" variant="outlined" value={profileData.email} InputProps={{ readOnly: true }} fullWidth/>
                                    <Autocomplete
                                            multiple
                                            readOnly
                                            disableClearable
                                            options={interests.map((item) => item.title)}
                                            defaultValue={interests.map((item) => item.title)}
                                            disableCloseOnSelect
                                            sx={{ color: "var(--text)" }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Interesses" variant="outlined" sx={{ color: "inherit" }}/>
                                            )}
                                            renderValue={(selected) => (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                    {selected.map((option, index) => (
                                                        <Chip
                                                        key={index}
                                                        label={option}
                                                        sx={{
                                                            backgroundColor: 'var(--aquamarine)', 
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            slotProps={{
                                                popupIndicator: { style: { display: 'none' } }
                                            }}
                                        />
                                </div>
                                <CuteButton text="Editar Perfil" onClick={handleEditClick} icon={ArrowForwardIcon}></CuteButton>
                            </>
                        ) : (
                            <>
                                <div className="relative w-52 aspect-square cursor-pointer flex items-center justify-center" onClick={() => fileInputRef.current?.click()}>
                                    <div className="absolute inset-0 bg-black opacity-50 rounded-full flex items-center justify-center transition-opacity hover:opacity-70">
                                        <EditOutlinedIcon className="text-white" fontSize="large" />
                                    </div>
                                    <Image className="rounded-full object-cover aspect-square" src={preview} alt="Pré-visualização da foto" width={208} height={208} />
                                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                </div>
                                <div className="flex flex-col gap-6 text-(--text) w-full">
                                    <TextField label="Nome completo" variant="outlined" defaultValue={profileData.name} InputProps={{ readOnly: true }} fullWidth/>
                                    <TextField label="E-mail corporativo" variant="outlined" defaultValue={profileData.email} InputProps={{ readOnly: true }} fullWidth/>
                                    <Autocomplete
                                            multiple
                                            disableClearable
                                            options={interests.map((item) => item.title)}
                                            defaultValue={interests.map((item) => item.title)}
                                            disableCloseOnSelect
                                            sx={{ color: "var(--text)", width: "100%" }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Interesses" variant="outlined" sx={{ color: "inherit" }}/>
                                            )}
                                            renderValue={(selected) => (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                    {selected.map((option, index) => (
                                                        <Chip
                                                        key={index}
                                                        label={option}
                                                        sx={{
                                                            backgroundColor: 'var(--aquamarine)', 
                                                            color: 'white',
                                                            fontWeight: 'bold'
                                                        }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        />
                                </div>
                                <div className="flex gap-4">
                                    <CuteButton text="Cancelar" onClick={() => setEditOn(false)}></CuteButton>
                                    <CuteButton text={isSaving ? "Salvando..." : "Salvar Alterações"} onClick={handleSaveProfile} disabled={isSaving} icon={ArrowForwardIcon}></CuteButton>
                                </div>
                            </>
                        )}
                    </div>   

                    {/* Conquistas */}
                    <div className="flex bg-(--card) flex-col border border-(--stroke) p-5 w-full rounded-2xl gap-4 shadow-(--shadow)">
                        <div className="flex flex-col gap-6">
                            <h1 className="text-xl font-bold text-(--text)">Conquistas</h1>
                            <div className="flex flex-row gap-6 items-center justify-center">
                                <div className="flex bg-(--lightGray) border border-(--stroke) shadow-(--shadow) rounded-2xl p-4 py-8 items-center gap-3 flex-col justify-center w-52">
                                    <div className="flex items-center justify-center p-1 bg-(--greenOpacity) rounded-full">
                                        <EmojiEventsOutlinedIcon sx={{ color: "var(--green)" }}/>
                                    </div>
                                    <h1 className="text-(--gray) text-center">{profileData.completedCourses} cursos finalizados</h1>
                                </div>
                                <div className="flex bg-(--lightGray) border border-(--stroke) shadow-(--shadow) rounded-2xl p-4 py-8 items-center gap-3 flex-col justify-center w-52">
                                    <div className="flex items-center justify-center p-1 bg-(--yellowOpacity) rounded-full">
                                        <StarBorderOutlinedIcon sx={{ color: "var(--yellow)" }}/>
                                    </div>
                                    <h1 className="text-(--gray) text-center">Média nas provas: {profileData.averageTest.toFixed(1)}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h1 className="text-xl font-bold text-(--text)">Cursos finalizados</h1>
                            <div className="flex flex-col gap-2 items-center justify-center max-h-60 overflow-y-auto">
                                {profileData.completedCoursesList.length > 0 ? (
                                    profileData.completedCoursesList.map(course => (
                                        // <Card key={course.id} color="bg-[var(--purple)]" title={course.title} onClickButton={() => goToCertificate(course.id)}></Card>
                                        <Card key={course.id} color="bg-[var(--purple)]" title={course.title}></Card>
                                    ))
                                ) : (
                                    <p className="text-(--gray)">Nenhum curso concluído ainda.</p>
                                )}
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})} message={snackbar.message} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} />
        </>
    )
}

export default Profile;