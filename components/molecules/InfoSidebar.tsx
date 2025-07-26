import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Copy, ExternalLink, Globe, Mail, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface InfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  urls: SavedUrl[];
  emails: SavedEmail[];
  onUrlsChange: (urls: SavedUrl[]) => void;
  onEmailsChange: (emails: SavedEmail[]) => void;
}

interface SavedUrl {
  id: string;
  url: string;
  title: string;
  timestamp: Date;
  conversationId?: string;
}

interface SavedEmail {
  id: string;
  email: string;
  title: string;
  timestamp: Date;
  conversationId?: string;
}

const InfoSidebar: React.FC<InfoSidebarProps> = ({ isOpen, onClose, urls, emails, onUrlsChange, onEmailsChange }) => {
  const [copied, setCopied] = useState<string | null>(null);

  // Load saved URLs and emails from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Load URLs
        const storedUrls = localStorage.getItem("zenhealth-urls-history");
        if (storedUrls) {
          const parsed = JSON.parse(storedUrls);
          const urlsWithDates = parsed.map((url: any) => ({
            ...url,
            timestamp: new Date(url.timestamp),
          }));
          onUrlsChange(urlsWithDates);
        }

        // Load emails
        const storedEmails = localStorage.getItem("zenhealth-emails-history");
        if (storedEmails) {
          const parsed = JSON.parse(storedEmails);
          const emailsWithDates = parsed.map((email: any) => ({
            ...email,
            timestamp: new Date(email.timestamp),
          }));
          onEmailsChange(emailsWithDates);
        }
      } catch (error) {
        console.error("Error loading info from localStorage:", error);
      }
    }
  }, []);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
    }
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(email);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy email: ", err);
    }
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDeleteUrl = (urlId: string) => {
    const updatedUrls = urls.filter((url) => url.id !== urlId);
    onUrlsChange(updatedUrls);
    localStorage.setItem("zenhealth-urls-history", JSON.stringify(updatedUrls));
  };

  const handleDeleteEmail = (emailId: string) => {
    const updatedEmails = emails.filter((email) => email.id !== emailId);
    onEmailsChange(updatedEmails);
    localStorage.setItem("zenhealth-emails-history", JSON.stringify(updatedEmails));
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  const totalCount = urls.length + emails.length;

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full max-w-[600px] w-full bg-white z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Additional Resources</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-600 hover:text-slate-800">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full overflow-y-auto">
          {totalCount > 0 ? (
            <>
              {/* URLs Section */}
              {urls.length > 0 && (
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    URLs ({urls.length})
                  </h3>
                  <div className="space-y-2">
                    {urls.map((url) => (
                      <div key={url.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{url.title}</p>
                            <p className="text-xs text-blue-600 truncate mt-1">{url.url}</p>
                            <p className="text-xs text-slate-400 mt-1">{formatTimestamp(url.timestamp)}</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenUrl(url.url)} className="text-blue-600 hover:text-blue-700 p-1 h-6 w-6" title="Open URL">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleCopyUrl(url.url)} className="text-slate-600 hover:text-slate-800 p-1 h-6 w-6" title="Copy URL">
                              {copied === url.url ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUrl(url.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
                              title="Delete URL"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emails Section */}
              {emails.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Addresses ({emails.length})
                  </h3>
                  <div className="space-y-2">
                    {emails.map((email) => (
                      <div key={email.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{email.title}</p>
                            <p className="text-xs text-emerald-600 truncate mt-1">{email.email}</p>
                            <p className="text-xs text-slate-400 mt-1">{formatTimestamp(email.timestamp)}</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyEmail(email.email)}
                              className="text-slate-600 hover:text-slate-800 p-1 h-6 w-6"
                              title="Copy email"
                            >
                              {copied === email.email ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEmail(email.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
                              title="Delete email"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No resources saved yet</p>
                <p className="text-sm text-slate-400 mt-1">URLs and emails from AI responses will appear here</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 mt-auto">
            <p className="text-xs text-slate-500 text-center">URLs and email addresses from AI responses are automatically saved and persist across sessions</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoSidebar;
