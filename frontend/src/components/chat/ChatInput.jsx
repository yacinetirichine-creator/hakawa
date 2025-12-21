import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Écris ton message...",
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-2 focus-within:ring-2 focus-within:ring-orient-gold/50 transition-all">
        <div className="pl-3 pb-3 text-orient-gold">
          <Sparkles className="w-5 h-5" />
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-sm text-gray-700 placeholder:text-gray-400"
          style={{ minHeight: "44px" }}
        />

        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || disabled}
          className="rounded-full w-10 h-10 mb-1"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center mt-2 text-xs text-gray-400">
        Appuie sur Entrée pour envoyer, Shift+Entrée pour sauter une ligne
      </div>
    </form>
  );
}
