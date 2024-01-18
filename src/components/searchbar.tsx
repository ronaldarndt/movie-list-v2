import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ChangeEvent } from "preact/compat";
import { useRef, useState } from "preact/hooks";
import { useHotkeys } from "react-hotkeys-hook";
import { Link } from "react-router-dom";
import { useDebounce } from "usehooks-ts";
import { tmdbRequest } from "../utils/request";
import { MovieSearchResult, PagedResponse } from "../utils/tmdb/tmdb-types";
import AddToCollectionButton from "./add-to-collection-button";
import MoviePoster from "./movie-poster";

export default function Searchbar() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    placement: "bottom",
    middleware: [
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const role = useRole(context, { role: "listbox" });
  const click = useClick(context, { enabled: !!search });
  const dismiss = useDismiss(context, { referencePress: false });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, click, dismiss, listNav],
  );

  useHotkeys(
    "ctrl+up",
    () => {
      (refs.reference.current as HTMLInputElement)?.focus();
    },
    [],
  );

  const movieQuery = useQuery({
    queryKey: ["search", useDebounce(search, 300)],
    queryFn: () =>
      tmdbRequest<PagedResponse<MovieSearchResult>>(
        `/search/movie?language=pt-BR&query=${search}`,
      ),
    staleTime: 1000,
    placeholderData: keepPreviousData,
    enabled: !!search.length,
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget?.value;
    setSearch(value);

    if (value) {
      setOpen(true);
      setActiveIndex(0);
    } else {
      setOpen(false);
    }
  }

  return (
    <>
      <label className="w-50% transition-width relative mx-auto">
        <span className="sr-only"> Search</span>
        <div className="i-ph-magnifying-glass-bold absolute top-1 left-0 ps-2" />
        <input
          {...getReferenceProps({
            ref: refs.setReference,
            onChange: handleChange,
            value: search,
            placeholder: "Search",
            "aria-autocomplete": "list",
            className: clsx(
              "border-none rounded h-6 bg-gray-500 text-slate-100 w-full",
              "placeholder:italic placeholder:text-slate-200 ps-7",
            ),
            onKeyDown(event) {
              if (event.key === "Enter" && activeIndex != null) {
                setActiveIndex(null);
                setOpen(false);
              }
            },
          })}
        />
      </label>

      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  ...floatingStyles,
                  overflowY: "auto",
                },
                class:
                  "flex flex-col bg-slate-800 rounded shadow-lg p-2 gap-y-2 w-50% box-border z-4",
              })}
            >
              {movieQuery.data?.results.slice(0, 5).map((movie, i) => (
                <Link
                  to={`/list/movie/${movie.id}`}
                  {...getItemProps({
                    key: movie.id,
                    ref: (el) => (listRef.current[i] = el),
                    onClick: () => setOpen(false),
                    className: clsx(
                      "flex flex-row gap-x-2 items-center hover:bg-slate-700 rounded p-2 decoration-none",
                      activeIndex === i && "bg-slate-700",
                    ),
                  })}
                  aria-selected={activeIndex === i}
                  role="option"
                >
                  <MoviePoster
                    path={movie.posterPath}
                    size="sm"
                    title={movie.title}
                  />
                  <div className="flex flex-col w-100%">
                    <div className="flex justify-between">
                      <h2>{movie.title}</h2>
                      <AddToCollectionButton
                        movie={movie}
                        loadAddedState={false}
                        className="bg-slate-600! hover:bg-slate-500!"
                      />
                    </div>

                    <div className="flex flex-row justify-between items-center">
                      <h3>
                        {new Date(movie.releaseDate).toLocaleDateString()}
                      </h3>
                      {movie.voteAverage.toFixed(2)}⭐
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}
