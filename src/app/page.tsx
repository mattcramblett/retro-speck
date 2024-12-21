"use client"
import { Button } from "@/components/ui/button";
import { testAction } from "@/lib/test-actions";

export default function Home() {
  return (
    <main>
      <Button onClick={() => testAction()}>
        Test Backend 
      </Button>
    </main>
  );
}
