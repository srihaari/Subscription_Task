import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/my-subscription")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return <p className="p-4 text-xs text-slate-300">Loading subscription…</p>;
  }

  if (data.status === "none") {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-xs text-slate-300">
        <h1 className="mb-2 text-sm font-semibold text-slate-50">
          No active subscription
        </h1>
        <p className="mb-1">
          You haven’t picked a plan yet. Head over to the pricing page and start
          a plan to unlock the full dashboard.
        </p>
      </div>
    );
  }

  const { subscription } = data;
  const status = data.status;

  return (
    <section className="mt-6 grid gap-4 md:grid-cols-[1.4fr,1fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-xs text-slate-200 shadow-lg shadow-slate-950/40">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Current subscription
        </p>
        <h1 className="mt-1 text-lg font-semibold text-slate-50">
          {subscription.plan_id.name}
        </h1>
        <p className="mt-1 text-[11px] text-slate-400">
          ₹{subscription.plan_id.price} for {subscription.plan_id.duration} days
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[11px] text-slate-400">Start date</p>
            <p className="mt-1 text-sm font-medium text-slate-50">
              {new Date(subscription.start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">End date</p>
            <p className="mt-1 text-sm font-medium text-slate-50">
              {new Date(subscription.end_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Status</p>
            <p className="mt-1 inline-flex items-center gap-2 text-sm font-medium">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "active" ? "bg-emerald-400" : "bg-red-500"
                }`}
              />
              <span
                className={
                  status === "active" ? "text-emerald-300" : "text-red-300"
                }
              >
                {status}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-200">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Quick tip
          </p>
          <p className="text-[11px] text-slate-300">
            You can change your plan from the Pricing page. Your billing cycle
            will restart from the date of change.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-200">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Upcoming
          </p>
          <p className="text-[11px] text-slate-300">
            Add usage analytics or per-user pricing to show deeper insights here
            in a real product.
          </p>
        </div>
      </div>
    </section>
  );
}
