"use client";

import { Dialog, DialogTitle, DialogContent, IconButton, Slide, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface NotifyModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title: string;
}

export const NotifyModal = ({ open, onClose, children, title }: NotifyModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <DialogTitle className="flex bg-(--card) justify-between items-center text-(--text) font-semibold">
        {title}
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: "var(--text)" }} />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent className="flex flex-col max-h-[500px] bg-(--card) gap-2">
        {!children &&
            <p style={{ fontSize: "0.9rem" }}>Você ainda não tem notificações novas!</p>
        }
        {children}
      </DialogContent>
    </Dialog>
  );
};
