import { collectionAtom } from "@/atoms/collectionAtom";
import {
  CollectionMovie,
  collectionMovieRef,
  collectionMovieReviewsRef,
} from "@/utils/database";
import clsx from "clsx";
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAtomValue } from "jotai";
import { nanoid } from "nanoid";
import { JSX } from "preact/jsx-runtime";
import Modal from "react-responsive-modal";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import ButtonWithConfirm from "../button-with-confirm";
import MoviePoster from "../movie-poster";

interface Props {
  movie: CollectionMovie;
  open: boolean;
  onClose: () => void;
}

export default function EditMovieModal({ movie, open, onClose }: Props) {
  const { selected } = useAtomValue(collectionAtom);
  const user = useUser();

  const db = useFirestore();
  const reviews = useFirestoreCollectionData(
    collectionMovieReviewsRef(db, selected, movie.id),
  );

  function handleSubmit(e: JSX.TargetedSubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const text = form.get("text") as string;
    const rating = Number(form.get("rating"));

    const ref = collectionMovieReviewsRef(db, selected, movie.id);

    const id = nanoid();

    setDoc(doc(ref, id), {
      id,
      userId: user.data?.uid ?? "",
      userName: user.data?.displayName ?? "",
      userOverview: text,
      userRating: rating,
      createdAt: serverTimestamp(),
    });

    updateDoc(collectionMovieRef(db, selected, movie.id), {
      userRatings: {
        [id]: rating,
      },
    });
  }

  function handleDelete(id: string) {
    const ref = collectionMovieReviewsRef(db, selected, movie.id);

    deleteDoc(doc(ref, id));
    updateDoc(collectionMovieRef(db, selected, movie.id), {
      userRatings: {
        [id]: null as unknown as number,
      },
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      classNames={{
        modalContainer: "w-100% h-100% flex justify-center items-center",
        modal: "bg-gray-600!",
      }}
    >
      <MoviePoster
        size="lg"
        className="object-contain absolute"
        height={window.innerHeight * 0.3}
        path={movie.posterPath}
      />
      <h2
        className="z-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]"
        style={{
          marginTop: window.innerHeight * 0.2,
          marginBottom: window.innerHeight * 0.08,
        }}
      >
        {movie.title}
      </h2>

      <hr />
      {reviews.data?.map((review) => (
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-xs">
              {review.userId === user.data?.uid ? "You" : review.userName} -{" "}
              {review.createdAt?.toDate().toLocaleDateString()}
            </span>
            <div className="flex justify-between">
              {review.userOverview} {review.userOverview ? " || " : null}{" "}
              {review.userRating + "⭐"}
            </div>
          </div>

          {review.userId === user.data?.uid ? (
            <ButtonWithConfirm onConfirm={() => handleDelete(review.id)}>
              {(confirm) => (
                <div
                  className={clsx(
                    "text-red text-xl flex justify-center items-center",
                    confirm ? "i-ph-check" : "i-ph-trash-bold",
                  )}
                />
              )}
            </ButtonWithConfirm>
          ) : null}
        </div>
      ))}

      {!reviews.data?.some((x) => x.userId === user.data?.uid) && (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <label className="flex flex-col">
            Text
            <textarea className="mt-1" name="text" />
          </label>

          <label className="flex flex-col">
            Rating
            <input
              type="number"
              min={0}
              max={10}
              required
              className="mt-1"
              name="rating"
            />
          </label>

          <button>Send review</button>
        </form>
      )}
    </Modal>
  );
}
