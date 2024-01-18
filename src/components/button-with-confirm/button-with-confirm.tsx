import clsx from "clsx";
import {
  ForwardedRef,
  JSX,
  ReactNode,
  forwardRef,
  useRef,
  useState,
} from "react";
import { mergeRefs } from "react-merge-refs";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  children: (confirm: boolean) => ReactNode;
  confirmClass?: string;
  onConfirm: () => unknown;
  className?: string;
}

function ButtonWithConfirm(props: Props, ref: ForwardedRef<HTMLButtonElement>) {
  const [clickedOnce, setClickedOnce] = useState(false);

  const localRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside(localRef, () => {
    setClickedOnce(false);
  });

  function handleClick(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setClickedOnce((c) => !c);

    if (clickedOnce) {
      props.onConfirm();
    }
  }

  return (
    <button
      onClick={handleClick}
      ref={mergeRefs([localRef, ref])}
      className={clsx(props.className, clickedOnce && props.confirmClass)}
    >
      {props.children(clickedOnce)}
    </button>
  );
}

export default forwardRef(ButtonWithConfirm);
