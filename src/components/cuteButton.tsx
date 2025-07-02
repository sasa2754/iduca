import { SvgIconComponent } from '@mui/icons-material';

interface ICuteButton {
    text?: string,
    icon?: SvgIconComponent,
    onClick?: () => void;
    classname?: string;
    type?: boolean;
    disabled?: boolean
}

export const CuteButton: React.FC<ICuteButton> = ({ text, icon: Icon, onClick, classname, type, disabled }) => {
    return (
        <button type={type ? 'submit' : 'button'} onClick={onClick} className={`border border-(--gray) p-1.5 hover:text-white text-(--text) rounded-lg inline-flex gap-2 hover:bg-(--aquamarine) transition-all duration-100 cursor-pointer ${classname}`}>
          {text && <span className='text-inherit'>{text}</span>}
          {Icon && <Icon sx={{":hover": { color: "inherit" }}}/>}
        </button>
      );
}

