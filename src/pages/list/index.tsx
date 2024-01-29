import useIsMobile from "@/hooks/use-is-mobile";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { orderBy, query } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useState } from "preact/hooks";
import { Navigate } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collectionAtom } from "../../atoms/collectionAtom";
import MovieRow from "../../components/movie-row";
import { collectionMoviesRef } from "../../utils/database";
import { tmdbRequest } from "../../utils/request";
import { Genres } from "../../utils/tmdb/tmdb-types";

export function Component() {
  const { selected } = useAtomValue(collectionAtom);

  const isMobile = useIsMobile();

  const [mode, setMode] = useState<"list" | "grid">(isMobile ? "grid" : "list");

  if (!selected) return <Navigate to="/collections" />;

  const db = useFirestore();

  const { data, status } = useFirestoreCollectionData(
    query(
      collectionMoviesRef(db, selected),
      orderBy("watched", "asc"),
      orderBy("addedAt", "desc"),
    ),
  );

  const { data: genresQuery } = useQuery({
    queryKey: ["genres"],
    queryFn: () => tmdbRequest<Genres>("/genre/movie/list?language=pt-BR"),
    staleTime: 60 * 60 * 1000,
  });

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  const watched = data.filter((x) => x.watched);
  const showGrid = mode === "grid" || isMobile;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <h1>Movies</h1>

        {!isMobile ? (
          <div>
            <button
              className={clsx(mode === "list" ? "bg-gray-600!" : undefined)}
              onClick={() => setMode("list")}
            >
              <div className="i-ph-list text-2xl" />
            </button>
            <button
              className={clsx(
                "ml-1",
                mode === "grid" ? "bg-gray-600!" : undefined,
              )}
              onClick={() => setMode("grid")}
            >
              <div className="i-ph-squares-four text-2xl" />
            </button>
          </div>
        ) : null}
      </div>

      <div
        className={clsx(
          "gap-8",
          !showGrid
            ? "flex-col gap-y-4"
            : "flex-row flex-wrap justify-center md:justify-start",
        )}
      >
        {data
          .filter((x) => !x.watched)
          .map((movie) => (
            <MovieRow
              genres={genresQuery?.genres}
              mode={mode}
              movie={movie}
              key={movie.id}
            />
          ))}
      </div>

      {watched.length ? (
        <>
          <h1>Watched</h1>

          <div
            className={clsx(
              "gap-8",
              !showGrid
                ? "flex-col gap-y-4"
                : "flex-row flex-wrap justify-center md:justify-start",
            )}
          >
            {watched.map((movie) => (
              <MovieRow
                genres={genresQuery?.genres}
                mode={mode}
                movie={movie}
                key={movie.id}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="pb-8" />
    </div>
  );
}

Component.displayName = "List";
