"use client";

import { useState } from "react";
import { NextLessonButton } from "./nextLessonButton";
import { CuteButton } from "./cuteButton";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useRouter } from 'next/navigation';
import api from "../constants/api";


interface IOption {
  id: string;
  text: string;
  alternative: string;
}

interface IQuestion {
  id: number;
  question: string;
  options: IOption[];
}

interface IQuizData {
  title: string;
  questions?: IQuestion[]; 
  content?: IQuestion[];
  nextLesson?: { id: string; type: number; title: string; };
}

interface IQuizResult {
    message: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    newProgress: number;
}

interface IQuizClientProps {
  courseId: string;
  activityId: string;
  initialQuizData: IQuizData;
  isExam?: boolean;
}

export const QuizClient = ({ courseId, activityId, initialQuizData, isExam = false }: IQuizClientProps) => {
  const router = useRouter();

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<IQuizResult | null>(null);

  const questionsToRender = initialQuizData.questions || initialQuizData.content || [];

  const handleSelect = (questionId: number, optionId: string) => {
    if (quizResult) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const submissionData = {
        answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
            questionId: Number(questionId),
            selectedOptionId,
        }))
    };

    const url = isExam 
      ? `/test/${courseId}/submit`
      : `/courses/${courseId}/lessons/${activityId}/submit`;

    try {
        const response = await api.post(url, submissionData);
        setQuizResult(response.data);
        router.refresh();
    } catch (error: any) {
        console.error("Erro ao submeter o quiz:", error);
        const errorMessage = error.response?.data?.message || "Ocorreu um erro ao enviar suas respostas.";
        alert(errorMessage);
    } finally {
        setIsLoading(false);
    }
  }

  if (quizResult) {
    return (
        <div className="flex flex-col md:p-10 p-3 rounded-2xl gap-6 items-center bg-(--card) shadow-(--shadow)">
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'var(--green)' }}/>
            <h2 className="text-2xl font-bold text-(--text)">Atividade Concluída!</h2>
            <p className="text-lg text-(--gray)">Sua pontuação foi:</p>
            <p className="text-5xl font-bold text-(--blue)">{quizResult.score}%</p>
            <p className="text-(--gray)">Você acertou {quizResult.correctAnswers} de {quizResult.totalQuestions} perguntas.</p>
            
            <div className="mt-6">
                {initialQuizData.nextLesson && (
                    <NextLessonButton href={`/courses/${courseId}/lessons/${initialQuizData.nextLesson.id}`} />
                )}
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col md:p-10 p-3 rounded-2xl gap-10 items-center">
        <div className="flex flex-col w-full gap-6">
            {questionsToRender.map((q, index) => (
                <div key={q.id} className="bg-(--card) shadow-(--shadow) rounded-xl p-6">
                    <p className="text-lg mb-4 text-(--text)">{index + 1}. {q.question}</p>
                    <ul className="flex flex-col gap-2">
                        {q.options.map(option => {
                            const isSelected = answers[q.id] === option.id;
                            return (
                                <li
                                    key={option.id}
                                    onClick={() => handleSelect(q.id, option.id)}
                                    className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition duration-300 ${isSelected ? "bg-(--hoverWhite)" : "bg-(--lightGray)"} hover:bg-(--hoverWhite)`}
                                >
                                    <span className="font-bold mr-2 text-(--text)">{option.id.toUpperCase()}.</span>
                                    <p className="text-(--text)">{option.text}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>

        <div className="self-center">
            <CuteButton 
                text="Enviar Respostas" 
                icon={CheckCircleOutlineIcon} 
                onClick={handleSubmit}
                disabled={isLoading}
            />
        </div>
    </div>
  );
};