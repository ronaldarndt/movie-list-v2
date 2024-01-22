import { useMediaQuery } from "usehooks-ts";

export default function useIsMobile() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return isMobile;
}
