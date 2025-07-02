"use client"

import { ROUTES } from "@/src/constants/routes";
import { Box, Button, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, SnackbarCloseReason, TextField } from "@mui/material";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "@/src/constants/api";

const ForgotPass = () => {
    // Seus estados de UI, perfeitos!
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [openReturn, setOpenReturn] = useState(false);
    const [messageReturn, setMessageReturn] = useState("");

    // Estados de dados
    const [email, setEmail] = useState("");
    const [values, setValues] = useState(["", "", "", "", ""]); // Para o código
    const [password, setPassword] = useState(""); // Mudei para 'password' por consistência
    const [passwordAgain, setPasswordAgain] = useState("");
    
    // Estado do formulário
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false); // 2. Estado para feedback de carregamento
    const router = useRouter();

    // Funções do "olhinho" e do Snackbar (sem mudanças)
    const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
    const handleMouseDownPassword1 = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
    const handleMouseDownPassword2 = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
    const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenReturn(false);
    };

    // Função para os inputs do código de verificação (sem mudanças)
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const newValues = [...values];
        newValues[index] = event.target.value;
        if (event.target.value.length === 1 && index < 4) {
            document.getElementById(`input-${index + 1}`)?.focus();
        }
        setValues(newValues);
    };


    // --- FUNÇÕES DE LÓGICA INTEGRADAS COM O BACKEND ---

    const handleSendCode = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/forgotPass', { email });
            setMessageReturn("Código de recuperação enviado para o seu e-mail!");
            setOpenReturn(true);
            setPage(2); // Avança para a próxima tela
        } catch (error) {
            setMessageReturn("Ocorreu um erro. Verifique o e-mail e tente novamente.");
            setOpenReturn(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCheckCode = async (event: FormEvent) => {
        event.preventDefault();
        const code = values.join('');
        if (code.length !== 5) {
            setMessageReturn("Por favor, preencha os 5 dígitos do código.");
            setOpenReturn(true);
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post('/auth/checkCode', { email, code });
            if (response.data.response) {
                setMessageReturn("Código validado com sucesso!");
                setOpenReturn(true);
                setPage(3); // Avança para a tela de redefinir senha
            } else {
                throw new Error("Código inválido");
            }
        } catch (error) {
            setMessageReturn("Código inválido ou expirado. Tente novamente.");
            setOpenReturn(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            await api.post('/auth/resendCode', { email });
            setMessageReturn("Um novo código foi enviado para o seu e-mail!");
            setOpenReturn(true);
        } catch (error) {
            setMessageReturn("Ocorreu um erro ao reenviar o código.");
            setOpenReturn(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleResetPassword = async (event: FormEvent) => {
        event.preventDefault();
        if (password !== passwordAgain) {
            setMessageReturn("As senhas não coincidem!");
            setOpenReturn(true);
            return;
        }
        if (password.length < 6) { // Exemplo de validação
            setMessageReturn("A senha deve ter no mínimo 6 caracteres.");
            setOpenReturn(true);
            return;
        }

        const code = values.join('');
        setIsLoading(true);
        try {
            await api.post('/auth/resetPassword', { email, code, newPassword: password });
            setMessageReturn("Senha redefinida com sucesso!");
            setOpenReturn(true);
            // Atraso para o usuário ver a mensagem antes de ser redirecionado
            setTimeout(() => {
                router.push(ROUTES.login);
            }, 1500);
        } catch (error) {
            setMessageReturn("Ocorreu um erro ao redefinir a senha.");
            setOpenReturn(true);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
<div className="w-screen h-screen gap-5 flex flex-col items-center p-2 md:py-20 py-10">
        <div className="flex flex-col items-center">
            <h1 className="text-5xl text-(--text)" style={{ fontFamily: 'var(--jura)' }}>Iduca</h1>
            <p className="text-(--gray) text-center">Plataforma de treinamento corporativo</p>
        </div>
        <div className="w-full gap-8 px-5 py-5 rounded-2xl border border-(--stroke) bg-(--card) shadow-(--shadow) md:max-w-lg flex flex-col">
            
            {/* ETAPA 1: PEDIR O E-MAIL */}
            {page === 1 && (
                <form onSubmit={handleSendCode} className="contents">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-semibold text-2xl text-(--text)">Confirmar E-mail</h1>
                        <p className="text-(--gray)">Digite seu e-mail para enviarmos um código para recuperação da sua conta</p>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        <TextField onChange={(e) => setEmail(e.target.value)} label="E-mail corporativo" variant="outlined" required />
                    </div>
                    <div className="bg-(--normalBlue) flex items-center justify-center w-full rounded-2xl hover:bg-(--normalBlueHover)">
                        {/* O botão agora é do tipo 'submit' e não tem mais onClick */}
                        <Button type="submit" disabled={isLoading} className="w-full" disableElevation variant="contained" sx={{ boxShadow: 'var(--shadow)', backgroundColor: "inherit", color: "inherit" }}>Confirmar e-mail</Button>
                    </div>
                </form>
            )}

            {/* ETAPA 2: INSERIR O CÓDIGO */}
            {page === 2 && (
                <form onSubmit={handleCheckCode} className="contents">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-semibold text-2xl text-(--text)">Código de recuperação</h1>
                        <p className="text-(--gray)">Digite o código de 5 números que foi enviado no seu e-mail</p>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex w-full gap-1 md:justify-around justify-center text-center">
                            {values.map((value, index) => (
                                <TextField
                                    key={index}
                                    id={`input-${index}`}
                                    value={value}
                                    onChange={(e) => handleChange(e, index)}
                                    variant="outlined"
                                    sx={{ maxWidth: "60px" }}
                                    inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                />
                            ))}
                        </div>
                        <div className="flex flex-col gap-1">
                            {/* Este botão não submete o form, então ele é do tipo 'button' e mantém o onClick */}
                            <button type="button" onClick={handleResendCode} disabled={isLoading} className="self-end text-(--normalBlue) hover:text-(--normalBlueHover) cursor-pointer">Reenviar código</button>
                        </div>
                    </div>
                    <div className="bg-(--normalBlue) flex items-center justify-center w-full rounded-2xl hover:bg-(--normalBlueHover)">
                        <Button type="submit" disabled={isLoading} className="w-full" disableElevation variant="contained" sx={{ boxShadow: 'var(--shadow)', backgroundColor: "inherit", color: "inherit" }}>Confirmar código</Button>
                    </div>
                </form>
            )}

            {/* ETAPA 3: REDEFINIR A SENHA */}
            {page === 3 && (
                <form onSubmit={handleResetPassword} className="contents">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-semibold text-2xl text-(--text)">Redefinir sua senha</h1>
                        <p className="text-(--gray)">Digite sua nova senha nos dois campos abaixo</p>
                    </div>
                    <div className="w-full flex flex-col gap-4">
                        <FormControl variant="outlined">
                            <InputLabel>Senha</InputLabel>
                            <OutlinedInput onChange={(e) => setPassword(e.target.value)} type={showPassword1 ? 'text' : 'password'} endAdornment={<InputAdornment position="end"> <IconButton onClick={handleClickShowPassword1} onMouseDown={handleMouseDownPassword1} edge="end" > {showPassword1 ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment>} label="Senha" required />
                        </FormControl>
                        <FormControl variant="outlined">
                            <InputLabel>Repita a senha</InputLabel>
                            <OutlinedInput onChange={(e) => setPasswordAgain(e.target.value)} type={showPassword2 ? 'text' : 'password'} endAdornment={<InputAdornment position="end"> <IconButton onClick={handleClickShowPassword2} onMouseDown={handleMouseDownPassword2} edge="end" > {showPassword2 ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment>} label="Repita a senha" required />
                        </FormControl>
                    </div>
                    <div className="bg-(--normalBlue) flex items-center justify-center w-full rounded-2xl hover:bg-(--normalBlueHover)">
                        <Button type="submit" disabled={isLoading} className="w-full" disableElevation variant="contained" sx={{ boxShadow: 'var(--shadow)', backgroundColor: "inherit", color: "inherit" }}>Redefinir Senha</Button>
                    </div>
                </form>
            )}

            <Divider />
            <div className="flex gap-1 justify-center w-full">
                <h1 className="text-(--text)">Lembrou sua senha?</h1>
                <Link className="self-center text-(--normalBlue) hover:text-(--normalBlueHover)" href={ROUTES.login}>Faça login</Link>
            </div>
        </div>
        <Snackbar open={openReturn} autoHideDuration={5000} onClose={handleClose} message={messageReturn} />
    </div>
    )
}

export default ForgotPass;