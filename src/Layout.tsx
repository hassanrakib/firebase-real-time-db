import { useContext } from "react";
import { Link, Outlet } from "react-router";
import { AuthContext } from "./auth";

export default function Layout() {
  // read auth context
  const authContext = useContext(AuthContext);

  return (
    <div>
      <h1 style={{ marginBottom: "40px", textAlign: "center" }}>My Todos</h1>
      {authContext?.isUserLoading ? (
        <p>Loading...</p>
      ) : authContext?.user ? (
        <div>
          <div
            style={{
              display: "flex",
              alignItems:"center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <p>{authContext.user.email}</p>
            <button onClick={authContext?.logout}>Logout</button>
          </div>
          <Outlet />
        </div>
      ) : (
        <button onClick={authContext?.login} style={{ margin: "10px 0" }}>
          Use your gmail to login
        </button>
      )}
      <footer>
        <Link to="/">Back to home page</Link>
      </footer>
    </div>
  );
}
