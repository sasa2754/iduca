"use client";

import { useEffect, useState } from "react"; // 1. Importar useState
import api from "../constants/api";


interface LessonCompleterProps {
    courseId: string;
    lessonId: string;
}

export function LessonCompleter({ courseId, lessonId }: LessonCompleterProps) {
    // 2. Adicionar um estado para controlar se a chamada já foi feita
    const [hasBeenCalled, setHasBeenCalled] = useState(false);

    useEffect(() => {
        // 3. Uma "guarda": se já chamamos a API, não fazemos nada.
        if (hasBeenCalled) {
            return;
        }

        const markAsComplete = async () => {
            // 4. Marca como "chamado" imediatamente para evitar chamadas duplicadas
            setHasBeenCalled(true); 
            try {
                await api.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
                console.log(`Aula ${lessonId} marcada como concluída.`);
            } catch (error: any) {
                console.error("Tentativa de auto-completar a aula falhou (isso pode ser normal se já estava completa):", error.response?.data?.message || error.message);
            }
        };

        markAsComplete();
    }, [courseId, lessonId, hasBeenCalled]); // Adiciona hasBeenCalled às dependências

    return null;
}