import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Clock, Copy, Download, Image as ImageIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface ImagesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  images: SavedImage[];
  onImagesChange: (images: SavedImage[]) => void;
}

interface SavedImage {
  id: string;
  src: string;
  name: string;
  timestamp: Date;
  conversationId?: string;
}

const ImagesSidebar: React.FC<ImagesSidebarProps> = ({ isOpen, onClose, images, onImagesChange }) => {
  const [copied, setCopied] = useState(false);

  // Load saved images history from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedHistory = localStorage.getItem("zenhealth-images-history");
        if (storedHistory) {
          const parsed = JSON.parse(storedHistory);
          // Convert timestamp strings back to Date objects
          const historyWithDates = parsed.map((image: any) => ({
            ...image,
            timestamp: new Date(image.timestamp),
          }));
          onImagesChange(historyWithDates);
        }
      } catch (error) {
        console.error("Error loading images history:", error);
      }
    }
  }, []);

  const handleCopyImageUrl = async (imageUrl: string) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image URL: ", err);
    }
  };

  const handleDownloadImage = async (image: SavedImage) => {
    try {
      const response = await fetch(image.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = image.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download image: ", err);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    onImagesChange(updatedImages);
    localStorage.setItem("zenhealth-images-history", JSON.stringify(updatedImages));
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
        className={`fixed top-0 right-0 h-full max-w-[600px] w-full bg-white  z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Images</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-600 hover:text-slate-800">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Saved Images History */}
          {images.length > 0 ? (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Saved Images History
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-slate-100 relative">
                      <img
                        src={image.src}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-slate-600 truncate font-medium">{image.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatTimestamp(image.timestamp)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyImageUrl(image.src)}
                            className="text-slate-600 hover:text-slate-800 p-1 h-6 w-6"
                            title="Copy image URL"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadImage(image)}
                            className="text-slate-600 hover:text-slate-800 p-1 h-6 w-6"
                            title="Download image"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteImage(image.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
                          title="Delete image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No images saved yet</p>
                <p className="text-sm text-slate-400 mt-1">Images from conversations will appear here</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 text-center">Images from conversations are automatically saved and persist across sessions</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImagesSidebar;
