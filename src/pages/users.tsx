import clsx from "clsx";
import { setDoc } from "firebase/firestore";
import { useAtomValue } from "jotai";
import { nanoid } from "nanoid";
import { useState } from "preact/hooks";
import toast from "react-hot-toast";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import { collectionAtom } from "../atoms/collectionAtom";
import { collectionUsersRef, inviteRef } from "../utils/database";

export function Component() {
  const collectionPrefs = useAtomValue(collectionAtom);

  const [loadingCopy, setLoadingCopy] = useState(false);

  const fs = useFirestore();
  const auth = useAuth();

  const { data } = useFirestoreCollectionData(
    collectionUsersRef(fs, collectionPrefs.selected),
  );

  async function handleCopyClick() {
    try {
      setLoadingCopy(true);

      const id = nanoid();

      const dbPromise = setDoc(inviteRef(fs, id), {
        id,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        inviterName: auth.currentUser?.displayName ?? "",
        collectionName: collectionPrefs.selectedName,
        collectionId: collectionPrefs.selected,
        accepted: false,
      });

      const copyPromise = navigator.clipboard.writeText(
        `${window.location.origin}/invite/${id}`,
      );

      toast.promise(Promise.all([dbPromise, copyPromise]), {
        loading: "Copying...",
        success: "Copied!",
        error: "Failed to copy",
      });
    } finally {
      setLoadingCopy(false);
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <h1>Users</h1>
      </div>

      <div className="flex-col gap-8">
        {data?.map((x) => (
          <div className="flex gap-x-2 items-center bg-slate-600 hover:bg-slate-500 rounded p-2">
            <div className="badge">{x.role}</div>

            <h2>{x.name}</h2>
          </div>
        ))}
      </div>

      <button className="mt-12 w-max" onClick={handleCopyClick}>
        <div
          className={clsx(
            "me-1",
            loadingCopy
              ? "i-ph-circle-notch-bold animate-spin"
              : "i-ph-copy-bold",
          )}
        />
        Copy invite link
      </button>
    </div>
  );
}

Component.displayName = "Users";
