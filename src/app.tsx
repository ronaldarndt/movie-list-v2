import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider, FirestoreProvider, useFirebaseApp } from "reactfire";

const router = createBrowserRouter([
  { path: "/", lazy: () => import("./pages/home.tsx") },
  { path: "/login", lazy: () => import("./pages/login.tsx") },
  {
    path: "/",
    lazy: () => import("./layouts/logged-in-layout.tsx"),
    children: [
      { path: "/collections", lazy: () => import("./pages/collections.tsx") },
      { path: "/users", lazy: () => import("./pages/users.tsx") },
      { path: "/invite/:id", lazy: () => import("./pages/invite.tsx") },
      {
        path: "/list",
        children: [
          { index: true, lazy: () => import("./pages/list/index.tsx") },
          { path: "movie/:id", lazy: () => import("./pages/list/movie.tsx") },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

export function App() {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const authInstance = getAuth(app);

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={authInstance}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
}
