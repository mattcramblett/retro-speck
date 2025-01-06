"use client";
import {
  createVote,
  getVotes,
  removeVote,
} from "@/lib/server-actions/vote-actions";
import { Vote } from "@/types/model";
import {
  queryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const voteQuery = (retroId: number) =>
  queryOptions({
    queryKey: ["retro", retroId, "votes"],
    queryFn: () => getVotes(retroId),
  });

export function useVotes(
  retroId: number,
  opts?: Partial<ReturnType<typeof voteQuery>>,
) {
  return useQuery({
    ...(opts || {}),
    ...voteQuery(retroId),
  });
}

export const useCreateVote = (
  opts?: UseMutationOptions<Vote, Error, number>,
) => {
  return useMutation({
    mutationKey: ["vote", "create"],
    mutationFn: (topicId: number) => createVote(topicId),
    ...(opts || {}),
  });
};

export const useDeleteVote = (
  opts?: UseMutationOptions<void, Error, number>,
) => {
  return useMutation({
    mutationKey: ["vote", "delete"],
    mutationFn: (voteId: number) => removeVote(voteId),
    ...(opts || {}),
  });
};

export const useSyncNewVote = (retroId: number) => {
  const queryClient = useQueryClient();

  return {
    sync: ({
      voteId,
      topicId,
      participantId,
    }: {
      voteId: number;
      topicId: number;
      participantId: number;
    }) => {
      queryClient.setQueryData(
        voteQuery(retroId).queryKey,
        (oldVotes: Vote[] | undefined) => {
          if (oldVotes === undefined) return undefined;

          const vote = {
            id: voteId,
            topicId: topicId,
            participantId: participantId,
            retroId,
            createdAt: new Date().toISOString(),
          } as Vote;
          return [...oldVotes, vote];
        },
      );
    },
  };
};

export const useSyncRemovedVote = (retroId: number) => {
  const queryClient = useQueryClient();

  return {
    sync: ({
      voteId,
    }: {
      voteId: number;
    }) => {
      queryClient.setQueryData(
        voteQuery(retroId).queryKey,
        (oldVotes: Vote[] | undefined) => {
          if (oldVotes === undefined) return undefined;

          return oldVotes.filter((v) => v.id !== voteId);
        },
      );
    },
  };
};
