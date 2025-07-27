import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <h1 style={{ marginBottom: "40px", textAlign: "center" }}>My Todos</h1>
      <Outlet />
      <footer>
        <Link to="/">Back to home page</Link>
      </footer>
    </div>
  );
}
