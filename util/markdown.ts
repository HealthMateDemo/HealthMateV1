import React from "react";

export interface MarkdownConfig {
  boldWords: string[];
  specialTitles: string[];
}

// Default configuration with common wellness and health terms
export const defaultMarkdownConfig: MarkdownConfig = {
  boldWords: [
    // Wellness and Health Terms
    "wellness",
    "health",
    "mental",
    "physical",
    "nutrition",
    "exercise",
    "sleep",
    "stress",
    "anxiety",
    "mindfulness",
    "meditation",
    "therapy",
    "counseling",
    "fitness",
    "diet",
    "vitamins",
    "supplements",
    "medication",
    "treatment",
    "symptoms",
    "diagnosis",
    "prevention",
    "recovery",
    "healing",
    "balance",
    "well-being",
    "guidance",
    "companion",
    "assistant",
    "support",
    "journey",
    "better",
    "instant",
    "personalized",
    "private",
    "available",
    "24/7",
    "free",
    "partnered",
    "sundhed",
    "dk",

    // AI and Technology Terms
    "AI",
    "artificial intelligence",
    "machine learning",
    "algorithm",
    "data",
    "personalized",
    "recommendations",
    "analysis",
    "insights",
    "predictions",

    // Action Words
    "start",
    "begin",
    "explore",
    "discover",
    "learn",
    "improve",
    "enhance",
    "optimize",
    "maximize",
    "achieve",
    "maintain",
    "support",
    "guide",

    // Quality Words
    "evidence-based",
    "scientific",
    "proven",
    "effective",
    "comprehensive",
    "holistic",
    "integrated",
    "professional",
    "expert",
    "specialized",

    // Time and Frequency
    "daily",
    "weekly",
    "monthly",
    "regular",
    "consistent",
    "routine",
    "schedule",
    "timing",
    "frequency",
    "duration",
    "interval",

    // Intensity and Level
    "beginner",
    "intermediate",
    "advanced",
    "expert",
    "mild",
    "moderate",
    "severe",
    "intense",
    "gentle",
    "gradual",
    "progressive",
  ],
  specialTitles: [
    "Choose Your Wellness Focus",
    "Physical Health",
    "Mental Wellness",
    "Start Your Wellness Journey",
    "AI Health Assistant",
    "Personalized Recommendations",
    "Evidence-Based Advice",
    "Comprehensive Support",
    "Wellness Journey",
    "Health Chat",
    "Mental Chat",
    "New Chat",
    "Your Personal AI Health Companion",
    "AI-Powered Wellness Guidance",
    "Learn More",
    "100% Free",
    "No Login Required",
    "Partnered with Sundhed.dk",
  ],
};

export function processMarkdown(text: string, config: MarkdownConfig = defaultMarkdownConfig): string {
  let processedText = text;

  // Make special titles bold
  config.specialTitles.forEach((title) => {
    const regex = new RegExp(`\\b${escapeRegExp(title)}\\b`, "gi");
    processedText = processedText.replace(regex, `**${title}**`);
  });

  // Make bold words bold
  config.boldWords.forEach((word) => {
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, "gi");
    processedText = processedText.replace(regex, `**${word}**`);
  });

  // Process numbered lists with sub-lists
  processedText = processNumberedLists(processedText);

  // Process hyperlinks and emails
  processedText = processLinks(processedText);

  // Process references with quotes
  processedText = processReferences(processedText);

  return processedText;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function processNumberedLists(text: string): string {
  // Match numbered lists with potential sub-lists
  const listRegex = /^(\d+\.\s+.*?)(?=\n\d+\.|$)/gm;

  return text.replace(listRegex, (_match, listItem) => {
    // Process sub-lists with dots
    const subListRegex = /^(\s*[-•]\s+.*?)(?=\n\s*[-•]|\n\d+\.|$)/gm;
    const processedSubList = listItem.replace(subListRegex, (subMatch: string) => {
      return subMatch.replace(/^(\s*)[-•](\s+)/, "$1•$2");
    });

    return processedSubList;
  });
}

function processLinks(text: string): string {
  // Process URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  text = text.replace(urlRegex, "[$1]($1)");

  // Process email addresses
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  text = text.replace(emailRegex, "[$1](mailto:$1)");

  return text;
}

