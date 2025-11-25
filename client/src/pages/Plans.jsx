import { useEffect, useState } from "react";
import api from "../services/api";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlanId, setActivePlanId] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          api.get("/plans"),
          api.get("/my-subscription"),
        ]);

        setPlans(plansRes.data || []);
        if (subRes.data?.subscription?.plan_id?._id) {
          setActivePlanId(subRes.data.subscription.plan_id._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const subscribe = async (planId) => {
    try {
      await api.post(`/subscribe/${planId}`);
      setActivePlanId(planId);
      alert("Subscribed successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error subscribing");
    }
  };

  if (loading) {
    return <p className="p-4 text-xs text-slate-300">Loading plans...</p>;
  }

  if (!plans.length) {
    return <p className="p-4 text-xs text-slate-300">No plans available.</p>;
  }

  return (
    <section className="mt-4">
      <header className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Pricing
          </p>
          <h1 className="text-lg font-semibold text-slate-50">
            Choose a plan that fits your workflow
          </h1>
          <p className="mt-1 text-[11px] text-slate-400">
            Upgrade or downgrade anytime. Your current subscription will update
            instantly.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isActive = plan._id === activePlanId;
          const isPopular = plan.name.toLowerCase().includes("pro");

          return (
            <article
              key={plan._id}
              className={`relative flex flex-col rounded-2xl border bg-slate-900/80 p-5 text-xs shadow-lg shadow-slate-950/40 transition hover:-translate-y-[1px] hover:border-indigo-400/70 ${
                isActive ? "border-emerald-400/80" : "border-slate-800"
              }`}
            >
              {isPopular && (
                <div className="absolute right-4 top-4 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
                  Most popular
                </div>
              )}

              {isActive && !isPopular && (
                <div className="absolute right-4 top-4 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  Current plan
                </div>
              )}

              <h2 className="mb-1 text-sm font-semibold text-slate-50">
                {plan.name}
              </h2>
              <p className="mb-3 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-slate-50">
                  ₹{plan.price}
                </span>
                <span className="text-[11px] text-slate-400">
                  / {plan.duration} days
                </span>
              </p>

              <ul className="mb-4 space-y-1">
                {plan.features?.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[11px] text-slate-300"
                  >
                    <span className="mt-[3px] inline-flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500/15">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => subscribe(plan._id)}
                className={`mt-auto w-full rounded-lg px-3 py-2 text-[12px] font-medium transition ${
                  isActive
                    ? "border border-emerald-400/70 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                    : "bg-indigo-500 text-slate-50 hover:bg-indigo-400"
                }`}
              >
                {isActive ? "Current plan" : "Choose plan"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
