"use client";

import { ROUTES } from "@/src/constants/routes";
import { Button, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, SnackbarCloseReason } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/src/contexts/AuthContext"; // Importamos o signOut
import api from "@/src/constants/api";

const SetInitialPassword = () => {
    // --- ESTADOS PARA A UI E FEEDBACK ---
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openReturn, setOpenReturn] = useState(false);
    const [messageReturn, setMessageReturn] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // --- ESTADOS PARA OS DADOS DO FORMULÁRIO ---
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const router = useRouter();
    const { signOut } = useAuth(); // Usaremos para deslogar o usuário após a troca de senha

    // --- FUNÇÕES DE LÓGICA ---

    // Função para mostrar/esconder as senhas
    const handleTogglePasswordVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter((show) => !show);
    };

    // Função para fechar o Snackbar
    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenReturn(false);
    };

    // Função principal para submeter o formulário
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Validações no frontend para uma melhor UX
        if (newPassword !== confirmNewPassword) {
            setMessageReturn("A nova senha e a confirmação não coincidem!");
            setOpenReturn(true);
            return;
        }
        if (newPassword.length < 6) {
            setMessageReturn("Sua nova senha deve ter no mínimo 6 caracteres.");
            setOpenReturn(true);
            return;
        }

        setIsLoading(true);
        try {
            // Chama nosso endpoint que já está pronto no backend
            // O token do usuário já é enviado automaticamente pelo interceptor do Axios
            await api.post('/auth/set-initial-password', {
                currentPassword,
                newPassword
            });

            setMessageReturn("Senha definida com sucesso! Você será deslogado para entrar novamente.");
            setOpenReturn(true);

            // Desloga o usuário e o redireciona para a página de login após um tempo
            setTimeout(() => {
                signOut(); // Limpa o token e o contexto
                router.push(ROUTES.login);
            }, 2500);

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Ocorreu um erro ao definir a senha.";
            setMessageReturn(errorMessage);
            setOpenReturn(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen gap-5 flex flex-col items-center p-2 md:py-20 py-10">
            <div className="flex flex-col items-center">
                <h1 className="text-5xl text-(--text)" style={{ fontFamily: 'var(--jura)' }}>Iduca</h1>
                <p className="text-(--gray) text-center">Plataforma de treinamento corporativo</p>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full gap-8 px-5 py-5 rounded-2xl border border-(--stroke) bg-(--card) shadow-(--shadow) md:max-w-lg flex flex-col">
                <div className="flex flex-col gap-1">
                    <h1 className="font-semibold text-2xl text-(--text)">Defina sua Senha</h1>
                    <p className="text-(--gray)">Este é o seu primeiro acesso. Por segurança, crie uma nova senha pessoal.</p>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <FormControl variant="outlined">
                        <InputLabel>Senha Temporária</InputLabel>
                        <OutlinedInput
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            type={showCurrentPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => handleTogglePasswordVisibility(setShowCurrentPassword)} edge="end">
                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Senha Temporária"
                            required
                        />
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel>Nova Senha</InputLabel>
                        <OutlinedInput
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            type={showNewPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => handleTogglePasswordVisibility(setShowNewPassword)} edge="end">
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Nova Senha"
                            required
                        />
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel>Confirme a Nova Senha</InputLabel>
                        <OutlinedInput
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            type={showConfirmPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => handleTogglePasswordVisibility(setShowConfirmPassword)} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirme a Nova Senha"
                            required
                        />
                    </FormControl>
                </div>
                
                <div className="bg-(--normalBlue) flex items-center justify-center w-full rounded-2xl hover:bg-(--normalBlueHover)">
                    <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full" 
                        disableElevation 
                        variant="contained" 
                        sx={{ boxShadow: 'var(--shadow)', backgroundColor: "inherit", color: "inherit" }}
                    >
                        {isLoading ? "Definindo..." : "Definir Senha e Entrar"}
                    </Button>
                </div>
                
                <Divider />
                
                <p className="text-(--gray) text-center">Precisa de ajuda? Contate seu gestor.</p>
            </form>
            
            <Snackbar open={openReturn} autoHideDuration={5000} onClose={handleCloseSnackbar} message={messageReturn} />
        </div>
    );
}

export default SetInitialPassword;