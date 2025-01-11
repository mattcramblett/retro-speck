"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Link } from "lucide-react";
import { useState } from "react";

export function LinkCopy() {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const currentUrl = window.location.href;

    setCopied(true);
    await navigator.clipboard.writeText(currentUrl);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div>
      <Button disabled={copied} onClick={onClick} variant="link" size="bare">
        { copied ? <CheckCircle /> : <Link /> }
        {copied ? "Link copied!" : "Copy invite link"}
      </Button>
    </div>
  );
}
