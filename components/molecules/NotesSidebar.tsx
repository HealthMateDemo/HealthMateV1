import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronRight, Copy, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface NotesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({ isOpen, onClose, notes, onNotesChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy notes: ", err);
    }
  };

  const handleClear = () => {
    onNotesChange("");
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      onNotesChange(notes + (notes ? "\n\n" : "") + clipboardText);
    } catch (err) {
      console.error("Failed to paste from clipboard: ", err);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full max-w-[600px] w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Notes</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="text-slate-600 hover:text-slate-800" title="Copy all notes">
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-slate-600 hover:text-red-600" title="Clear all notes">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-600 hover:text-slate-800">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200">
            <Button onClick={handlePaste} variant="outline" size="sm" className="w-full">
              Paste from clipboard
            </Button>
          </div>

          {/* Textarea */}
          <div className="flex-1 p-4">
            <Textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add your notes here... You can paste copied messages, thoughts, or any other information you want to keep track of."
              className="h-full resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">Notes are automatically saved and persist across sessions</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesSidebar;
