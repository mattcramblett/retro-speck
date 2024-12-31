import { Button } from "@/components/ui/button";
import { InputBare } from "@/components/ui/input";
import { useUpdateTopic } from "@/hooks/topics/use-topics";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Topic } from "@/types/model";
import { CircleChevronUp } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

export function TopicTitle({
  topic,
  onToggleExpand,
  isExpanded,
}: {
  topic: Topic;
  onToggleExpand: () => void;
  isExpanded: boolean;
}) {
  const [topicTitle, setTopicTitle] = useState(topic.name);
  const { mutate: updateTopic, isError } = useUpdateTopic({ debounce: true });

  const { toast } = useToast();
  if (isError) {
    toast({
      variant: "destructive",
      title: "Unable to update topic name",
      description: "Please refresh the page and try again.",
    });
  }

  useEffect(() => setTopicTitle(topic.name), [topic.name]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value || "";
    setTopicTitle(newTitle);
    updateTopic({ id: topic.id, name: newTitle }); // Send debounced update to server
  };

  return (
    <div className="flex items-center gap-2 pb-1">
      <Button variant="icon" size="bare" onClick={onToggleExpand}>
        <CircleChevronUp
          size={16}
          className={cn("transition-all", isExpanded ? null : "rotate-180")}
        />
      </Button>
      <InputBare
        value={topicTitle || ""}
        className="font-bold text-md"
        placeholder="Untitled topic"
        onChange={handleTitleChange}
      />
    </div>
  );
}
