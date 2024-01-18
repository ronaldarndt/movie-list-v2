import { Link } from "react-router-dom";

export function Component() {
  return (
    <main>
      <nav>Home / About / Pricing / Login</nav>

      <h1>The best movie list</h1>

      <Link to="/login">
        <button>Login</button>
      </Link>
    </main>
  );
}

Component.displayName = "Home";
