import { Button } from "@/components/ui/button";
import { StickyNote } from "lucide-react";
import React from "react";

interface NotesProps {
  onClick: () => void;
  isOpen: boolean;
}

const Notes: React.FC<NotesProps> = ({ onClick, isOpen }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`mt-2 transition-all duration-200 ${isOpen ? "bg-emerald-100 border-emerald-300 text-emerald-700" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"}`}
    >
      <StickyNote className="w-4 h-4 mr-2" />
      Notes
    </Button>
  );
};

export default Notes;
