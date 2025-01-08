"use client";
import { getTopic, getTopics, updateTopic } from "@/lib/server-actions/topic-actions";
import { Topic } from "@/types/model";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useTopic = (retroId: number, topicId: number, options?: Partial<ReturnType<typeof topicsQuery>>) => {
  return useQuery({
    ...topicsQuery(retroId),
    ...(options || {}),
    select: (topics) => topics.find((t) => t.id === topicId),
  });
};

export const useRefreshTopic = (retroId: number) => {
  const queryClient = useQueryClient();
  const queryOpts = topicsQuery(retroId);

  const handleRefreshTopic = (data: Topic) => {
    queryClient.setQueryData(queryOpts.queryKey, (prev: Topic[] | undefined) => {
      if (prev === undefined) return prev;
      const topicId = data.id;
      const result = prev?.map((t) => (t.id === topicId ? data : t));
      return result;
    });
  };

  return useMutation({
    mutationKey: ["topic", "refresh"],
    mutationFn: (topicId: number) => getTopic(topicId),
    onSuccess: handleRefreshTopic,
  });
}

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
