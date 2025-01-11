"use client";
import {
  getTopic,
  getTopics,
  updateTopic,
} from "@/lib/server-actions/topic-actions";
import { Topic } from "@/types/model";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import { debounce } from "throttle-debounce";
import { useVotes } from "../votes/use-votes";

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

export const useTopic = (
  retroId: number,
  topicId: number,
  options?: Partial<ReturnType<typeof topicsQuery>>,
) => {
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
    queryClient.setQueryData(
      queryOpts.queryKey,
      (prev: Topic[] | undefined) => {
        if (prev === undefined) return prev;
        const topicId = data.id;
        const result = prev?.map((t) => (t.id === topicId ? data : t));
        return result;
      },
    );
  };

  return useMutation({
    mutationKey: ["topic", "refresh"],
    mutationFn: (topicId: number) => getTopic(topicId),
    onSuccess: handleRefreshTopic,
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

export const useVotedTopics = (
  retroId: number,
  options?: Partial<ReturnType<typeof topicsQuery>>,
) => {
  const { data: topics } = useTopics(retroId, options || {});
  const { data: votes } = useVotes(retroId);

  const data = useMemo(() => {
    if (!topics || !votes) {
      return [];
    }
    // Tally votes per topic id
    const scores = votes.reduce((acc: Record<number, number>, curr) => {
      acc[curr.topicId] ||= 0;
      acc[curr.topicId] += 1;
      return acc;
    }, {});
    // Sort by vote tally, descending
    return topics.sort(
      (topicA, topicB) => (scores[topicB.id] || 0) - (scores[topicA.id] || 0),
    );
  }, [topics, votes]);

  const getTopicIndex = (topicId: number) =>
    data.map((topic) => topic.id).indexOf(topicId);

  return { data, getTopicIndex };
};
