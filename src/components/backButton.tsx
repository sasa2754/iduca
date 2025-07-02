"use client";

import { useRouter } from "next/navigation"
import { CuteButton } from "./cuteButton"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface IBackButton {
  classname?: string
}

export const BackButton = ({classname} : IBackButton) => {
  const router = useRouter();

  return (
    <CuteButton icon={ArrowBackIcon} classname={`self-start ${classname}`} onClick={() => router.back()} />
  );
}
