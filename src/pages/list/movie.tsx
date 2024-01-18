import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRef } from "preact/hooks";
import { Navigate, useParams } from "react-router-dom";
import { useIntersectionObserver } from "usehooks-ts";
import AddToCollectionButton from "../../components/add-to-collection-button";
import MoviePoster from "../../components/movie-poster";
import useConfig from "../../hooks/use-config";
import { tmdbRequest } from "../../utils/request";
import { MovieCredits, MovieDetails } from "../../utils/tmdb/tmdb-types";
import styles from "./movie.module.css";

export function Component() {
  const { id } = useParams();

  const movieQuery = useQuery({
    queryKey: ["movie", id],
    queryFn: () => tmdbRequest<MovieDetails>(`/movie/${id}?language=pt-BR`),
    staleTime: 15 * 60 * 1000,
    enabled: !!id,
  });

  const castQuery = useQuery({
    queryKey: ["movie", id, "cast"],
    queryFn: () =>
      tmdbRequest<MovieCredits>(`/movie/${id}/credits?language=pt-BR`),
    staleTime: 15 * 60 * 1000,
    enabled: !!id,
  });

  const castRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);

  const first = useIntersectionObserver(firstRef, {});
  const last = useIntersectionObserver(lastRef, {});

  if (!id) return <Navigate to="/list" />;

  const { originalPosterPath } = useConfig();

  if (movieQuery.isLoading) {
    return <h1>Loading...</h1>;
  }

  const movie = movieQuery.data;

  if (!movie) return <h1>Movie not found</h1>;

  const scrollAmount = window.innerWidth * 0.4;

  return (
    <div className="flex flex-col items-center relative">
      <MoviePoster
        size="lg"
        className="object-contain absolute"
        height={window.innerHeight * 0.3}
        path={movie.posterPath}
      />
      <h1
        className="z-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]"
        style={{
          marginTop: window.innerHeight * 0.2,
          marginBottom: window.innerHeight * 0.08,
        }}
      >
        {movie.title}
      </h1>
      <h2 className="m-0 mt-4">Overview</h2>
      <p>{movie.overview}</p>

      <div className="mb-4">
        {movie.genres.map((genre) => (
          <div className="badge">{genre?.name}</div>
        ))}
      </div>
      <AddToCollectionButton movie={movie} loadAddedState />

      <div className="flex justify-between w-100%">
        <div className="flex flex-col">
          <h2 className="font-bold mb-0">Information</h2>
          <div className="flex flex-col">
            <p className="mb-0">
              <b>Rating:</b> {movie.voteAverage.toFixed(2)}⭐
            </p>
            <p className="mb-0 mt-1">
              <b>Launch date:</b>{" "}
              {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
            <p className="mb-0 mt-1">
              <b>Budget:</b>{" "}
              {movie.budget.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col relative w-100%">
        <h2>Cast</h2>

        <div
          className={clsx(
            "flex gap-x-4 overflow-hidden overflow-x-auto",
            styles.cast,
          )}
          ref={castRef}
        >
          {castQuery.data?.cast.map((cast, i, arr) => (
            <div
              className="flex flex-col items-center"
              ref={i === 0 ? firstRef : i === arr.length - 1 ? lastRef : null}
            >
              <img
                src={
                  cast.profilePath
                    ? originalPosterPath + cast.profilePath
                    : "https://placehold.co/250x350"
                }
                className="object-contain"
                height={window.innerHeight * 0.2}
                loading="lazy"
              />
              <p className="m-0 p-0 text-center">{cast.name}</p>
              <h3 className="m-0 p-0 text-center">{cast.character}</h3>
            </div>
          ))}
        </div>

        {!first?.isIntersecting ? (
          <button
            className="unstyled"
            onClick={() =>
              castRef.current?.scrollBy({
                left: -scrollAmount,
                behavior: "smooth",
              })
            }
          >
            <div className="i-ph-caret-left-bold text-4xl absolute left-0 top-35% p-8" />
          </button>
        ) : null}

        {!last?.isIntersecting ? (
          <button
            className="unstyled"
            onClick={() =>
              castRef.current?.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
              })
            }
          >
            <div className="i-ph-caret-right-bold text-4xl absolute right-0 top-35% p-8" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
