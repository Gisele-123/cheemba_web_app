'use client';

import { APP_ROLES, type AppRole } from "@/lib/auth/constants";
import { bins } from "@/lib/demo/bins";
import { FEEDBACK_STORAGE_KEY, type CompanyFeedback, demoFeedback } from "@/lib/demo/feedback";
import { INITIAL_BIN_STOCK, type BinSaleRecord } from "@/lib/demo/inventory";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";

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
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"create" | "list" | "inventory" | "map" | "feedback">("create");
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>(APP_ROLES.COMPANY);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [stock, setStock] = useState<number>(INITIAL_BIN_STOCK);
  const [allocationQuantity, setAllocationQuantity] = useState<number>(1);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [soldBins, setSoldBins] = useState<BinSaleRecord[]>([]);
  const [stockMessage, setStockMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState<CompanyFeedback[]>(demoFeedback);
  const [users, setUsers] = useState<
    Array<{
      id: string;
      email: string;
      displayName: string;
      companyName: string;
      role: string;
      createdAt: string;
    }>
  >([]);
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

  useEffect(() => {
    const initialTab = searchParams.get("tab");
    if (initialTab === "list" || initialTab === "inventory" || initialTab === "create" || initialTab === "map" || initialTab === "feedback") {
      setActiveTab(initialTab);
    }
  }, [searchParams]);

  const adminMapCenter: [number, number] = [-1.9441, 30.0619];
  const mapIcon = (critical: boolean) =>
    L.divIcon({
      className: '',
      html: `<span class="wastebin-map-icon" style="background:${critical ? '#ef4444' : '#22c55e'};">🗑️</span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 30],
    });

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
      body: JSON.stringify({ displayName, companyName, email, password, role }),
    });

    const data = await response.json();
    setLoading(false);
    setMessage(data.message || "Could not create user.");

    if (response.ok) {
      setDisplayName("");
      setEmail("");
      setPassword("");
      setRole(APP_ROLES.COMPANY);
      setCompanyName("");
      void loadUsers();
    }
  };

  const companyUsers = useMemo(
    () => users.filter((user) => user.role === APP_ROLES.COMPANY),
    [users]
  );

  useEffect(() => {
    const savedStock = window.localStorage.getItem("cheemba-bin-stock");
    const savedSales = window.localStorage.getItem("cheemba-sold-bins");
    const savedFeedback = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (savedStock) setStock(Number(savedStock));
    if (savedSales) setSoldBins(JSON.parse(savedSales));
    if (savedFeedback) setFeedbackList(JSON.parse(savedFeedback));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cheemba-bin-stock", String(stock));
  }, [stock]);

  useEffect(() => {
    window.localStorage.setItem("cheemba-sold-bins", JSON.stringify(soldBins));
  }, [soldBins]);

  const allocateBins = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStockMessage("");
    if (!selectedCompany) {
      setStockMessage("Select a company first.");
      return;
    }
    if (allocationQuantity < 1) {
      setStockMessage("Quantity must be at least 1.");
      return;
    }
    if (allocationQuantity > stock) {
      setStockMessage("Not enough bins in stock.");
      return;
    }

    const record: BinSaleRecord = {
      id: `${Date.now()}`,
      companyName: selectedCompany,
      quantity: allocationQuantity,
      soldAt: new Date().toISOString(),
    };

    setStock((prev) => prev - allocationQuantity);
    setSoldBins((prev) => [record, ...prev]);
    setAllocationQuantity(1);
    setStockMessage(`Allocated ${record.quantity} bins to ${record.companyName}.`);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      setUsersLoading(false);
      return;
    }

    const response = await fetch("/api/admin/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setUsers(data.users || []);
    }
    setUsersLoading(false);
  };

  useEffect(() => {
    if (!checkingRole) {
      void loadUsers();
    }
  }, [checkingRole]);

  if (checkingRole) {
    return <div className="p-6">Checking permissions...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <section className="rounded-2xl bg-gradient-to-r from-[#0D99FF] to-[#0A3B83] p-8 text-white shadow-lg">
        <h1 className="text-3xl font-semibold">Cheemba</h1>
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
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="space-y-3">
            <button
              onClick={() => setActiveTab("create")}
              className={`w-full rounded-lg px-4 py-3 text-left ${activeTab === "create" ? "bg-[#0A3B83] text-white" : "bg-slate-100 text-slate-700"}`}
            >
              Create User
            </button>
            <button
              onClick={() => {
                setActiveTab("list");
                void loadUsers();
              }}
              className={`w-full rounded-lg px-4 py-3 text-left ${activeTab === "list" ? "bg-[#0A3B83] text-white" : "bg-slate-100 text-slate-700"}`}
            >
              Users List
            </button>
            <button
              onClick={() => {
                setActiveTab("inventory");
                void loadUsers();
              }}
              className={`w-full rounded-lg px-4 py-3 text-left ${activeTab === "inventory" ? "bg-[#0A3B83] text-white" : "bg-slate-100 text-slate-700"}`}
            >
              Bin Stock & Sales
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`w-full rounded-lg px-4 py-3 text-left ${activeTab === "map" ? "bg-[#0A3B83] text-white" : "bg-slate-100 text-slate-700"}`}
            >
              Live Bin Map
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`w-full rounded-lg px-4 py-3 text-left ${activeTab === "feedback" ? "bg-[#0A3B83] text-white" : "bg-slate-100 text-slate-700"}`}
            >
              Company Feedback
            </button>
          </aside>

          {activeTab === "create" ? (
            <div>
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
                {role === APP_ROLES.COMPANY && (
                  <input
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    placeholder="Collection company name"
                    className="rounded-lg border p-3 md:col-span-2"
                    required
                  />
                )}
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
            </div>
          ) : activeTab === "list" ? (
            <div>
              <h2 className="text-2xl font-semibold text-[#0E2040]">Users List</h2>
              <p className="mt-1 text-sm text-slate-600">All collection companies and households created by admin.</p>
              <div className="mt-4 overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-left">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr>
                        <td className="p-3" colSpan={4}>Loading users...</td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td className="p-3" colSpan={4}>No users found.</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="p-3">{user.displayName}</td>
                          <td className="p-3">{user.companyName}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.role === APP_ROLES.COMPANY ? "Collection company" : "Household"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "inventory" ? (
            <div>
              <h2 className="text-2xl font-semibold text-[#0E2040]">Bin Stock and Company Allocation</h2>
              <p className="mt-1 text-sm text-slate-600">Assign bins from stock to collection companies and track sold units.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-slate-500">Wastebins in stock</p>
                  <p className="text-4xl font-bold text-emerald-600">{stock}</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-slate-500">Wastebins sold</p>
                  <p className="text-4xl font-bold text-[#0A3B83]">
                    {soldBins.reduce((acc, record) => acc + record.quantity, 0)}
                  </p>
                </div>
              </div>
              <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={allocateBins}>
                <select
                  value={selectedCompany}
                  onChange={(event) => setSelectedCompany(event.target.value)}
                  className="rounded-lg border p-3"
                  required
                >
                  <option value="">Select company</option>
                  {companyUsers.map((company) => (
                    <option key={company.id} value={company.companyName !== "-" ? company.companyName : company.displayName}>
                      {company.companyName !== "-" ? company.companyName : company.displayName}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={allocationQuantity}
                  onChange={(event) => setAllocationQuantity(Number(event.target.value))}
                  className="rounded-lg border p-3"
                  placeholder="Quantity"
                  required
                />
                <button
                  type="submit"
                  className="col-span-full rounded-lg bg-[#0A3B83] px-6 py-3 text-white hover:bg-[#082f69]"
                >
                  Allocate bins to company
                </button>
              </form>
              {stockMessage && <p className="mt-3 text-sm text-slate-700">{stockMessage}</p>}
              <div className="mt-6 overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-left">
                    <tr>
                      <th className="p-3">Company</th>
                      <th className="p-3">Quantity Sold</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soldBins.length === 0 ? (
                      <tr>
                        <td className="p-3" colSpan={3}>No sales yet.</td>
                      </tr>
                    ) : (
                      soldBins.map((record) => (
                        <tr key={record.id} className="border-t">
                          <td className="p-3">{record.companyName}</td>
                          <td className="p-3">{record.quantity}</td>
                          <td className="p-3">{new Date(record.soldAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "map" ? (
            <div>
              <h2 className="text-2xl font-semibold text-[#0E2040]">Live Bin Map</h2>
              <p className="mt-1 text-sm text-slate-600">
                Hover over a bin to view level, status, location and assigned company.
              </p>
              <div className="mt-4 rounded-2xl border p-3">
                <MapContainer center={adminMapCenter} zoom={12} scrollWheelZoom className="h-[70vh] min-h-[360px] w-full rounded-xl">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {bins.map((bin) => (
                    <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={mapIcon(bin.fillPercent >= 90)}>
                      <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                        <div className="space-y-1">
                          <p className="font-semibold">{bin.name}</p>
                          <p className="text-xs">Status: {bin.fillPercent >= 90 ? 'Critical' : 'Normal'}</p>
                          <p className="text-xs">Level: {bin.fillPercent}%</p>
                          <p className="text-xs">Location: {bin.locationName}</p>
                          <p className="text-xs">Company: {bin.companyName}</p>
                        </div>
                      </Tooltip>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-[#0E2040]">Company Feedback</h2>
              <p className="mt-1 text-sm text-slate-600">
                Feedback submitted by collection companies (demo data, local storage for now).
              </p>
              <div className="mt-4 space-y-3">
                {feedbackList.length === 0 ? (
                  <div className="rounded-lg border p-4 text-sm text-slate-600">No feedback submitted yet.</div>
                ) : (
                  feedbackList.map((entry) => (
                    <div key={entry.id} className="rounded-lg border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-[#0E2040]">{entry.companyName}</p>
                        <p className="text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-700"><span className="font-medium">{entry.category}</span> - {entry.rating}/5</p>
                      <p className="mt-1 text-sm text-slate-600">{entry.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
