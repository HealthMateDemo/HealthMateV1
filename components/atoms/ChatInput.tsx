import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openImageInNewTab } from "@/util/image-viewer";
import { Send, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: () => void;
  handleImageUpload: (file: File) => void;
  isLoading: boolean;
  isProcessingImage?: boolean;
  uploadedImage?: string | null;
  uploadedImageName?: string | null;
  onRemoveImage?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleImageUpload,
  isLoading,
  isProcessingImage,
  uploadedImage,
  uploadedImageName,
  onRemoveImage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 border-t border-slate-200 bg-white">
      {/* Image Preview */}
      {uploadedImage && (
        <div className="mb-3 relative">
          <div className="bg-slate-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="text-sm text-slate-600">Image uploaded</span>
                {uploadedImageName && <span className="text-xs text-slate-500 font-mono">{uploadedImageName}</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={onRemoveImage} className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
              onClick={() => {
                // Open image in new tab
                openImageInNewTab(uploadedImage, uploadedImageName || "Uploaded Image");
              }}
              title="Click to view full size"
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className={`flex items-end space-x-2 ${isDragOver ? "ring-2 ring-emerald-500 ring-opacity-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex-1">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={uploadedImage ? "Ask about your uploaded image..." : "Type your health question..."}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[44px] resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Upload Button */}
        <Button
          onClick={triggerFileInput}
          variant="outline"
          size="sm"
          className="h-[44px] w-[44px] p-0 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50"
          disabled={isLoading || isProcessingImage}
          title="Upload image"
        >
          {isProcessingImage ? (
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-slate-500" />
          )}
        </Button>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={(!inputMessage.trim() && !uploadedImage) || isLoading}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-[44px] w-[44px] p-0"
        >
          {isLoading ? <LoadingSpinner /> : <Send className="w-4 h-4" />}
        </Button>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {/* Drag overlay hint */}
      {isDragOver && (
        <div className="absolute inset-0 bg-emerald-50 bg-opacity-90 flex items-center justify-center rounded-lg border-2 border-dashed border-emerald-500">
          <div className="text-center">
            <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-emerald-700 font-medium">Drop your image here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
