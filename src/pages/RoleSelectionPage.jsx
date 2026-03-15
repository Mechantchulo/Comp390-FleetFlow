import { useState } from "react";
import { useNavigate } from "react-router-dom"
import DevMenu from "../components/DevMenu";

const roles = [
    {
        id: "transport_manager",
        title: "Transport Manager",
        subtitle: "Logistics & Strategy",
        icon: "🛡️",
    },
    {
        id: "operations_staff",
        title: "Operations Staff",
        subtitle: "Daily Coordination",
        icon: "🧰",
    },
    {
        id: "department_dean",
        title: "Department Dean",
        subtitle: "Approvals & Reports",
        icon: "🎓",
    },
    {
        id: "fleet_driver",
        title: "Fleet Driver",
        subtitle: "Routes & Deliveries",
        icon: "🚚",
    },
];

const RoleCard = ({ title, subtitle, icon, isSelected, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border p-5 text-center transition-all duration-200 ${isSelected
                ? "border-teal-600 bg-teal-50 shadow-md"
                : "border-slate-200 bg-white hover:border-teal-300"
                }`}
        >
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-xl">
                {icon}
            </span>
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </button>
    );
};

const RoleSelectionPage = () => {
    const navigate = useNavigate()
    const [selectedRole, setSelectedRole] = useState("");

    const handleContinue = () => {
        if (!selectedRole) {
            alert("Please select a role before continuing.");
            return;
        }
        navigate(`/login?role=${selectedRole}`);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50 px-4 py-5">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-end">
                <DevMenu />
            </div>

            <section className="mx-auto mt-20 w-full max-w-4xl">
                <div className="rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur md:p-10">
                    <header className="mb-10 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                            Welcome
                        </h1>
                        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
                            Select your role to access the Transport Management System
                            dashboard tailored for your needs.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {roles.map((role) => (
                            <RoleCard
                                key={role.id}
                                title={role.title}
                                subtitle={role.subtitle}
                                icon={role.icon}
                                isSelected={selectedRole === role.id}
                                onClick={() => setSelectedRole(role.id)}
                            />
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="w-full max-w-md rounded-full bg-teal-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                        >
                            Continue to Dashboard
                        </button>

                        <p className="mt-4 text-sm text-teal-600">
                            Need help accessing your account?
                        </p>
                        <p className="mt-1 text-xs tracking-wider text-slate-400">
                            SECURE ENTERPRISE AUTHENTICATION
                        </p>
                    </div>
                </div>

                <p className="mt-16 text-center text-xs text-slate-400">
                    © 2026 FleetFlow Logistics Solutions. All rights reserved.
                </p>
            </section>
        </main>
    );
};

export default RoleSelectionPage;
