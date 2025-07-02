"use client";

import { Menu } from "@/src/components/menu";
import Image, { StaticImageData } from "next/image";
import pessoa from "../../../public/image/pessoa.jpg"; // Usaremos como fallback
import background from "../../../public/image/profileImageBackground.webp";
import { Autocomplete, Box, Chip, TextField, CircularProgress, Snackbar } from "@mui/material";
import { CuteButton } from "@/src/components/cuteButton";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import api from "@/src/constants/api";


// --- INTERFACES PARA OS DADOS ---
interface IProfileData {
    photoUser: string | null;
    name: string;
    email: string;
    interests: string[];
}

interface IInterest {
    id: number;
    name: string;
}

const ProfileManager = () => {
    const router = useRouter();

    // --- ESTADOS PARA OS DADOS E UI ---
    const [profileData, setProfileData] = useState<IProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para o modo de edição
    const [editOn, setEditOn] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [preview, setPreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const [allInterests, setAllInterests] = useState<string[]>([]);

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
        fetchProfileData();
    }, []);

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
            fetchProfileData();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Erro ao salvar o perfil.";
            setSnackbar({ open: true, message: errorMessage });
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- RENDERIZAÇÃO CONDICIONAL ---
    if (isLoading) {
        return (
            <>
                            <Menu />

                <div className="text-center p-20 flex justify-center items-center"><CircularProgress /></div>
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
                <div className="flex flex-col gap-1 items-center p-1 md:items-start">
                    <h1 className="md:text-2xl text-xl font-bold text-(--text)">Perfil</h1>
                    <p className="text-(--gray) text-sm md:text-lg text-center md:text-start">Gerencie suas informações pessoais!</p>
                </div>
                <div className="grid xl:grid-cols-[1.1fr_1.5fr] grid-cols-1 w-full gap-6">
                    <div className="bg-(--card)  border border-(--stroke) shadow-(--shadow) rounded-2xl px-6 py-10 flex flex-col gap-8 items-center">
                        {!editOn ? (
                            <>
                                <Image className="rounded-full object-cover aspect-square w-52" src={profileData.photoUser || pessoa} alt="Foto de perfil" width={300} height={300} priority></Image>
                                <div className="flex flex-col gap-6 text-(--text) w-full">
                                    {/* CORREÇÃO: Usamos 'value' e damos um fallback para '' */}
                                    <TextField label="Nome completo" variant="outlined" value={profileData.name || ''} InputProps={{ readOnly: true }} fullWidth/>
                                    <TextField label="E-mail corporativo" variant="outlined" value={profileData.email || ''} InputProps={{ readOnly: true }} fullWidth/>
                                    <Autocomplete
                                        multiple
                                        readOnly
                                        options={profileData.interests}
                                        value={profileData.interests}
                                        renderInput={(params) => (<TextField {...params} label="Interesses" />)}
                                        // renderTags={(value, getTagProps) =>
                                        //     value.map((option, index) => (
                                        //         <Chip label={option} {...getTagProps({ index })} sx={{ backgroundColor: 'var(--aquamarine)', color: 'white', fontWeight: 'bold' }} />
                                        //     ))
                                        // }
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
                                        options={allInterests}
                                        value={selectedInterests}
                                        onChange={(event, newValue) => {
                                            if (newValue.length <= 5) {
                                                setSelectedInterests(newValue);
                                            }
                                        }}
                                        renderInput={(params) => ( <TextField {...params} label="Interesses" helperText="Selecione até 5." /> )}
                                        // renderTags={(value, getTagProps) =>
                                        //     value.map((option, index) => (
                                        //         <Chip label={option} {...getTagProps({ index })} sx={{ backgroundColor: 'var(--aquamarine)', color: 'white', fontWeight: 'bold' }} />
                                        //     ))
                                        // }
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <CuteButton text="Cancelar" onClick={() => setEditOn(false)}></CuteButton>
                                    <CuteButton text={isSaving ? "Salvando..." : "Salvar Alterações"} onClick={handleSaveProfile} disabled={isSaving} icon={ArrowForwardIcon}></CuteButton>
                                </div>
                            </>
                        )}
                    </div>   
                    <Image className="lg:flex hidden object-cover rounded-2xl aspect-square w-full lg:h-[776px] md:h-[700px]" src={background} alt="Imagem de fundo do perfil" width={2000} height={2000} priority />
                </div>
            </div>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})} message={snackbar.message} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} />
        </>
    )
}

export default ProfileManager;