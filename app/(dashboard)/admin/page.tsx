'use client';

import { APP_ROLES, type AppRole } from "@/lib/auth/constants";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type MetricCard = {
  label: string;
  value: string;
  tone: string;
};

const metrics: MetricCard[] = [
  { label: "Active bins in Kigali", value: "126", tone: "bg-blue-50 text-blue-800" },
  { label: "Overflow alerts (24h)", value: "19", tone: "bg-red-50 text-red-800" },
  { label: "Collections completed", value: "82%", tone: "bg-green-50 text-green-800" },
  { label: "Route efficiency gain", value: "+23%", tone: "bg-purple-50 text-purple-800" },
];

export default function AdminPortalPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>(APP_ROLES.COMPANY);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.user_metadata?.role !== APP_ROLES.ADMIN) {
        router.replace("/home");
        return;
      }
      setCheckingRole(false);
    };
    verify();
  }, [router]);

  const roleLabel = useMemo(
    () => (role === APP_ROLES.COMPANY ? "Waste collection company" : "Individual household"),
    [role]
  );

  const onCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setLoading(false);
      setMessage("Session expired. Please sign in again.");
      return;
    }

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ displayName, email, password, role }),
    });

    const data = await response.json();
    setLoading(false);
    setMessage(data.message || "Could not create user.");

    if (response.ok) {
      setDisplayName("");
      setEmail("");
      setPassword("");
      setRole(APP_ROLES.COMPANY);
    }
  };

  if (checkingRole) {
    return <div className="p-6">Checking permissions...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <section className="rounded-2xl bg-gradient-to-r from-[#0D99FF] to-[#0A3B83] p-8 text-white shadow-lg">
        <h1 className="text-3xl font-semibold">Cheemba Admin Portal</h1>
        <p className="mt-2 max-w-3xl text-sm text-blue-100">
          Central command for account provisioning, smart bin monitoring, and live pilot analytics for the Kigali rollout.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className={`rounded-xl p-4 shadow-sm ${metric.tone}`}>
            <p className="text-sm">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#0E2040]">Create App Users</h2>
        <p className="mt-1 text-sm text-slate-600">
          Create accounts for collection companies or households. Sign-up is disabled in the public app.
        </p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onCreateUser}>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Display name"
            className="rounded-lg border p-3"
            required
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as AppRole)}
            className="rounded-lg border p-3"
          >
            <option value={APP_ROLES.COMPANY}>Collection company</option>
            <option value={APP_ROLES.HOUSEHOLD}>Individual household</option>
          </select>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email"
            className="rounded-lg border p-3"
            required
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Temporary password"
            className="rounded-lg border p-3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="col-span-full rounded-lg bg-[#0A3B83] px-6 py-3 text-white hover:bg-[#082f69] disabled:opacity-70"
          >
            {loading ? "Creating..." : `Create ${roleLabel} account`}
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
      </section>
    </div>
  );
}
