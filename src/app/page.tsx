"use client"
import { Button } from "@/components/ui/button";
import { testAction } from "@/lib/test-actions";

export default function Home() {
  return (
    <main>
      <h1>Retro Speck</h1>
      <Button onClick={() => testAction()}>
        Test Backend 
      </Button>
    </main>
  );
}
