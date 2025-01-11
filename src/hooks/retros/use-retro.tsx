"use client";
import {
  advancePhase,
  getRetro,
  updateTopic,
} from "@/lib/server-actions/retro-actions";
import { Retro } from "@/types/model";
import {
  MutateOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const retroQuery = (retroId: number) =>
  queryOptions({
    queryKey: ["retro", retroId],
    queryFn: () => getRetro(retroId),
  });

export const useRetro = (
  retroId: number,
  options?: Partial<ReturnType<typeof retroQuery>>,
) => {
  return useQuery({
    ...(options || {}),
    ...retroQuery(retroId),
  });
};

export const useAdvancePhase = (retroId: number, opts?: MutateOptions) => {
  return useMutation({
    mutationKey: ["retro", "advancePhase"],
    mutationFn: () => advancePhase(retroId),
    ...(opts || {}),
  });
};

export const useUpdateTopic = (
  retroId: number,
  opts?: MutateOptions<number, Error, number>,
) => {
  return useMutation({
    mutationKey: ["retro", "updateTopic"],
    mutationFn: (topicId: number) => updateTopic(retroId, topicId),
    ...(opts || {}),
  });
};

export const useUpdateCurrentTopic = (retroId: number) => {
  const queryClient = useQueryClient();
  const updateCurrentTopic = (currentTopicId: number) => {
    queryClient.setQueryData(retroQuery(retroId).queryKey, (prev?: Retro) => {
      if (!prev) return undefined;
      return {
        ...prev,
        currentTopicId,
      };
    });
  };
  return { updateCurrentTopic };
};
