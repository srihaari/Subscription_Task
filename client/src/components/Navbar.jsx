import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "text-indigo-300" : "text-slate-200";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to={user ? "/plans" : "/login"}
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 text-sm font-semibold">
            SB
          </div>
          <span className="text-sm font-semibold text-slate-100">
            Subscription Board
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-medium">
          {user && (
            <>
              <Link className={isActive("/plans")} to="/plans">
                Plans
              </Link>
              <Link className={isActive("/dashboard")} to="/dashboard">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link
                  className={isActive("/admin/subscriptions")}
                  to="/admin/subscriptions"
                >
                  Admin
                </Link>
              )}
            </>
          )}

          <div className="h-6 w-px bg-slate-700/70" />

          {user ? (
            <>
              <span className="hidden text-[11px] text-slate-400 sm:inline">
                {user.email}
              </span>
              <button
                onClick={() => dispatch(logout())}
                className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-100 hover:bg-slate-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-indigo-500 px-3 py-1 text-[11px] font-medium text-slate-50 hover:bg-indigo-400 transition"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