function processReferences(text: string): string {
  // Add quotes around reference-like text
  const referenceRegex = /(?:references?|sources?|citations?|studies?|research):\s*(.*?)(?=\n\n|\n\d+\.|$)/gi;

  return text.replace(referenceRegex, (_match, reference) => {
    return `> ${reference.trim()}`;
  });
}

export function renderMarkdown(text: string, config?: MarkdownConfig): React.ReactElement[] {
  const processedText = processMarkdown(text, config);
  const lines = processedText.split("\n");
  const elements: React.ReactElement[] = [];

  lines.forEach((line, index) => {
    if (line.trim() === "") {
      elements.push(React.createElement("br", { key: index }));
      return;
    }

    // Handle headers
    if (line.startsWith("#")) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const content = line.replace(/^#+\s*/, "");
      const tagName = `h${Math.min(level, 6)}`;
      elements.push(React.createElement(tagName, { key: index, className: "font-bold text-lg mb-2" }, content));
      return;
    }

    // Handle "Additional Resources:" as a header
    if (line.trim() === "**Additional Resources:**") {
      elements.push(React.createElement("h3", { key: index, className: "font-bold text-base mb-2 mt-4 text-slate-800" }, "Additional Resources:"));
      return;
    }

    // Handle blockquotes
    if (line.startsWith(">")) {
      const content = line.slice(1).trim();
      elements.push(
        React.createElement(
          "blockquote",
          {
            key: index,
            className: "border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-2",
          },
          content,
        ),
      );
      return;
    }

    // Handle numbered lists
    if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, "");
      const processedContent = processMixedContent(content);

      // Check if this is a main title (contains bold text)
      if (content.includes("**")) {
        elements.push(React.createElement("h3", { key: index, className: "font-bold text-base mb-2 mt-4 text-slate-800" }, processedContent));
      } else {
        elements.push(React.createElement("li", { key: index, className: "ml-4 mb-1" }, processedContent));
      }
      return;
    }

    // Handle bullet points
    if (/^[•-]\s/.test(line)) {
      const content = line.replace(/^[•-]\s/, "");
      const processedContent = processMixedContent(content);
      elements.push(React.createElement("li", { key: index, className: "ml-2 mb-1 list-disc" }, processedContent));
      return;
    }

    // Handle mixed content (bold text, links, regular text)
    const processedContent = processMixedContent(line);
    elements.push(React.createElement("p", { key: index, className: "mb-2" }, processedContent));
  });

  return elements;
}

function processMixedContent(content: string): React.ReactElement[] {
  const elements: React.ReactElement[] = [];
  let currentIndex = 0;

  // First, split by links to preserve them
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let linkMatch;
  let lastIndex = 0;

  while ((linkMatch = linkRegex.exec(content)) !== null) {
    // Add text before the link
    const textBefore = content.slice(lastIndex, linkMatch.index);
    if (textBefore) {
      elements.push(...processBoldText(textBefore, currentIndex));
      currentIndex += textBefore.length;
    }

    // Add the link
    const linkText = linkMatch[1];
    const linkUrl = linkMatch[2];
    const isEmail = linkUrl.startsWith("mailto:");

    elements.push(
      React.createElement(
        "a",
        {
          key: `link-${currentIndex}`,
          href: linkUrl,
          className: isEmail ? "text-emerald-600 underline hover:text-emerald-800" : "text-blue-600 underline hover:text-blue-800",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        linkText,
      ),
    );
    currentIndex += linkMatch[0].length;
    lastIndex = linkMatch.index + linkMatch[0].length;
  }

  // Add remaining text after the last link
  const remainingText = content.slice(lastIndex);
  if (remainingText) {
    elements.push(...processBoldText(remainingText, currentIndex));
  }

  return elements;
}

function processBoldText(text: string, startIndex: number): React.ReactElement[] {
  const elements: React.ReactElement[] = [];
  const parts = text.split(/(\*\*.*?\*\*)/g);

  parts.forEach((part, partIndex) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      elements.push(
        React.createElement(
          "strong",
          {
            key: `bold-${startIndex + partIndex}`,
            className: "font-bold",
          },
          part.slice(2, -2),
        ),
      );
    } else if (part) {
      elements.push(
        React.createElement(
          "span",
          {
            key: `text-${startIndex + partIndex}`,
          },
          part,
        ),
      );
    }
  });

  return elements;
}
