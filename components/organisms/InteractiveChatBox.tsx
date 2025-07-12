import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ImageIcon,
  Brain,
  Sparkles,
  Send,
  Mic,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import ChatMessage from "@/components/molecules/ChatMessage";

const InteractiveChatBox = () => {
  const [mode, setMode] = useState<"text" | "image" | "voice">("text");
  const [demoMessages, setDemoMessages] = useState([
    {
      id: "1",
      content:
        "I've been feeling anxious lately and having trouble sleeping. What can I do?",
      sender: "user" as const,
      timestamp: new Date(),
    },
    {
      id: "2",
      content:
        "I understand you're experiencing anxiety and sleep difficulties. Here are some evidence-based strategies that can help:\n\n• Practice deep breathing exercises\n• Limit screen time before bed\n• Establish a consistent sleep routine",
      sender: "ai" as const,
      timestamp: new Date(),
    },
  ]);
  const [demoInput, setDemoInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [demoMessages]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const handleDemoSendMessage = () => {
    if (!demoInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: demoInput,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setDemoMessages((prev) => [...prev, newMessage]);
    setDemoInput("");

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for sharing that with me. I understand you're asking about "${demoInput}". Here are some helpful suggestions that might benefit you.`,
        sender: "ai" as const,
        timestamp: new Date(),
      };
      setDemoMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleDemoKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleDemoSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        await processVoiceMessage(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const processVoiceMessage = async (audioBlob: Blob) => {
    setIsProcessingVoice(true);

    try {
      const transcribedText = await simulateTranscription(audioBlob);

      const voiceMessage = {
        id: Date.now().toString(),
        content: `🎤 Voice message: "${transcribedText}"`,
        sender: "user" as const,
        timestamp: new Date(),
      };

      setDemoMessages((prev) => [...prev, voiceMessage]);

      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `I heard you say: "${transcribedText}". Based on your voice message, here are some wellness insights that might help you.`,
          sender: "ai" as const,
          timestamp: new Date(),
        };
        setDemoMessages((prev) => [...prev, aiResponse]);
        setIsProcessingVoice(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing voice message:", error);
      setIsProcessingVoice(false);
    }
  };

  const simulateTranscription = async (audioBlob: Blob): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const sampleTranscriptions = [
      "I've been feeling stressed lately and having trouble sleeping",
      "I have a rash on my arm that's been bothering me",
      "I'm looking for advice on improving my diet and exercise routine",
      "I've been experiencing headaches and fatigue",
      "Can you help me with some relaxation techniques?",
    ];
    return sampleTranscriptions[
      Math.floor(Math.random() * sampleTranscriptions.length)
    ];
  };

  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    setIsUploading(true);
    const blobUrl = URL.createObjectURL(file);
    setUploadedImage(blobUrl);
    const imageMessage = {
      id: Date.now().toString(),
      content: `Uploaded image: ${file.name}`,
      sender: "user" as const,
      timestamp: new Date(),
    };
    setDemoMessages((prev) => [...prev, imageMessage]);
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: `I've received your image "${
          file.name
        }". I'm analyzing it now and will provide you with insights shortly. The image appears to be ${
          file.type
        } format with a size of ${(file.size / 1024).toFixed(1)} KB.`,
        sender: "ai" as const,
        timestamp: new Date(),
      };
      setDemoMessages((prev) => [...prev, aiResponse]);
      setIsUploading(false);
    }, 2000);
  };

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

  const renderContent = () => {
    switch (mode) {
      case "text":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  AI Health Assistant
                </p>
                <p className="text-sm text-slate-500">
                  Online now • Powered by sundhed.dk
                </p>
              </div>
            </div>
            <div
              ref={messagesContainerRef}
              className="space-y-4 max-h-64 overflow-y-auto"
            >
              {demoMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                />
              ))}
            </div>
            <div className="flex items-end space-x-2 pt-2 border-t border-slate-200">
              <div className="flex-1">
                <Input
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  onKeyPress={handleDemoKeyPress}
                  placeholder="Type your health question..."
                  className="min-h-[40px] text-sm"
                />
              </div>
              <Button
                onClick={handleDemoSendMessage}
                disabled={!demoInput.trim()}
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Image Upload</p>
                <p className="text-sm text-slate-500">
                  Share photos for AI analysis
                </p>
              </div>
            </div>
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-emerald-200">
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => {
                      window.open(uploadedImage, "_blank");
                    }}
                    title="Click to view full size"
                  >
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
                        <ImageIcon className="w-4 h-4 text-slate-700" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-slate-600">
                        Image uploaded successfully
                      </p>
                      <span className="text-xs text-slate-400">
                        (Click to view full size)
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        URL.revokeObjectURL(uploadedImage!);
                        setUploadedImage(null);
                      }}
                      className="text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                  isDragOver
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-emerald-300 bg-emerald-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <ImageIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <p className="text-slate-700 mb-2">
                  {isDragOver
                    ? "Drop your image here"
                    : "Upload a photo of your symptoms"}
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Drag & drop or click to browse
                </p>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
            {isUploading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-4 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm">Analyzing your image...</span>
                  </div>
                </div>
              </div>
            )}
            <div
              ref={messagesContainerRef}
              className="space-y-4 max-h-32 overflow-y-auto"
            >
              {demoMessages.slice(-2).map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                />
              ))}
            </div>
            {uploadedImage && !isUploading && (
              <div className="flex items-end space-x-2 pt-2 border-t border-slate-200">
                <div className="flex-1">
                  <Input
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    onKeyPress={handleDemoKeyPress}
                    placeholder="Ask about your uploaded image..."
                    className="min-h-[40px] text-sm"
                  />
                </div>
                <Button
                  onClick={handleDemoSendMessage}
                  disabled={!demoInput.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        );
      case "voice":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Voice Message</p>
                <p className="text-sm text-slate-500">Speak naturally to AI</p>
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl p-6 text-center">
              {isRecording ? (
                <div>
                  <motion.div
                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-slate-700 mb-2">
                    Recording... {formatRecordingTime(recordingTime)}
                  </p>
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-emerald-500 rounded-full"
                        animate={{ height: [10, 30, 10] }}
                        transition={{
                          duration: 0.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="bg-white"
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-slate-700 mb-2">
                    Click to start recording
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
                    Speak your health question
                  </p>
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={startRecording}
                    disabled={isProcessingVoice}
                  >
                    Start Recording
                  </Button>
                </div>
              )}
            </div>
            {isProcessingVoice && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-4 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      Processing your voice message...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div
              ref={messagesContainerRef}
              className="space-y-4 max-h-32 overflow-y-auto"
            >
              {demoMessages.slice(-2).map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-emerald-100">
      <motion.div
        key={mode}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -90, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {renderContent()}
      </motion.div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <button
            onClick={() => setMode("text")}
            className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
              mode === "text"
                ? "bg-emerald-100 text-emerald-700"
                : "hover:bg-slate-100"
            }`}
          >
            <MessageCircle className="w-3 h-3" />
            <span>Text</span>
          </button>
          <button
            onClick={() => setMode("image")}
            className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
              mode === "image"
                ? "bg-emerald-100 text-emerald-700"
                : "hover:bg-slate-100"
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Image</span>
          </button>
          <button
            onClick={() => setMode("voice")}
            className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
              mode === "voice"
                ? "bg-emerald-100 text-emerald-700"
                : "hover:bg-slate-100"
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>Voice</span>
          </button>
        </div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default InteractiveChatBox;
