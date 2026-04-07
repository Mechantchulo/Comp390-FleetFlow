import { Link } from "react-router-dom";
import { ArrowRight, Truck } from "lucide-react";
import DevMenu from "../components/DevMenu";
import uniImage from "../assets/uni.png";

const RoleSelectionPage = () => {
  const isDev = import.meta.env.DEV;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-800">
      <img
        src={uniImage}
        alt="University transport department entrance"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-slate-900/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-teal-900/35 via-slate-900/25 to-slate-950/55" />

      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-end">
        {isDev && <DevMenu />}
      </div>

      <section className="relative mx-auto mt-14 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/30 bg-white/45 p-6 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/18 to-teal-50/12" />
        <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-teal-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-cyan-100/25 blur-3xl" />
        <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
              <Truck size={13} />
              FleetFlow Transport Platform
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              Move faster with a transport system built for real operations.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
              Centralize requests, approvals, dispatch, and trip tracking in one secure workflow.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Sign In
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/signup?role=operations_staff"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
              >
                Create Staff Account
              </Link>
            </div>

        </div>
      </section>

      <p className="mx-auto mt-8 w-full max-w-4xl text-center text-xs text-slate-200">
        © 2026 FleetFlow Logistics Solutions. All rights reserved.
      </p>
    </main>
  );
};

export default RoleSelectionPage;
