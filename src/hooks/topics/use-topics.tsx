"use client";
import { getTopics, updateTopic } from "@/lib/server-actions/topic-actions";
import { Topic } from "@/types/model";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { debounce } from "throttle-debounce";

export const topicsQuery = (retroId: number) =>
  queryOptions({
    queryKey: ["retro", retroId, "topics"],
    queryFn: () => getTopics(retroId),
  });

export const useTopics = (
  retroId: number,
  options: Partial<ReturnType<typeof topicsQuery>>,
) => {
  return useQuery({
    ...topicsQuery(retroId),
    ...options,
  });
};

export const useTopic = (retroId: number, topicId: number) => {
  return useQuery({
    ...topicsQuery(retroId),
    select: (topics) => topics.find((t) => t.id === topicId),
  });
};

export const useUpdateTopic = (opts?: { debounce?: boolean }) => {
  const debouncedUpdate = useRef(
    debounce(1000, async (c: Partial<Topic>) => await updateTopic(c)),
  );

  return useMutation({
    mutationKey: ["topic", "update"],
    mutationFn: (topic: Partial<Topic>) =>
      opts?.debounce ? debouncedUpdate.current(topic) : updateTopic(topic),
  });
};
