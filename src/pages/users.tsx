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
    <div className="flex-col">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="flex-col">
        {data?.map((x) => (
          <p key={x.id}>
            {x.name} - <span className="badge">{x.role}</span>
          </p>
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
