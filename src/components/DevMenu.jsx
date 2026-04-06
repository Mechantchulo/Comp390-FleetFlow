import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { to: "/dashboard/transport_manager", label: "Transport Manager Dashboard" },
  { to: "/dashboard/admin", label: "Admin Operations Dashboard" },
  { to: "/dashboard/operations_staff", label: "Operations Staff Dashboard" },
  { to: "/dashboard/department_dean", label: "Department Dean Dashboard" },
  { to: "/dashboard/fleet_driver", label: "Fleet Driver Dashboard" },
];

const itemClass =
  "pointer-events-auto rounded-md bg-white/40 px-3 py-2 text-sm text-slate-700 backdrop-blur-sm hover:bg-white/70 text-left w-full";

export default function DevMenu() {
  const [open, setOpen] = useState(false);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-700"
      >
        ☰
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 w-72 p-1 pointer-events-none">
          <p className="mb-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Dev Dashboard Links
          </p>
          <div className="flex flex-col gap-2">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
