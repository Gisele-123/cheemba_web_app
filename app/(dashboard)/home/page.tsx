'use client';

import React, { useEffect, useState } from 'react';
import { RiApps2AiLine } from 'react-icons/ri';
import { bins } from '@/lib/demo/bins';
import { supabase } from '@/lib/supabase/client';
import { APP_ROLES } from '@/lib/auth/constants';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const binIcon = (isCritical: boolean) =>
  L.divIcon({
    className: '',
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${isCritical ? '#ef4444' : '#22c55e'};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.2);"></span>`,
    iconSize: [16, 16],
  });

const HomeDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([-1.9441, 30.0619]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAdmin(data.user?.user_metadata?.role === APP_ROLES.ADMIN);
    };
    load();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => undefined
    );
  }, []);

  if (isAdmin) {
    return (
      <div className="flex flex-col gap-4 p-6 max-md:p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl text-[#0E2040] font-medium">Dashboard</h3>
          <RiApps2AiLine size={28} color="#6B7280" />
        </div>
        <div className="rounded-2xl border bg-gradient-to-r from-[#0b1f43] to-[#0D99FF] p-8 text-white shadow-lg">
          <h4 className="text-2xl font-semibold">Cheemba</h4>
          <p className="mt-2 max-w-2xl text-sm text-blue-100">
            Admin overview is available in the Admin Portal. Operational map view is optimized for collection teams.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 max-md:p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl text-[#0E2040] font-medium">Kigali Operations Map</h3>
        <RiApps2AiLine size={28} color="#6B7280" />
      </div>
      <div className="rounded-2xl border bg-gradient-to-r from-[#0b1f43] to-[#0D99FF] p-6 text-white shadow-lg">
        <p className="text-sm text-blue-100">
          Hover any bin to see details and shortest route estimate from your current position. Red icons mean 90%+ full.
        </p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <MapContainer center={userLocation} zoom={13} scrollWheelZoom className="h-[560px] w-full rounded-xl">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={userLocation}>
            <Popup>Your current location</Popup>
          </Marker>
          {bins.map((bin) => (
            <Marker
              key={bin.id}
              position={[bin.lat, bin.lng]}
              icon={binIcon(bin.fillPercent >= 90)}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{bin.name}</p>
                  <p className="text-sm">Status: {bin.fillPercent >= 90 ? 'Critical' : 'Normal'}</p>
                  <p className="text-sm">Level: {bin.fillPercent}% full</p>
                  <p className="text-sm">Company: {bin.companyName}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default HomeDashboard;
