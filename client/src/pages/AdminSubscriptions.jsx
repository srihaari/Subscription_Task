import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/admin/subscriptions");
        setSubs(res.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubs();
  }, []);

  const total = subs.length;
  const activeCount = subs.filter((s) => s.status === "active").length;
  const expiredCount = subs.filter((s) => s.status === "expired").length;

  return (
    <section className="mt-6">
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Admin · Subscriptions
          </p>
          <h1 className="text-lg font-semibold text-slate-50">
            All customer subscriptions
          </h1>
          <p className="mt-1 text-[11px] text-slate-400">
            Overview of all users, their plans, status, and billing periods.
          </p>
        </div>

        <div className="flex gap-2 text-[11px]">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
            <p className="text-slate-400">Total</p>
            <p className="text-sm font-semibold text-slate-50">{total}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2">
            <p className="text-emerald-200/80">Active</p>
            <p className="text-sm font-semibold text-emerald-100">
              {activeCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
            <p className="text-rose-300/80">Expired</p>
            <p className="text-sm font-semibold text-rose-100">
              {expiredCount}
            </p>
          </div>
        </div>
      </header>

      {loading && (
        <p className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-[11px] text-slate-300">
          Loading subscriptions…
        </p>
      )}

      {error && !loading && (
        <p className="rounded-xl border border-red-700/70 bg-red-500/10 px-4 py-3 text-[11px] text-red-200">
          {error}
        </p>
      )}

      {!loading && !error && subs.length === 0 && (
        <p className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-[11px] text-slate-300">
          No subscriptions found yet.
        </p>
      )}

      {!loading && !error && subs.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
          <div className="max-h-[480px] overflow-auto">
            <table className="min-w-full border-collapse text-[11px]">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="border-b border-slate-800 px-3 py-2 text-left font-medium">
                    User
                  </th>
                  <th className="border-b border-slate-800 px-3 py-2 text-left font-medium">
                    Email
                  </th>
                  <th className="border-b border-slate-800 px-3 py-2 text-left font-medium">
                    Plan
                  </th>
                  <th className="border-b border-slate-800 px-3 py-2 text-left font-medium">
                    Price
                  </th>
                  <th className="border-b border-slate-800 px-3 py-2 text-left font-medium">
                    Duration
                  </th>
                  <th className="border-b border-slate-800 px-3 py-2 text-left font-medium">
                    Start
                  </th>
                  <th className="border-b border-slate-800 px-3 py-2 text-left font-medium">
                    End
                  </th>
                  <th className="border-b border-slate-800 px-3 py-2 text-left font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/80 bg-slate-950/40 text-slate-200">
                {subs.map((s) => {
                  const start = s.start_date
                    ? new Date(s.start_date).toLocaleDateString()
                    : "-";
                  const end = s.end_date
                    ? new Date(s.end_date).toLocaleDateString()
                    : "-";
                  const status = s.status || "unknown";

                  const statusClasses =
                    status === "active"
                      ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40"
                      : status === "expired"
                      ? "bg-rose-500/15 text-rose-200 border border-rose-500/40"
                      : "bg-slate-700/40 text-slate-200 border border-slate-600";

                  return (
                    <tr key={s._id}>
                      <td className="px-3 py-2 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-50">
                            {s.user_id?.name || "-"}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {s.user_id?._id?.slice(-6)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {s.user_id?.email || "-"}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-50">
                            {s.plan_id?.name || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {s.plan_id?.price != null ? `₹${s.plan_id.price}` : "-"}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {s.plan_id?.duration != null
                          ? `${s.plan_id.duration} days`
                          : "-"}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {start}
                      </td>
                      <td className="px-3 py-2 align-top text-slate-300">
                        {end}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClasses}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              status === "active"
                                ? "bg-emerald-400"
                                : status === "expired"
                                ? "bg-rose-400"
                                : "bg-slate-400"
                            }`}
                          />
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 px-4 py-2 text-[10px] text-slate-500">
            <span>
              Showing <span className="text-slate-300">{subs.length}</span>{" "}
              subscriptions
            </span>
            <span>Admin view · read-only</span>
          </div>
        </div>
      )}
    </section>
  );
}
