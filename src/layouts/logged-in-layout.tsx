import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { useRef } from "preact/hooks";
import { Toaster } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useSigninCheck } from "reactfire";
import { collectionAtom } from "../atoms/collectionAtom";
import Searchbar from "../components/searchbar";
import UserOptions from "../components/user-options";

export function Component() {
  const collectionPrefs = useAtomValue(collectionAtom);
  const { data, status } = useSigninCheck();

  const isMobile = useIsMobile();

  const searchRef = useRef<HTMLInputElement>(null);

  useHotkeys(
    "ctrl+up",
    () => {
      searchRef.current?.focus();
    },
    [],
  );

  const isLoading = status === "loading";

  if (!isLoading && !data?.signedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Toaster position="bottom-center" />

      <nav
        className={
          "flex flex-row h-6 bg-gray-800 w-full fixed md:ps-20 pt-1 pb-1 items-center z-3"
        }
      >
        {!isMobile ? `Selected: ${collectionPrefs.selectedName}` : null}
        <Searchbar />
      </nav>

      <nav
        className={
          "justify-between p-6 bg-gray-800 box-border z-5" +
          " flex fixed w-100vw h-16 bottom-0" +
          " md:flex-col md:w-16 md:h-full"
        }
      >
        <div
          className={
            "flex justify-center items-center w-100% gap-x-6" +
            " md:flex-col md:gap-y-6"
          }
        >
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              clsx(
                "i-ph-files-bold text-4xl hover:cursor-pointer hover:text-gray",
                isActive ? "text-gray" : "text-gray-5",
              )
            }
          />

          {collectionPrefs.selected ? (
            <>
              <NavLink
                to="/list"
                className={({ isActive }) =>
                  clsx(
                    "i-ph-television-bold text-4xl hover:cursor-pointer hover:text-gray",
                    isActive ? "text-gray" : "text-gray-5",
                  )
                }
              />

              <NavLink
                to="/users"
                className={({ isActive }) =>
                  clsx(
                    "i-ph-users-bold text-4xl hover:cursor-pointer hover:text-gray ",
                    isActive ? "text-gray" : "text-gray-5",
                  )
                }
              />
            </>
          ) : null}
        </div>

        <div className="flex md:flex-col justify-center items-center md:gap-y-6">
          {status === "success" ? <UserOptions /> : null}
          {/* <PreferencesOptions /> */}
        </div>
      </nav>

      <main className="bg-gray-700 h-100% w-fit p-8 md:ps-24 pt-12">
        {isLoading ? null : <Outlet />}
      </main>
    </>
  );
}

Component.displayName = "LoggedInLayout";
