import clsx from "clsx";
import useConfig from "../hooks/use-config";

interface Props {
  path?: string;
  title?: string;
  size: "sm" | "lg";
  height?: number;
  width?: number;
  className?: string;
}

export default function MoviePoster({
  path,
  size,
  title,
  className,
  height,
  width: inputWidth,
}: Props) {
  const { basePosterPath, originalPosterPath } = useConfig();

  const basePath = size === "sm" ? basePosterPath : originalPosterPath;

  if (!path) {
    const width = height
      ? height / 1.5
      : inputWidth ?? Number(basePath.split("/").at(-1)?.replace("w", ""));

    return (
      <div
        className="bg-gray-600 rounded-md shadow-md flex justify-center items-center"
        style={{
          width: width + "px",
          minWidth: width + "px",
          height: width * 1.5 + "px",
        }}
      >
        <div className="i-ph-television text-4xl" />
      </div>
    );
  }

  return (
    <img
      src={`${basePath}${path}`}
      alt={title}
      className={clsx("rounded-md shadow-md", className)}
      height={height}
      width={inputWidth}
    />
  );
}
