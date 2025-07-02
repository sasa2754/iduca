import { Menu } from "@/src/components/menu";
import Image from "next/image";
import certificado from "../../../../public/image/image.png";
import { CuteButton } from "@/src/components/cuteButton";
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import { BackButton } from "@/src/components/backButton";

interface ICertificate {
  params: {
    certificateId: string;
  };
}

const Certificate = async ({ params }: ICertificate) => {
  const { certificateId } = params;
  return (
    <>
      <Menu />

      <div className="flex flex-col md:px-20 lg:px-40 px-2 py-10 gap-8">
        {/* Title */}
        <div className="flex md:flex-row flex-col gap-5 items-center p-1 md:items-start">
          <BackButton />
          <h1 className="md:text-2xl text-xl font-bold text-(--text) text-center">
            Certificado do Curso de Marketing Digital {certificateId}
          </h1>
        </div>

        {/* Certificate */}
        <div className="flex bg-(--card) xl:max-w-8/12 border border-(--stroke) flex-col p-5 rounded-2xl self-center items-center gap-4 shadow-(--shadow)">
          <Image src={certificado} alt="certificado" width={1000} height={1000} priority />
          <CuteButton icon={DownloadForOfflineOutlinedIcon} text="Baixar Certificado" classname="self-end" />
        </div>
      </div>
    </>
  );
};

export default Certificate;
