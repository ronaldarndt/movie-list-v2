import { arrayUnion, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "preact/hooks";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import { collectionRef, collectionUserRef, inviteRef } from "../utils/database";

export function Component() {
  const [isAccepting, setIsAccepting] = useState(false);

  const db = useFirestore();
  const { id } = useParams();
  const user = useUser();

  const { data: invite, status } = useFirestoreDocData(inviteRef(db, id ?? ""));

  const navigate = useNavigate();

  async function handleAccept() {
    if (!user.data) return;

    try {
      setIsAccepting(true);

      await updateDoc(inviteRef(db, id ?? ""), {
        accepted: true,
      });

      const collectionPromise = updateDoc(
        collectionRef(db, invite?.collectionId ?? ""),
        {
          userIds: arrayUnion(user.data?.uid),
        },
      );

      const collectionUsersPromise = setDoc(
        collectionUserRef(db, invite?.collectionId ?? "", user.data?.uid),
        {
          name: user.data.displayName ?? "",
          email: user.data.email ?? "",
          id: user.data.uid,
          role: "user",
        },
      );

      await toast.promise(
        Promise.all([collectionPromise, collectionUsersPromise]),
        {
          loading: "Accepting...",
          success: "Accepted!",
          error: "Failed to accept",
        },
      );

      navigate("/collections");
    } catch (error) {
      setIsAccepting(false);
    }
  }

  if (status === "loading" || !user.data) {
    return <div>Loading...</div>;
  }

  if (!invite) {
    return <div>Not found</div>;
  }

  if (invite.expires < Date.now()) {
    return <div>Expired</div>;
  }

  if (invite.accepted && !isAccepting) {
    return <div>Already accepted</div>;
  }

  return (
    <>
      {invite.inviterName} invited you to collection '{invite.collectionName}',
      do you wan't to accept?
      <button onClick={handleAccept}>Yes</button>
    </>
  );
}

Component.displayName = "Invite";
