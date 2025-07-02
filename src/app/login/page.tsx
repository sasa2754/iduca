"use client"

import { ROUTES } from "@/src/constants/routes";
import { Button, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, SnackbarCloseReason, TextField } from "@mui/material";
import { VisibilityOff, Visibility } from '@mui/icons-material';
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/src/contexts/AuthContext";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [openReturn, setOpenReturn] = useState(false);
    const [messageReturn, setMessageReturn] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const { signIn } = useAuth();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpenReturn(false);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const { firstAccess, role } = await signIn({ email, password });
            setMessageReturn("Login bem sucedido!");
            setOpenReturn(true);

            console.log(role)

            if (firstAccess) {
                router.push(ROUTES.setInitialPassword);
            } else if (role === 'admin') {
                router.push(ROUTES.homeAdmin);
            } else if (role === 'manager') {
                router.push(ROUTES.homeManager);
            } else {
                router.push(ROUTES.home);
            }

        } catch (error) {
            setMessageReturn("E-mail ou senha inválidos. Tente novamente.");
            setOpenReturn(true);
            console.error("Falha no login:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-screen h-screen gap-5 flex flex-col items-center p-2 md:py-20 py-10">
            <div className="flex flex-col items-center">
                <h1 className="text-5xl text-(--text)" style={{ fontFamily: 'var(--jura)'}}>Iduca</h1>
                <p className="text-(--gray) text-center">Plataforma de treinamento corporativo</p>
            </div>
            <div className="w-full gap-8 px-5 py-5 rounded-2xl border border-(--stroke) bg-(--card) shadow-(--shadow) md:max-w-lg flex flex-col">
                <div className="flex flex-col gap-1">
                    <h1 className="font-semibold text-2xl text-(--text)">Entrar</h1>
                    <p className="text-(--gray)">Acesse sua conta para continuar seus treinamentos</p>
                </div>
                <div className="w-full flex flex-col gap-4">
                    <TextField onChange={(e) => setEmail(e.target.value)} value={email} label="E-mail corporativo" variant="outlined" required />
                    <div className="flex flex-col gap-1">
                        <FormControl variant="outlined">
                            <InputLabel>Senha</InputLabel>
                            <OutlinedInput 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password}
                                type={showPassword ? 'text' : 'password'} 
                                endAdornment={ <InputAdornment position="end"> <IconButton aria-label={ showPassword ? 'hide the password' : 'display the password' } onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} onMouseUp={handleMouseUpPassword} edge="end" > {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> } 
                                label="Senha" 
                                required
                            />
                        </FormControl>
                        <Link className="self-end text-(--normalBlue) hover:text-(--normalBlueHover)" href={ROUTES.forgotPass}>Esqueceu a senha?</Link>
                    </div>
                </div>
                <div className="bg-(--normalBlue) flex items-center justify-center w-full rounded-2xl hover:bg-(--normalBlueHover) text-white">
                    <Button className="w-full" type="submit" disableElevation variant="contained" sx={{boxShadow: 'var(--shadow)', backgroundColor: "inherit", color: "inherit"}}>Entrar</Button>
                </div>
                <Divider />
                <p className="text-(--gray) text-center">Não tem uma conta? Peça ao seu gestor para criar uma para você!</p>
            </div>
            <Snackbar open={openReturn} autoHideDuration={5000} onClose={handleClose} message={messageReturn} />
        </form>
    )
}

export default Login;