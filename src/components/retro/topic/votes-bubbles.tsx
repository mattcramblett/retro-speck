import { Button } from "@/components/ui/button";
import { Vote } from "@/types/model";
import { PlusCircle } from "lucide-react";

export function VoteBubbles({
  label,
  votes,
  onCreate,
  onRemove,
  isActiveVoting,
  createEnabled,
  removeEnabled,
}: {
  label: string;
  votes: Vote[];
  onCreate: () => void;
  onRemove: (voteId: number) => void;
  isActiveVoting?: boolean;
  createEnabled?: boolean;
  removeEnabled?: boolean;
}) {
  return (
    <div className="flex items-center flex-wrap gap-1.5">
      <div className="text-sm text-muted-foreground">{label}</div>
      {isActiveVoting && (
        <Button
          variant="icon"
          size="bare"
          onClick={onCreate}
          disabled={!createEnabled}
        >
          <PlusCircle className="text-card-foreground" />
        </Button>
      )}
      {votes.map((v) => (
        <Button
          key={v.id}
          variant="icon"
          size="bare"
          className="rounded-full w-4 h-4 bg-primary disabled:opacity-100 hover:bg-primary/60 transition-all"
          onClick={() => onRemove(v.id)}
          disabled={!removeEnabled || !isActiveVoting}
        />
      ))}
    </div>
  );
}
