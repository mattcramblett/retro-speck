"use client";
import { DynamicTextarea } from "@/components/ui/dynamic-textarea";
import { useState } from "react";

export function RetroCard({ content }: { content: string | null | undefined }) {
  const [value, setValue] = useState(content || "");

  return (
    <DynamicTextarea
      value={value}
      onChange={(e) => setValue(e.target.value || "")}
    />
  );
}
