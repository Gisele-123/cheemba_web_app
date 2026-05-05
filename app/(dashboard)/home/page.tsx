'use client';

import React, { useEffect, useState } from 'react';
import { RiApps2AiLine } from 'react-icons/ri';
import { bins } from '@/lib/demo/bins';
import { supabase } from '@/lib/supabase/client';
import { APP_ROLES } from '@/lib/auth/constants';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import type { BinSaleRecord } from '@/lib/demo/inventory';
import { MessageSquareText } from 'lucide-react';

type CompanyFeedback = {
  id: string;
  companyName: string;
  category: 'Performance' | 'UI/UX' | 'Routing' | 'Support';
  rating: number;
  comment: string;
  createdAt: string;
};

const demoFeedback: CompanyFeedback[] = [
  {
    id: 'fb-1',
    companyName: 'EnviroServe',
    category: 'Routing',
    rating: 5,
    comment: 'The live map and overflow alerts helped our dispatch team reduce response time.',
    createdAt: '2026-05-03T10:12:00.000Z',
  },
  {
    id: 'fb-2',
    companyName: 'Kigali Clean Co',
    category: 'UI/UX',
    rating: 4,
    comment: 'Dashboard is clear and professional. We would love batch assignment next.',
    createdAt: '2026-05-04T08:33:00.000Z',
  },
];

