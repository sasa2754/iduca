import { Menu } from "@/src/components/menu";
import Image from "next/image";
import { CuteButton } from "@/src/components/cuteButton";
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import { BackButton } from "@/src/components/backButton";
import { ClientOnly } from "@/src/components/ClientOnly";
import Link from "next/link";

interface ICertificatePageProps {
  params: {
    id: string;
  };
}

const CertificatePage = ({ params }: ICertificatePageProps) => {
  const { id: courseId } = params;

  const imageUrl = `/api/certificate/${courseId}/image`;
  
  const pdfUrl = `/api/certificate/${courseId}/pdf`;

  return (
    <>
      <Menu />

      <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
        <div className="flex md:flex-row flex-col gap-5 items-center p-1 md:items-start">
          <BackButton />
          <h1 className="md:text-2xl text-xl font-bold text-(--text) text-center">
            Seu Certificado de Conclusão
          </h1>
        </div>

        <div className="flex bg-(--card) xl:max-w-8/12 border border-(--stroke) flex-col p-5 rounded-2xl self-center items-center gap-4 shadow-(--shadow)">
          
          <Image 
            src={imageUrl} 
            alt="Imagem do certificado" 
            width={1000} 
            height={707}
            priority 
          />

          <Link href={pdfUrl} download={`certificado-iduca-${courseId}.pdf`} target="_blank" rel="noopener noreferrer">
            <CuteButton icon={DownloadForOfflineOutlinedIcon} text="Baixar Certificado em PDF" classname="self-end" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default CertificatePage;