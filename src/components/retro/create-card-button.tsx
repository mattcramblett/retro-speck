import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export function CreateCardButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button
      variant="outline"
      className="w-full min-h-10"
      onClick={onClick}
      disabled={disabled}
    >
      <Plus />
    </Button>
  );
}
