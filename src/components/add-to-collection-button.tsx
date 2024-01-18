import clsx from "clsx";
import { getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import toast from "react-hot-toast";
import { useFirestore, useFirestoreDocOnce } from "reactfire";
import { useDebounce } from "usehooks-ts";
import { collectionAtom } from "../atoms/collectionAtom";
import { collectionMovieRef } from "../utils/database";
import { MovieDetails, MovieSearchResult } from "../utils/tmdb/tmdb-types";

interface Props {
  movie: MovieSearchResult | MovieDetails;
  loadAddedState?: boolean;
  className?: string;
}

export default function AddToCollectionButton({
  movie,
  loadAddedState,
  className,
}: Props) {
  const { selected } = useAtomValue(collectionAtom);

  const [loading, setLoading] = useState(false);
  const [shouldLoadAddedState] = useState(loadAddedState ?? false);
  const [added, setAdded] = useState(false);

  const debouncedLoading = useDebounce(loading, 100);

  const db = useFirestore();

  const ref = collectionMovieRef(db, selected, movie.id);

  const alreadyInCollection =
    shouldLoadAddedState && useFirestoreDocOnce(ref)?.data?.exists();

  async function add(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();

    try {
      setLoading(true);

      if (!shouldLoadAddedState && (await getDoc(ref)).exists()) {
        toast.success("Movie already added");
        setAdded(true);
        return;
      }

      const genreIds =
        "genreIds" in movie
          ? movie.genreIds
          : movie.genres.map((genre) => genre.id);

      await setDoc(ref, {
        id: movie.id.toString(),
        title: movie.title,
        posterPath: movie.posterPath,
        addedAt: serverTimestamp(),
        releaseDate: movie.releaseDate,
        voteAverage: movie.voteAverage,
        watched: false,
        genreIds,
      });

      toast.success("Movie added");
      setAdded(true);
    } catch (err) {
      toast.error("Failed to add movie");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={clsx(
        "text-xl p-3 disabled:(bg-slate-500 cursor-auto opacity-50) h-fit",
        className,
      )}
      onClick={add}
      disabled={loading || alreadyInCollection || added}
    >
      {debouncedLoading ? (
        <div className="i-ph-circle-notch animate-spin" />
      ) : alreadyInCollection || added ? (
        <div className="flex items-center justify-center gap-x-2">
          <div className="i-ph-check-bold text-green" />{" "}
          {added ? "Added" : "Already added"}
        </div>
      ) : (
        "Add"
      )}
    </button>
  );
}
