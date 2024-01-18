import { useQuery } from "@tanstack/react-query";
import { tmdbRequest } from "../utils/request";
import { Configurations } from "../utils/tmdb/tmdb-types";

export default function useConfig({ enabled = true } = {}) {
  const { data, ...query } = useQuery({
    queryKey: ["config"],
    queryFn: () => tmdbRequest<Configurations>("/configuration"),
    staleTime: 12 * 60 * 60 * 1000,
    enabled,
  });

  const basePosterPath =
    (data?.images.secureBaseUrl ?? "") + data?.images.posterSizes?.[0];

  const originalPosterPath =
    (data?.images.secureBaseUrl ?? "") + data?.images.posterSizes?.at(-1);

  const baseBackdropPath =
    (data?.images.secureBaseUrl ?? "") + data?.images.backdropSizes?.[3];

  return {
    data,
    basePosterPath,
    originalPosterPath,
    baseBackdropPath,
    ...query,
  } as const;
}
