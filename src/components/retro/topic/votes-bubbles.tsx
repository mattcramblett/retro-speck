import { Button } from "@/components/ui/button";
import { Vote } from "@/types/model";
import { PlusCircle } from "lucide-react";

export function VoteBubbles({
  label,
  votes,
  onCreate,
  showCreate,
  createEnabled,
}: {
  label: string;
  votes: Vote[];
  onCreate: () => void;
  showCreate?: boolean;
  createEnabled?: boolean;
}) {
  return (
    <div className="flex items-center flex-wrap gap-1.5">
      <div className="text-sm text-muted-foreground">{label}</div>
      {votes.map((v) => (
        <div key={v.id} className="rounded-full w-4 h-4 bg-primary" />
      ))}
      {showCreate && (
        <Button
          variant="icon"
          size="bare"
          onClick={onCreate}
          disabled={createEnabled}
        >
          <PlusCircle className="text-card-foreground" />
        </Button>
      )}
    </div>
  );
}
