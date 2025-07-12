import React from "react";
import { LucideIcon } from "lucide-react";

interface PartnerLogoProps {
  icon: LucideIcon;
  name: string;
  bgColor: string;
  className?: string;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({
  icon: Icon,
  name,
  bgColor,
  className = ""
}) => {
  return (
    <div className={`flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity ${className}`}>
      <div className={`w-8 h-8 ${bgColor} rounded flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="font-semibold text-slate-700">{name}</span>
    </div>
  );
};

export default PartnerLogo; 