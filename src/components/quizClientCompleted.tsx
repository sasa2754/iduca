"use client";

import { useState } from "react";
import { NextLessonButton } from "./nextLessonButton";
import { CuteButton } from "./cuteButton";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/src/constants/routes";

interface IQuizClient {
  quizId: number;
  isExam?: boolean;
}

interface Option {
  id: number;
  text: string;
  alternative: string;
  correct: boolean;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
  userResponse: number;
}

interface QuizData {
  id: number;
  title: string;
  questions: Question[];
  nextLesson: {
    id: number;
    type: number;
    title: string;
  };
}

const projectCompletedExemple = {
  id: 1,
  title: "Prova Final",
  courseId: 2,
  questions: [
    {
      id: 1,
      question: "Qual é o comando para iniciar um repositório Git?",
      options: [
        { id: 1, text: "git start", alternative: "a", correct: false },
        { id: 2, text: "git init", alternative: "b", correct: true },
        { id: 3, text: "git begin", alternative: "c", correct: false }
      ],
      userResponse: 2
    },
    {
      id: 2,
      question: "Qual pasta armazena o histórico de commits de um repositório Git?",
      options: [
        { id: 1, text: ".git/config", alternative: "a", correct: true },
        { id: 2, text: ".gitignore", alternative: "b", correct: false },
        { id: 3, text: ".git", alternative: "c", correct: false }
      ],
      userResponse: 3
    },
    {
      id: 3,
      question: "Imagine que você está trabalhando em um projeto com uma equipe de várias pessoas desenvolvedoras, e todas estão colaborando usando Git e GitHub. Qual comando você deve utilizar para garantir que sua cópia local do projeto esteja atualizada com a versão mais recente que está no repositório remoto, antes de iniciar uma nova funcionalidade?",
      options: [
        { id: 1, text: "git pull", alternative: "a", correct: false },
        { id: 2, text: "git update", alternative: "b", correct: false },
        { id: 3, text: "git merge", alternative: "c", correct: true }
      ],
      userResponse: 1
    },
    {
      id: 4,
      question: "Qual comando usamos para verificar o estado atual do repositório?",
      options: [
        { id: 1, text: "git status", alternative: "a", correct: true },
        { id: 2, text: "git check", alternative: "b", correct: false },
        { id: 3, text: "git log", alternative: "c", correct: false }
      ],
      userResponse: 1
    },
    {
      id: 5,
      question: "Qual desses arquivos é usado para ignorar arquivos no Git?",
      options: [
        { id: 1, text: ".gitignore", alternative: "a", correct: false },
        { id: 2, text: ".gitconfig", alternative: "b", correct: true },
        { id: 3, text: ".ignore", alternative: "c", correct: false }
      ],
    }
  ],
  nextLesson: {
    id: 102,
    type: 4,
    title: "Instalando o Git"
  }
};

export const QuizClientCompleted = ({ quizId, isExam }: IQuizClient) => {
  const router = useRouter();

  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  const handleSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const nextLessonHref = () => {
    const nextLesson = projectCompletedExemple.nextLesson;
    switch (nextLesson.type) {
      case 1: return `/textLesson/${nextLesson.id}`;
      case 2: return `/videoLesson/${nextLesson.id}`;
      case 3: return `/quiz/${nextLesson.id}`;
      case 4: return `/project/${nextLesson.id}`;
      case 5: return `/exam/${nextLesson.id}`;
      default: return '/';
    }
  };

  const totalQuestions = projectCompletedExemple.questions.length;
  const correctAnswers = projectCompletedExemple.questions.filter(q => {
    const userOption = q.options.find(o => o.id === q.userResponse);
    return userOption?.correct;
  }).length;

  const score = `${correctAnswers} / ${totalQuestions}`;

  return (
    <div className="flex flex-col md:p-10 p-3 rounded-2xl gap-10 items-center">
      {/* Questões */}
      <div className="flex flex-col w-full gap-6">
        {projectCompletedExemple.questions.map((q, index) => (
          <div key={q.id} className="bg-(--card) shadow-(--shadow) rounded-xl p-6">
            <p className="text-lg mb-4 text-(--text)">{index + 1}. {q.question}</p>
            <ul className="flex flex-col gap-2">
              {q.options.map(option => {
                const isUserAnswer = q.userResponse === option.id;
                const isCorrect = option.correct;
                const userGotItRight = q.options.find(o => o.id === q.userResponse)?.correct;

                let optionStyle = "flex px-4 py-2 rounded-md transition duration-300";
                if (isUserAnswer && isCorrect) {
                  optionStyle += " underline text-green-600";
                } else if (isUserAnswer && !isCorrect) {
                  optionStyle += " underline text-red-500";
                } else if (!isUserAnswer && isCorrect) {
                  optionStyle += " text-green-600";
                } else {
                  optionStyle += " text-(--text)";
                }

                return (
                  <li
                    key={option.id}
                    className={optionStyle}
                  >
                    <span className="font-bold mr-2">{option.alternative.toUpperCase()}.</span>
                    <p>{option.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Nota final */}
      <div className="text-xl font-semibold text-center text-(--text)">
        Sua nota: <span className="text-green-600">{score}</span>
      </div>

      {/* Botão de próxima aula */}
      {!isExam ? 
        <div className="self-center">
          <CuteButton text="Encerrar Prova" icon={CheckCircleOutlineIcon} onClick={() => (router.push(`/courses/${projectCompletedExemple.courseId}`))}/>
        </div>
        :
        <div className="self-center">
          <NextLessonButton href={nextLessonHref()} />
        </div>
      }
    </div>
  );
};
