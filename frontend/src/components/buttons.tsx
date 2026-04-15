import { ReactComponent as ArrowForward } from '../assets/arrow_forward.svg';

interface StandardButtonProps {
  padding?: string;
  textSize?: string;
  color?: string;
  text: string;
  textColor?: string;
  onclick?: () => void;
}

export default function StandardButton({ padding = "px-4 py-2", textSize = "text-sm", color = "bg-primary hover:bg-green-600", text, onclick }: StandardButtonProps) {
  return (
    <div className={`${padding} ${textSize} ${color} flex flex-row justify-between items-center text-white rounded-lg cursor-pointer transition-colors duration-300`} 
    onClick={onclick}>
      {text}
      <ArrowForward className="ml-2 w-4 h-4" />
    </div>
  )
}

export function SecondaryButton({ padding = "px-4 py-2", textColor = "text-primary", textSize = "text-sm", color = "bg-neutral-300 hover:bg-secondaryBackground/80", text, onclick }: StandardButtonProps) {
  return (
    <div className={`${padding} ${textSize} ${color} mt-6 flex flex-row 
    justify-between items-center ${textColor} rounded-full 
    cursor-pointer transition-colors duration-300
    font-semibold`} onClick={onclick}>
      {text}
    </div>
  )
}

