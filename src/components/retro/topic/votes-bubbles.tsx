import { Button } from "@/components/ui/button";
import { Vote } from "@/types/model";
import { PlusCircle } from "lucide-react";

export function VoteBubbles({
  label,
  votes,
  onCreate,
  onRemove,
  showCreate,
  buttonsEnabled,
}: {
  label: string;
  votes: Vote[];
  onCreate: () => void;
  onRemove: () => void;
  showCreate?: boolean;
  buttonsEnabled?: boolean;
}) {
  return (
    <div className="flex items-center flex-wrap gap-1.5">
      <div className="text-sm text-muted-foreground">{label}</div>
      {votes.map((v) => (
        <div
          key={v.id}
          className="rounded-full w-4 h-4 bg-primary hover:bg-primary/60 transition-all"
          onClick={() => buttonsEnabled ? onRemove() : null}
        />
      ))}
      {showCreate && (
        <Button
          variant="icon"
          size="bare"
          onClick={onCreate}
          disabled={buttonsEnabled}
        >
          <PlusCircle className="text-card-foreground" />
        </Button>
      )}
    </div>
  );
}
