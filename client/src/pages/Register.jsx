import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  setAuthError,
  setAuthStatus,
} from "../features/auth/authSlice";
import api from "../services/api";
import { Link, Navigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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

      // Step 1: Register user
      await api.post("/auth/register", form);

      // Step 2: Auto-login after successful registration
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      dispatch(
        setCredentials({
          user: res.data.user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        })
      );
    } catch (err) {
      dispatch(
        setAuthError(err.response?.data?.message || "Registration failed")
      );
    } finally {
      dispatch(setAuthStatus("idle"));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/60 md:grid-cols-[1.1fr,0.9fr]">
        {/* Left half (Form) */}
        <div className="p-8 sm:p-10">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-indigo-300">
            Create Account
          </p>
          <h1 className="mb-2 text-xl font-semibold text-slate-50">
            Start your subscription journey
          </h1>
          <p className="mb-6 text-xs text-slate-400">
            Sign up in seconds and choose a plan that fits your workflow.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-600/60 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-[12px] text-slate-100 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/60"
                placeholder="John Doe"
              />
            </div>

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
              <label className="mb-1 block text-[11px] font-medium text-slate-300">
                Password
              </label>
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
              {status === "loading" ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-[11px] text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-300 hover:text-indigo-200"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Right half */}
        <div className="hidden flex-col justify-between border-l border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-7 text-xs text-slate-200 md:flex">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
              Why register?
            </p>
            <h2 className="mb-3 text-base font-semibold text-slate-50">
              One dashboard for everything.
            </h2>
            <p className="text-[11px] text-slate-400">
              Monitor usage, manage billing, upgrade plans, and stay
              informed—directly from your subscription dashboard.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <p className="text-[11px] text-slate-400">Secure & Private</p>
              <p className="mt-1 text-lg font-semibold text-slate-50">
                Encrypted data
              </p>
              <p className="mt-1 text-[11px] text-indigo-300">
                Your details stay safe
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <p className="text-[11px] text-slate-400">Quick setup</p>
                <p className="mt-1 text-base font-semibold text-slate-50">
                  Under 1 min
                </p>
              </div>
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <p className="text-[11px] text-slate-400">Upgrade anytime</p>
                <p className="mt-1 text-base font-semibold text-slate-50">
                  Flexible plans
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
