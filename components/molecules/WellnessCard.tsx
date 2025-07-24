import React from "react";

interface WellnessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string; // e.g. 'from-emerald-500 to-teal-500'
  onClick: () => void;
  ctaText: string;
  ctaColorClass: string; // e.g. 'text-emerald-600'
}

const WellnessCard: React.FC<WellnessCardProps> = ({ title, description, icon, colorClass, onClick, ctaText, ctaColorClass }) => (
  <div className="group cursor-pointer h-full" onClick={onClick}>
    <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 h-full flex flex-col`}>
      <div className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 mb-4 flex-grow">{description}</p>
      <div className={`flex items-center font-medium ${ctaColorClass} mt-auto`}>
        <span>{ctaText}</span>
        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  </div>
);

export default WellnessCard;
