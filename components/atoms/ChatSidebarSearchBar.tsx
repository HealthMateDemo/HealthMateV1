import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

interface ChatSidebarSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ChatSidebarSearchBar: React.FC<ChatSidebarSearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-xs text-slate-400" />
        <Input placeholder="Search..." className="pl-8 bg-white border-slate-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
    </div>
  );
};

export default ChatSidebarSearchBar;
