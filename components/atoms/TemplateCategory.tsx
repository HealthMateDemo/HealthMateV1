import { Globe, Heart, Leaf } from "lucide-react";
import React from "react";

type TemplateType = "global" | "health" | "mindfull";

interface TemplateCategoryProps {
  template: TemplateType;
  children: React.ReactNode;
  className?: string;
}

const TemplateCategory: React.FC<TemplateCategoryProps> = ({ template, children, className = "" }) => {
  const getTemplateStyles = (templateType: TemplateType): string => {
    switch (templateType) {
      case "global":
        return "bg-emerald-300 text-green-800";
      case "health":
        return "bg-green-300 text-emerald-800";
      case "mindfull":
        return "bg-sky-300 text-blue-800";
      default:
        return "bg-emerald-300 text-green-800"; // Default to global template
    }
  };

  const getTemplateIcon = (templateType: TemplateType) => {
    switch (templateType) {
      case "global":
        return <Globe className="w-3 h-3" />;
      case "health":
        return <Heart className="w-3 h-3" />;
      case "mindfull":
        return <Leaf className="w-3 h-3" />;
      default:
        return <Globe className="w-3 h-3" />; // Default to global icon
    }
  };

  const baseStyles = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
  const templateStyles = getTemplateStyles(template);
  const templateIcon = getTemplateIcon(template);

  return (
    <span className={`${baseStyles} ${templateStyles} ${className}`}>
      {templateIcon}
      {children}
    </span>
  );
};

export default TemplateCategory;
