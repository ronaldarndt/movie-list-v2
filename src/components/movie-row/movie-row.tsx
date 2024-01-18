import clsx from "clsx";
import { deleteDoc, updateDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { Link } from "react-router-dom";
import { useFirestore } from "reactfire";
import { collectionAtom } from "../../atoms/collectionAtom";
import { CollectionMovie, collectionMovieRef } from "../../utils/database";
import { Genre } from "../../utils/tmdb/tmdb-types";
import ButtonWithConfirm from "../button-with-confirm";
import MoviePoster from "../movie-poster";

interface Props {
  movie: CollectionMovie;
  mode: "list" | "grid";
  genres?: Genre[];
}

export default function MovieRow({ movie, mode, genres }: Props) {
  const { selected } = useAtomValue(collectionAtom);

  const db = useFirestore();

  function handleDelete(id: string) {
    const ref = collectionMovieRef(db, selected, id);

    deleteDoc(ref);
  }

  return (
    <Link
      to={`/list/movie/${movie.id}`}
      key={movie.id}
      className={clsx(
        "flex gap-x-2 items-center bg-slate-600 hover:bg-slate-500 rounded p-2 decoration-none",
        mode === "list" ? "flex-row" : "flex-col w-64",
        movie.watched && "filter-grayscale",
      )}
    >
      <MoviePoster size="sm" path={movie.posterPath} title={movie.title} />
      <div className="flex flex-col w-100% pr-2">
        <h2 className="flex justify-between items-start mt-1">
          {movie.title}

          <div>
            <button
              className="w-7 h-7 flex items-center justify-center mr-2"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                updateDoc(collectionMovieRef(db, selected, movie.id), {
                  watched: !movie.watched,
                });
              }}
            >
              <div
                className={clsx(
                  "text-xl",
                  movie.watched ? "i-ph-eye-slash" : "i-ph-eye ",
                )}
              />
            </button>

            <ButtonWithConfirm
              onConfirm={() => handleDelete(movie.id)}
              className="w-7 h-7 flex items-center justify-center"
            >
              {(confirm) => (
                <div
                  className={clsx(
                    "text-red text-xl",
                    confirm ? "i-ph-check" : "i-ph-trash-bold",
                  )}
                />
              )}
            </ButtonWithConfirm>
          </div>
        </h2>

        <div className="flex flex-row justify-between items-center">
          <h3>{new Date(movie.releaseDate).toLocaleDateString()}</h3>
          {movie.voteAverage.toFixed(2)}⭐
        </div>

        <div className="flex flex-row justify-end items-center">
          {movie.genreIds
            ?.map((x) => genres?.find((y) => y.id === x))
            .filter(Boolean)
            .map((genre) => <div className="badge">{genre?.name}</div>)}
        </div>
      </div>
    </Link>
  );
}
