import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  content: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ content, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-full transition-colors duration-200 hover:bg-slate-200 ${className}`}
      title={copied ? "Copied!" : "Copy message"}
      aria-label={copied ? "Copied!" : "Copy message"}
    >
      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500 hover:text-slate-700" />}
    </button>
  );
};

export default CopyButton;
