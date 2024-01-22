import {
  FloatingFocusManager,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { query, setDoc, where } from "firebase/firestore";
import { useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import { collectionAtom } from "../atoms/collectionAtom";
import {
  collectionRef,
  collectionUserRef,
  collectionsRef,
} from "../utils/database";

export function Component() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const setCollectionPrefs = useSetAtom(collectionAtom);

  const fs = useFirestore();
  const auth = useAuth();

  const { data } = useFirestoreCollectionData(
    query(
      collectionsRef(fs),
      where("userIds", "array-contains", auth.currentUser?.uid ?? ""),
    ),
  );

  const { context, refs, floatingStyles } = useFloating({
    open: modalOpen,
    onOpenChange: setModalOpen,
    placement: "bottom",
    middleware: [shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { referencePress: false });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    click,
    dismiss,
  ]);

  async function handleAdd(e: JSX.TargetedSubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const name = e.currentTarget.elements.namedItem(
        "name",
      ) as HTMLInputElement;
      const description = e.currentTarget.elements.namedItem(
        "description",
      ) as HTMLInputElement;
      const tags = e.currentTarget.elements.namedItem(
        "tags",
      ) as HTMLInputElement;

      const tagsArray = tags.value.split(",").map((tag) => tag.trim());

      const userId = auth.currentUser?.uid ?? "";

      const id = nanoid();

      await setDoc(collectionRef(fs, id), {
        name: name.value,
        description: description.value,
        tags: tagsArray,
        owner: userId,
        id,
        userIds: [userId],
      });

      await setDoc(collectionUserRef(fs, id, userId), {
        id: userId,
        role: "owner",
        name: auth.currentUser?.displayName ?? "",
        email: auth.currentUser?.email ?? "",
      });

      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <h1>Collections</h1>
        {!data?.length ? <div>No collections found</div> : null}
      </div>

      {data?.map((collection) => {
        return (
          <div
            key={collection.id}
            className="flex gap-x-2 items-center bg-slate-600 hover:bg-slate-500 rounded p-2"
          >
            <button
              className="i-ph-check-bold text-green text-xl hover:cursor-pointer me-2"
              onClick={() =>
                setCollectionPrefs((p) => ({
                  ...p,
                  selected: collection.id,
                  selectedName: collection.name,
                }))
              }
            />
            <button className="i-ph-trash-bold text-red text-xl hover:cursor-pointer me-2" />

            <div>{collection.name}</div>
          </div>
        );
      })}

      <button
        className="mt-12"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div className="i-ph-plus me-1" /> Add
      </button>

      {modalOpen && (
        <FloatingFocusManager context={context} initialFocus={refs.floating}>
          <div
            className="bg-gray-600 rounded p-2 h-fit min-w-80% min-h-146 ms-24 shadow-lg"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <form onSubmit={handleAdd} className="flex flex-col gap-y-6">
              <input type="text" placeholder="Name" name="name" minlength={1} />
              <input type="text" placeholder="Description" name="description" />
              <input type="text" placeholder="Tags" name="tags" />
              <button type="submit" disabled={loading}>
                Add
              </button>
            </form>
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
}

Component.displayName = "collections";
