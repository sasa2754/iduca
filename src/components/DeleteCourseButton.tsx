"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CuteButton } from "./cuteButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ROUTES } from "../constants/routes";
import api from "../constants/api";

interface DeleteCourseButtonProps {
    courseId: string;
}

export const DeleteCourseButton = ({ courseId }: DeleteCourseButtonProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        // Confirmação para evitar exclusões acidentais
        if (!window.confirm("Tem certeza que deseja deletar este curso? Esta ação não pode ser desfeita.")) {
            return;
        }

        setIsDeleting(true);
        try {
            await api.delete(`/admin/courses/${courseId}`);
            alert("Curso deletado com sucesso!"); // Pode substituir por um Snackbar depois
            router.push(ROUTES.coursesAdmin); // Redireciona para a lista de cursos do admin
            router.refresh(); // Força a atualização dos dados na página de destino
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Erro ao deletar o curso.";
            alert(errorMessage);
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <CuteButton
            text={isDeleting ? "Deletando..." : "Deletar Curso"}
            icon={DeleteOutlineIcon}
            onClick={handleDelete}
            disabled={isDeleting}
            classname="bg-red-500 text-white hover:bg-red-700" // Estilo customizado para ação de perigo
        />
    );
};