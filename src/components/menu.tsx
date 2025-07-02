"use client";

import { Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { ROUTES } from "../constants/routes";
import { CuteButton } from "./cuteButton";
import { DefaultProfile } from "./defaultProfile";
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../app/themeContext";
import { NotifyModal } from "./notifyModal";
import { Card } from "./card";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import api from "../constants/api";

interface INotification {
  _id: string;
  message: string;
  createdAt: string;
}


export const Menu = () => {
    const router = useRouter();
    const { user, signOut, loading: authLoading } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const { mode, toggleMode } = useThemeMode();
    const [notifyOpen, setNotifyOpen] = useState(false);

    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [isLoadingNotify, setIsLoadingNotify] = useState(false);

    const handleOpenNotify = async () => {
        setNotifyOpen(true);
        setIsLoadingNotify(true);
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        } finally {
            setIsLoadingNotify(false);
        }
    };
    
    const handleLogout = () => {
        signOut();
        router.push(ROUTES.login);
    };

    const toggleDrawer = (newOpen: boolean) => () => {
        setIsOpen(newOpen);
    };

    const renderDrawerList = () => {
        if (user?.role === 'admin') {
            return (
                <div onClick={toggleDrawer(false)} className="flex flex-col bg-(--darkBlue) h-screen py-2">
                    <Link href={ROUTES.homeAdmin} className="w-full flex justify-center"><h1 className="text-3xl text-(--aquamarine)">Iduca</h1></Link>
                    <List sx={{ width: "240px" }}>
                        <ListItemButton onClick={() => router.push(ROUTES.homeAdmin)}><ListItemIcon><DashboardOutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Dashboard" /></ListItemButton>
                        <ListItemButton onClick={() => router.push(ROUTES.coursesAdmin)}><ListItemIcon><LibraryBooksOutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Cursos" /></ListItemButton>
                    </List>
                </div>
            );
        }
        if (user?.role === 'manager') {
            return (
                <div onClick={toggleDrawer(false)} className="flex flex-col bg-(--darkBlue) h-screen py-2">
                    <Link href={ROUTES.homeManager} className="w-full flex justify-center"><h1 className="text-3xl text-(--aquamarine)">Iduca</h1></Link>
                    <List sx={{ width: "240px" }}>
                        <ListItemButton onClick={() => router.push(ROUTES.homeManager)}><ListItemIcon><DashboardOutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Dashboard" /></ListItemButton>
                        <ListItemButton onClick={() => router.push(ROUTES.coursesManager)}><ListItemIcon><LibraryBooksOutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Cursos" /></ListItemButton>
                        <ListItemButton onClick={() => router.push(ROUTES.collaborators)}><ListItemIcon><GroupsOutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Colaboradores" /></ListItemButton>
                        <ListItemButton onClick={() => router.push(ROUTES.profileManager)}><ListItemIcon><Person2OutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Perfil" /></ListItemButton>
                    </List>
                </div>
            );
        }
        return (
            <div onClick={toggleDrawer(false)} className="flex flex-col bg-(--darkBlue) h-screen py-2">
                <Link href={ROUTES.home} className="w-full flex justify-center"><h1 className="text-3xl text-(--aquamarine)">Iduca</h1></Link>
                <List sx={{ width: "240px" }}>
                    <ListItemButton onClick={() => router.push(ROUTES.home)}><ListItemIcon><DashboardOutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Dashboard" /></ListItemButton>
                    <ListItemButton onClick={() => router.push(ROUTES.courses)}><ListItemIcon><LibraryBooksOutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Cursos" /></ListItemButton>
                    <ListItemButton onClick={() => router.push(ROUTES.calendar)}><ListItemIcon><CalendarMonthOutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Calendário" /></ListItemButton>
                    <ListItemButton onClick={() => router.push(ROUTES.profile)}><ListItemIcon><Person2OutlinedIcon sx={{color: 'white'}}/></ListItemIcon><ListItemText primary="Perfil" /></ListItemButton>
                </List>
            </div>
        );
    };

    const getInitials = () => {
        if (!user?.name) return { first: '?', last: '' };
        const names = user.name.split(' ');
        const first = names[0]?.[0] || '';
        const last = names.length > 1 ? names[names.length - 1]?.[0] || '' : '';
        return { first, last };
    };

    const { first, last } = getInitials();

    return (
        <>
            <div className="bg-(--card) border-b border-(--stroke) fixed w-screen h-14 z-50 shadow-(--shadow) items-center flex justify-between px-5">
                <div className="flex items-center gap-3">
                    <Button sx={{ color: "var(--gray)", padding: "0px", width: "30px", minWidth: "0px" }} onClick={toggleDrawer(true)}>
                        <MenuOutlinedIcon sx={{ width: "30px" }}/>
                    </Button>
                    <Link href={user?.role === 'admin' ? ROUTES.homeAdmin : user?.role === 'manager' ? ROUTES.homeManager : ROUTES.home}>
                        <h1 className="text-2xl font-semibold m-0 text-(--text)" style={{ fontFamily: 'var(--jura)'}}>Iduca</h1>
                    </Link>
                </div>
                <div className="flex gap-3 items-center">
                    <CuteButton icon={NotificationsNoneOutlinedIcon} onClick={handleOpenNotify}></CuteButton>
                    <DefaultProfile firstLetter={first} lastLetter={last} onClick={() => router.push(ROUTES.profile)}></DefaultProfile>
                </div>
            </div>
            <Drawer open={isOpen} onClose={toggleDrawer(false)}>
                {renderDrawerList()}
                <div className="bg-(--darkBlue) flex justify-between p-3 mt-auto">
                    <Button onClick={toggleMode}>
                        {mode === "dark" ? <LightModeIcon sx={{ color: "white" }} /> : <DarkModeIcon sx={{ color: "white" }} />}
                    </Button>
                    <Button onClick={handleLogout}>
                        <LogoutIcon sx={{ color: "white" }}/>
                    </Button>
                </div>
            </Drawer>

            <NotifyModal title="Notificações" open={notifyOpen} onClose={() => setNotifyOpen(false)}>
                {isLoadingNotify ? <p>Carregando...</p> : 
                notifications.length > 0 ? (
                    notifications.map(n => (
                        <Card key={n._id} title="Nova Notificação" description={n.message} color="bg-[var(--purple)]"></Card>
                    ))
                ) : (
                    <p>Você não tem notificações novas!</p>
                )}
            </NotifyModal>

            <div className="h-14"></div>
        </>
    );
}