const binIcon = (isCritical: boolean) =>
  L.divIcon({
    className: '',
    html: `<span class="wastebin-map-icon" style="background:${isCritical ? '#ef4444' : '#22c55e'};">🗑️</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 30],
  });

const HomeDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [companyName, setCompanyName] = useState('Cheemba');
  const [soldBins, setSoldBins] = useState<BinSaleRecord[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number]>([-1.9441, 30.0619]);
  const [feedbackList, setFeedbackList] = useState<CompanyFeedback[]>(demoFeedback);
  const [feedbackCategory, setFeedbackCategory] = useState<CompanyFeedback['category']>('Performance');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const admin = user?.user_metadata?.role === APP_ROLES.ADMIN;
      setIsAdmin(admin);
      if (!admin) {
        setCompanyName(String(user?.user_metadata?.company_name || user?.user_metadata?.display_name || 'Cheemba Company'));
      }
    };
    load();

    const savedSales = window.localStorage.getItem('cheemba-sold-bins');
    if (savedSales) {
      setSoldBins(JSON.parse(savedSales));
    }
    const savedFeedback = window.localStorage.getItem('cheemba-company-feedback');
    if (savedFeedback) {
      setFeedbackList(JSON.parse(savedFeedback));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => undefined
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem('cheemba-company-feedback', JSON.stringify(feedbackList));
  }, [feedbackList]);

  const criticalBins = bins.filter((bin) => bin.fillPercent >= 90).length;
  const activeAlerts = bins.filter((bin) => bin.fillPercent >= 80).length;

  if (isAdmin) {
    return (
      <div className="flex flex-col gap-5 p-6 max-md:p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl text-[#0E2040] font-medium">Admin Live Dashboard</h3>
          <RiApps2AiLine size={28} color="#6B7280" />
        </div>
        <div className="rounded-2xl border bg-gradient-to-r from-[#0b1f43] to-[#0D99FF] p-6 text-white shadow-lg">
          <h4 className="text-2xl font-semibold">Cheemba</h4>
          <p className="mt-2 max-w-2xl text-sm text-blue-100">
            Full network view of all deployed bins in Kigali. Hover on any bin to see level, status, location and assigned company.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total bins deployed</p>
            <p className="text-3xl font-bold text-[#0E2040]">{bins.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Critical bins (90%+)</p>
            <p className="text-3xl font-bold text-red-600">{criticalBins}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Active alerts (80%+)</p>
            <p className="text-3xl font-bold text-amber-600">{activeAlerts}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <MapContainer center={userLocation} zoom={12} scrollWheelZoom className="h-[70vh] min-h-[360px] w-full rounded-xl">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {bins.map((bin) => (
              <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={binIcon(bin.fillPercent >= 90)}>
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
    );
  }

  const companyDeployedBins = bins.filter((bin) => bin.companyName === companyName);
  const companyStockUnits = soldBins
    .filter((record) => record.companyName === companyName)
    .reduce((acc, record) => acc + record.quantity, 0);

  const onSubmitFeedback = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedbackComment.trim()) {
      setFeedbackMessage('Please write your feedback before submitting.');
      return;
    }
    const newFeedback: CompanyFeedback = {
      id: `${Date.now()}`,
      companyName,
      category: feedbackCategory,
      rating: feedbackRating,
      comment: feedbackComment.trim(),
      createdAt: new Date().toISOString(),
    };
    setFeedbackList((prev) => [newFeedback, ...prev]);
    setFeedbackComment('');
    setFeedbackCategory('Performance');
    setFeedbackRating(5);
    setFeedbackMessage('Feedback submitted. Thank you for improving Cheemba.');
  };

  return (
    <div className="flex flex-col gap-5 p-6 max-md:p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl text-[#0E2040] font-medium">Kigali Operations Map</h3>
        <RiApps2AiLine size={28} color="#6B7280" />
      </div>
      <div className="rounded-2xl border bg-gradient-to-r from-[#0b1f43] to-[#0D99FF] p-6 text-white shadow-lg">
        <p className="text-sm text-blue-100">
          Hover bins to view status, level, and owner company. Red means 90%+ full, green means below 90%.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Company</p>
          <p className="text-xl font-semibold text-[#0E2040]">{companyName}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Stock allocated to you</p>
          <p className="text-3xl font-bold text-emerald-600">{companyStockUnits}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Your deployed bins</p>
          <p className="text-3xl font-bold text-[#0E2040]">{companyDeployedBins.length}</p>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <MapContainer center={userLocation} zoom={13} scrollWheelZoom className="h-[70vh] min-h-[360px] w-full rounded-xl">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {bins.map((bin) => (
            <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={binIcon(bin.fillPercent >= 90)}>
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <div className="space-y-1">
                  <p className="font-semibold">{bin.name}</p>
                  <p className="text-sm">Status: {bin.fillPercent >= 90 ? 'Critical' : 'Normal'}</p>
                  <p className="text-sm">Level: {bin.fillPercent}% full</p>
                  <p className="text-sm">Company: {bin.companyName}</p>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h4 className="text-lg font-semibold text-[#0E2040]">Your Wastebins List</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {companyDeployedBins.length === 0 ? (
            <p className="text-sm text-slate-500">No deployed bins assigned to this company yet.</p>
          ) : (
            companyDeployedBins.map((bin) => (
              <div key={bin.id} className="rounded-lg border p-3">
                <p className="font-semibold">{bin.name}</p>
                <p className="text-sm text-slate-600">{bin.locationName}</p>
                <p className={`mt-1 text-sm ${bin.fillPercent >= 90 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {bin.fillPercent >= 90 ? 'Critical' : 'Normal'} - {bin.fillPercent}% full
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-[#0A3B83]" />
          <h4 className="text-lg font-semibold text-[#0E2040]">Company Feedback</h4>
        </div>
        <form className="grid gap-3 md:grid-cols-3" onSubmit={onSubmitFeedback}>
          <select
            value={feedbackCategory}
            onChange={(event) => setFeedbackCategory(event.target.value as CompanyFeedback['category'])}
            className="rounded-lg border p-3"
          >
            <option value="Performance">Performance</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Routing">Routing</option>
            <option value="Support">Support</option>
          </select>
          <select
            value={feedbackRating}
            onChange={(event) => setFeedbackRating(Number(event.target.value))}
            className="rounded-lg border p-3"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Good</option>
            <option value={3}>3 - Fair</option>
            <option value={2}>2 - Needs Improvement</option>
            <option value={1}>1 - Poor</option>
          </select>
          <button type="submit" className="rounded-lg bg-[#0A3B83] px-4 py-3 text-white hover:bg-[#082f69]">
            Submit Feedback
          </button>
          <textarea
            value={feedbackComment}
            onChange={(event) => setFeedbackComment(event.target.value)}
            placeholder="Share your operational feedback about the system..."
            className="min-h-28 rounded-lg border p-3 md:col-span-3"
          />
        </form>
        {feedbackMessage && <p className="mt-2 text-sm text-slate-600">{feedbackMessage}</p>}
        <div className="mt-4 space-y-3">
          {feedbackList.map((entry) => (
            <div key={entry.id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#0E2040]">{entry.companyName}</p>
                <p className="text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-1 text-sm text-slate-700">
                <span className="font-medium">{entry.category}</span> - {entry.rating}/5
              </p>
              <p className="mt-1 text-sm text-slate-600">{entry.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
