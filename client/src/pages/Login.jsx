import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  setAuthError,
  setAuthStatus,
} from "../features/auth/authSlice";
import api from "../services/api";
import { Navigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setAuthStatus("loading"));
      dispatch(setAuthError(null));

      const res = await api.post("/auth/login", form);

      dispatch(
        setCredentials({
          user: res.data.user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        })
      );
    } catch (err) {
      dispatch(setAuthError(err.response?.data?.message || "Login failed"));
    } finally {
      dispatch(setAuthStatus("idle"));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/60 md:grid-cols-[1.1fr,0.9fr]">
        {/* Form side */}
        <div className="p-8 sm:p-10">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-indigo-300">
            Welcome back
          </p>
          <h1 className="mb-2 text-xl font-semibold text-slate-50">
            Sign in to your dashboard
          </h1>
          <p className="mb-6 text-xs text-slate-400">
            View your current plan, billing status, and manage subscription in
            one place.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-600/60 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Email address
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-[12px] text-slate-100 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/60"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-[11px] font-medium text-slate-300">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-[12px] text-slate-100 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/60"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={status === "loading"}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-indigo-500 py-2 text-[12px] font-medium text-slate-50 transition hover:bg-indigo-400 disabled:opacity-70"
            >
              {status === "loading" ? "Logging in..." : "Continue"}
            </button>
          </form>

          <p className="mt-5 text-[11px] text-slate-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-300 hover:text-indigo-200"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Right / Highlight side */}
        <div className="hidden flex-col justify-between border-l border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-7 text-xs text-slate-200 md:flex">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
              Subscription Insight
            </p>
            <h2 className="mb-3 text-base font-semibold text-slate-50">
              Stay on top of your billing.
            </h2>
            <p className="text-[11px] text-slate-400">
              Track active plans, expiration dates, and upgrade in a couple of
              clicks. Designed for fast, read-friendly overviews.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <p className="text-[11px] text-slate-400">Current MRR</p>
              <p className="mt-1 text-lg font-semibold text-slate-50">
                ₹12,400
              </p>
              <p className="mt-1 text-[11px] text-emerald-300">
                +8.2% vs last month
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <p className="text-[11px] text-slate-400">Active users</p>
                <p className="mt-1 text-base font-semibold text-slate-50">
                  128
                </p>
              </div>
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <p className="text-[11px] text-slate-400">Churn</p>
                <p className="mt-1 text-base font-semibold text-slate-50">
                  1.4%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
