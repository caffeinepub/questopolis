import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Answer } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function usePlayerProgress() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ["playerProgress", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      const principal = identity?.getPrincipal();
      if (!principal) return null;
      return actor.getPlayerProgress(principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLevel(levelId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["level", levelId?.toString()],
    queryFn: async () => {
      if (!actor || levelId === null) return null;
      return actor.getLevel(levelId);
    },
    enabled: !!actor && !isFetching && levelId !== null,
  });
}

export function useSubmitAnswers() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      levelId,
      answers,
    }: { levelId: bigint; answers: Answer[] }) => {
      if (!actor) throw new Error("No actor available");
      return actor.submitAnswers(levelId, answers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playerProgress", identity?.getPrincipal().toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useResetLevel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (levelId: bigint) => {
      if (!actor) throw new Error("No actor available");
      return actor.resetLevel(levelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playerProgress", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useSetDisplayName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor available");
      return actor.setDisplayName(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["playerProgress", identity?.getPrincipal().toString()],
      });
    },
  });
}
