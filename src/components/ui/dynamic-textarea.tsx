import React, { useRef, useEffect } from "react";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

interface DynamicTextareaProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  label?: string;
  placeholder?: string;
  maxHeight?: number;
  disabled?: boolean;
  obfuscate?: boolean;
}

export function DynamicTextarea({
  onChange,
  value,
  label,
  placeholder = "",
  maxHeight = 400,
  disabled = false,
  obfuscate = false,
}: DynamicTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";

      // Calculate the new height
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);

      // Set the new height
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value, maxHeight]);

  return (
    <div className="w-full max-w-md mx-auto">
      {label && (
        <label
          htmlFor="dynamic-textarea"
          className="block text-sm font-medium mb-2"
        >
          {label}
        </label>
      )}
      <Textarea
        id="dynamic-textarea"
        ref={textareaRef}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        readOnly={obfuscate}
        className={cn("transition-all font-medium w-full px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg focus:outline-none resize-none overflow-hidden disabled:hover:cursor-default", obfuscate ? "blur-sm select-none focus:outline-none" : null)}
        style={{ minHeight: "2.5rem" }}
        rows={1}
      />
    </div>
  );
}
