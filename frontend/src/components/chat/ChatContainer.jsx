import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Loader } from "../ui/Loader";
import { motion } from "framer-motion";

export function ChatContainer({
  messages,
  onSendMessage,
  isLoading,
  placeholder,
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 opacity-50">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">✨</span>
            </div>
            <p>La magie commence ici...</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-orient-gold flex items-center justify-center shrink-0">
              <Loader size="sm" className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-white/50">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={onSendMessage}
            disabled={isLoading}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
}
