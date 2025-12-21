import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex gap-4 mb-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
          isUser ? "bg-orient-purple text-white" : "bg-orient-gold text-white"
        )}
      >
        {isUser ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
          isUser
            ? "bg-orient-purple/10 text-orient-dark rounded-tr-none"
            : "bg-white border border-gray-100 text-gray-700 rounded-tl-none"
        )}
      >
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <div className="text-[10px] text-gray-400 mt-2 text-right opacity-50">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
}
