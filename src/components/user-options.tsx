import {
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { signOut } from "firebase/auth";
import { useState } from "preact/hooks";
import { useAuth } from "reactfire";

export default function UserOptions() {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating<HTMLButtonElement>({
    open,
    onOpenChange: setOpen,
    placement: "right",
    middleware: [shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { referencePress: false });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    click,
    dismiss,
  ]);

  const auth = useAuth();

  return (
    <>
      <button
        ref={refs.setReference}
        className="i-ph-user-bold bg-gray-5! hover:bg-gray! text-4xl"
        {...getReferenceProps()}
      />

      {open && (
        <div
          ref={refs.setFloating}
          className="bg-gray-600! rounded p-2 h-fit min-w-48 shadow-lg"
          {...getFloatingProps()}
          style={floatingStyles}
        >
          <div className="w-full">
            <button
              className="flex flex-row bg-transparent! border-none text-gray-3! w-full h-fit hover:bg-gray-500! rounded p-2"
              onClick={() => signOut(auth)}
            >
              <div className="i-ph-sign-out-bold me-1" /> Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
