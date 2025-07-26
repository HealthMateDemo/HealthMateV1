import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronRight, Clock, Copy, FileText, Save, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface NotesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  conversationId?: string;
}

interface SavedNote {
  id: string;
  content: string;
  timestamp: Date;
  preview: string;
  conversationId?: string;
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({ isOpen, onClose, notes, onNotesChange, conversationId }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [currentEditingNoteId, setCurrentEditingNoteId] = useState<string | null>(null);

  // Update local notes when props change
  React.useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  // Load saved notes history from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedHistory = localStorage.getItem("zenhealth-notes-history");
        if (storedHistory) {
          const parsed = JSON.parse(storedHistory);
          // Convert timestamp strings back to Date objects and filter by conversation
          const historyWithDates = parsed
            .map((note: any) => ({
              ...note,
              timestamp: new Date(note.timestamp),
            }))
            .filter((note: any) => {
              if (!conversationId) {
                // If no conversationId, only show items without conversationId (global items)
                return !note.conversationId;
              }
              // If conversationId exists, only show items for this conversation
              return note.conversationId === conversationId;
            });
          setSavedNotes(historyWithDates);
        }
      } catch (error) {
        console.error("Error loading notes history:", error);
      }
    }
  }, [conversationId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localNotes);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy notes: ", err);
    }
  };

  const handleClear = () => {
    setLocalNotes("");
    setCurrentEditingNoteId(null);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setLocalNotes(localNotes + (localNotes ? "\n\n" : "") + clipboardText);
    } catch (err) {
      console.error("Failed to paste from clipboard: ", err);
    }
  };

  const handleSave = () => {
    onNotesChange(localNotes);

    let updatedHistory: SavedNote[];

    if (currentEditingNoteId) {
      // Update existing note
      updatedHistory = savedNotes.map((note) =>
        note.id === currentEditingNoteId
          ? {
              ...note,
              content: localNotes,
              timestamp: new Date(),
              preview: localNotes.length > 50 ? localNotes.substring(0, 50) + "..." : localNotes,
            }
          : note,
      );
      setCurrentEditingNoteId(null);
    } else {
      // Add new note
      const newSavedNote: SavedNote = {
        id: Date.now().toString(),
        content: localNotes,
        timestamp: new Date(),
        preview: localNotes.length > 50 ? localNotes.substring(0, 50) + "..." : localNotes,
        conversationId: conversationId,
      };
      updatedHistory = [newSavedNote, ...savedNotes.slice(0, 9)]; // Keep last 10 notes
    }

    setSavedNotes(updatedHistory);

    // Save history to localStorage
    localStorage.setItem("zenhealth-notes-history", JSON.stringify(updatedHistory));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadSavedNote = (savedNote: SavedNote) => {
    setLocalNotes(savedNote.content);
    setCurrentEditingNoteId(savedNote.id);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full max-w-[600px] w-full bg-white z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 ${
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
            <Button onClick={handlePaste} variant="outline" size="sm" className="w-full mb-2">
              Paste from clipboard
            </Button>
            <Button onClick={handleSave} variant="default" size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={localNotes === notes}>
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Notes
                </>
              )}
            </Button>
          </div>

          {/* Saved Notes History */}
          {savedNotes.length > 0 && (
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Saved Notes History
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {savedNotes.map((savedNote) => (
                  <div
                    key={savedNote.id}
                    className={`p-3 bg-white rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors ${
                      currentEditingNoteId === savedNote.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
                    }`}
                    onClick={() => loadSavedNote(savedNote)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-600 truncate">{savedNote.preview || "Empty note"}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatTimestamp(savedNote.timestamp)}
                          {currentEditingNoteId === savedNote.id && " (editing)"}
                        </p>
                      </div>
                      <FileText className={`w-4 h-4 ml-2 flex-shrink-0 ${currentEditingNoteId === savedNote.id ? "text-emerald-500" : "text-slate-400"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Textarea */}
          <div className="flex-1 p-4 mb-4">
            <Textarea
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Add your notes here... You can paste copied messages, thoughts, or any other information you want to keep track of."
              className="h-full resize-none border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 text-center">
              {currentEditingNoteId
                ? "Editing existing note - click 'Save Notes' to update"
                : localNotes !== notes
                  ? "Click 'Save Notes' to save your changes"
                  : "Notes are automatically saved and persist across sessions"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesSidebar;
