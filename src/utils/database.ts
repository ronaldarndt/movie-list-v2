import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  collection,
  doc,
} from "firebase/firestore";

export interface Collection {
  name: string;
  description: string;
  tags: string[];
  owner: string;
  id: string;
  userIds: string[];
}

export interface CollectionUser {
  id: string;
  role: string;
  name: string;
  email: string;
}

export interface CollectionInvite {
  id: string;
  expires: number;
  inviterName: string;
  collectionName: string;
  collectionId: string;
  accepted: boolean;
}

export interface CollectionMovie {
  id: string;
  title: string;
  posterPath?: string;
  addedAt: number;
  releaseDate: string;
  voteAverage: number;
  watched: boolean;
  genreIds: number[];
  userRatings?: Record<string, number>;
}

export interface CollectionMovieReview {
  id: string;
  userId: string;
  userName: string;
  userRating: number;
  userOverview: string;
  createdAt: Timestamp;
}

const defaultConverter = <T extends DocumentData>() => ({
  toFirestore: (collection: T) => collection,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<T, T>,
    options: SnapshotOptions,
  ) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
});

const movieCollectionConverter = {
  toFirestore: (collection: CollectionMovie) => ({
    ...collection,
    genreIds: collection.genreIds?.join(",") ?? "",
  }),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<CollectionMovie, CollectionMovie>,
    options: SnapshotOptions,
  ) => {
    const data = snapshot.data(options);
    return {
      ...data,
      genreIds:
        (data.genreIds as unknown as string)
          ?.split(",")
          .map((id) => parseInt(id)) ?? [],
      id: snapshot.id,
    };
  },
};

export const collectionsRef = (db: Firestore) =>
  collection(db, "collections").withConverter(defaultConverter<Collection>());

export const collectionRef = (db: Firestore, id: string) =>
  doc(db, "collections", id).withConverter(defaultConverter<Collection>());

export const collectionUserRef = (
  db: Firestore,
  collectionId: string,
  userId: string,
) =>
  doc(collectionRef(db, collectionId), `users/${userId}`).withConverter(
    defaultConverter<CollectionUser>(),
  );

export const collectionUsersRef = (db: Firestore, collectionId: string) =>
  collection(collectionRef(db, collectionId), "users").withConverter(
    defaultConverter<CollectionUser>(),
  );

export const inviteRef = (db: Firestore, id: string) =>
  doc(db, "invites", id).withConverter(defaultConverter<CollectionInvite>());

export const collectionMoviesRef = (db: Firestore, collectionId: string) =>
  collection(collectionRef(db, collectionId), "movies").withConverter(
    movieCollectionConverter,
  );

export const collectionMovieRef = (
  db: Firestore,
  collectionId: string,
  movieId: string | number,
) =>
  doc(collectionRef(db, collectionId), `movies/${movieId}`).withConverter(
    movieCollectionConverter,
  );

export const collectionMovieReviewsRef = (
  db: Firestore,
  collectionId: string,
  movieId: string | number,
) =>
  collection(
    collectionMovieRef(db, collectionId, movieId),
    `reviews`,
  ).withConverter(defaultConverter<CollectionMovieReview>());
