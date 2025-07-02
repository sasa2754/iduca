import { Card, CardContent, Typography, IconButton } from "@mui/material";
import BusinessIcon from '@mui/icons-material/Business';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface CardCompanyProps {
  id: string;
  name: string;
  onDelete: (id: string) => void;
}

export const CardCompany = ({ id, name, onDelete }: CardCompanyProps) => {
  
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
  };
  
  return (
    <Card 
      className="w-full h-full p-2 flex flex-col border border-(--stroke) rounded-2xl shadow-(--shadow) hover:shadow-md transition-all relative"
    >
      <IconButton 
        onClick={handleDeleteClick}
        size="small"
        className="absolute aspect-square h-10 w-10  text-(--gray) hover:bg-red-100 hover:text-red-600"
        aria-label="deletar empresa"
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>

      <CardContent className="flex flex-col items-center gap-3 p-4 pt-10">
        <div className="p-3 bg-(--lightGray) rounded-full">
          <BusinessIcon fontSize="large" sx={{ color: 'var(--blue)' }} />
        </div>
        <Typography variant="h6" className="text-(--text) font-bold text-center">
          {name}
        </Typography>
        <Typography variant="body2" className="text-(--gray) text-center">
          ID: {id.substring(0, 8)}... 
        </Typography>
      </CardContent>
    </Card>
  );
};