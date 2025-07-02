"use client";

import { useState, FormEvent } from "react";
import { CuteButton } from "./cuteButton";
import { Button, Typography } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from '@mui/icons-material/Close';
import api from "../constants/api";

// 1. Interface de props ajustada para clareza
interface IPdfUploaderProps {
  courseId: string;
  activityId: string;
}

export function PdfUploader({ courseId, activityId }: IPdfUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false); // Estado para o loading

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sua lógica de seleção de arquivo está perfeita!
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.type !== "application/pdf") {
      setStatus("Só arquivos PDF são permitidos, por favor!");
      setFile(null);
      return;
    }
    setStatus("");
    setFile(selected);
  };

  // 2. Lógica de envio implementada
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus("Por favor, selecione um arquivo para enviar.");
      return;
    }

    setIsLoading(true);
    setStatus("Enviando arquivo...");

    // Monta o 'pacote' para envio de arquivo
    const formData = new FormData();
    // A chave 'pdfFile' deve ser a mesma que usamos no Multer no backend
    formData.append('pdfFile', file);

    try {
      // Monta a URL dinâmica para o endpoint correto
      const url = `/activities/${courseId}/lessons/${activityId}/upload`;
      
      // Envia o FormData para a API
      const response = await api.post(url, formData, {
        headers: {

        },
      });

      setStatus("Upload feito com sucesso! Seu progresso foi atualizado.");
      setFile(null);

    } catch (error: any) {
      console.error("Erro no upload:", error);
      const errorMessage = error.response?.data?.message || "Falha no upload. Tente novamente.";
      setStatus(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center w-full">
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isLoading}
      />

      {!file ? (
        <label htmlFor="file-upload" className="flex w-full items-center justify-center">
          <Button
            variant="outlined"
            component="span"
            className="w-full max-w-72 h-40 flex flex-col justify-center items-center gap-2"
            disabled={isLoading}
          >
            <div className="bg-(--blueOpacity) p-3 rounded-full animate-pulse">
              <UploadFileIcon sx={{ fontSize: 50 }} />
            </div>
            <Typography variant="body2">Selecionar PDF</Typography>
          </Button>
        </label>

      ) :
        <div className="flex items-center gap-2 p-4 border border-(--stroke) rounded-xl bg-(--lightGray) shadow">
          <PictureAsPdfIcon sx={{ fontSize: 45, color: "var(--text)" }} />
          <Typography variant="body2" className="text-center text-(--text)">
            {file.name}
          </Typography>
          <Button sx={{ alignSelf: "center" }} onClick={() => setFile(null)} disabled={isLoading}>
            <CloseIcon sx={{ color: "var(--text)" }} />
          </Button>
        </div>
      }

      {/* 3. Botão agora é do tipo 'submit' e é desabilitado durante o upload */}
      <CuteButton 
        type
        text={isLoading ? "Enviando..." : "Enviar arquivo"} 
        classname="justify-center" 
        disabled={!file || isLoading} 
      />

      {status && <p className="text-(--text) text-sm mt-2">{status}</p>}
    </form>
  );
}