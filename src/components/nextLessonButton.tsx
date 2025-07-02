"use client";

import { useRouter } from "next/navigation"
import { CuteButton } from "./cuteButton"
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';


interface INextLessonButton {
  classname?: string,
  href: string,
  type?: boolean
}

export const NextLessonButton = ({classname, href, type} : INextLessonButton) => {
  const router = useRouter();

  return (
    <>
      {type ?
        <CuteButton text="Próxima lição" icon={ArrowForwardOutlinedIcon} classname={`self-start ${classname}`} onClick={() => router.push(href)} />
      :
        <CuteButton type text="Próxima lição" icon={ArrowForwardOutlinedIcon} classname={`self-start ${classname}`} onClick={() => router.push(href)} />
      }
    </>
  );
}
