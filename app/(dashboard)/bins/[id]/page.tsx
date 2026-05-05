'use client';

import { bins, controlRoomLocation, jamZones } from '@/lib/demo/bins';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';

const distance = (a: [number, number], b: [number, number]) => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
};

const findShortestRoute = (start: [number, number], end: [number, number]) => {
  const graph: [number, number][] = [
    start,
    end,
    [-1.948, 30.056],
    [-1.942, 30.075],
    [-1.958, 30.091],
    [-1.938, 30.101],
  ];

  const edges: Array<[number, number]> = [
    [0, 2],
    [2, 1],
    [0, 3],
    [3, 1],
    [0, 4],
    [4, 5],
    [5, 1],
    [2, 3],
    [3, 5],
  ];

  const isJammed = (from: [number, number], to: [number, number]) =>
    jamZones.some((zone) => distance(from, zone.from as [number, number]) + distance(to, zone.to as [number, number]) < 0.03);

  const validEdges = edges.filter(([a, b]) => !isJammed(graph[a], graph[b]));
  const distances = new Array(graph.length).fill(Number.POSITIVE_INFINITY);
  const previous = new Array<number>(graph.length).fill(-1);
  const visited = new Set<number>();

  distances[0] = 0;

  while (visited.size < graph.length) {
    let node = -1;
    let min = Number.POSITIVE_INFINITY;
    for (let i = 0; i < graph.length; i += 1) {
      if (!visited.has(i) && distances[i] < min) {
        min = distances[i];
        node = i;
      }
    }
    if (node === -1) break;
    visited.add(node);
    validEdges.forEach(([a, b]) => {
      if (a === node || b === node) {
        const next = a === node ? b : a;
        const nextDistance = distances[node] + distance(graph[node], graph[next]);
        if (nextDistance < distances[next]) {
          distances[next] = nextDistance;
          previous[next] = node;
        }
      }
    });
  }

  const path: [number, number][] = [];
  let cursor = 1;
  while (cursor !== -1) {
    path.unshift(graph[cursor]);
    cursor = previous[cursor];
  }
  if (path[0] !== graph[0]) path.unshift(graph[0]);
  return path;
};

export default function BinDetailsPage() {
  const params = useParams<{ id: string }>();
  const bin = bins.find((item) => item.id === params.id) || bins[0];
  const routePath = useMemo(
    () => findShortestRoute([controlRoomLocation.lat, controlRoomLocation.lng], [bin.lat, bin.lng]),
    [bin.lat, bin.lng]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#0E2040]">{bin.name}</h2>
        <p className="text-sm text-slate-600">{bin.locationName}, {bin.district}, Kigali</p>
        <p className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
          Fill level: {bin.fillPercent}%
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold">Real-time shortest path (traffic-aware demo)</h3>
        <MapContainer center={[bin.lat, bin.lng]} zoom={13} scrollWheelZoom className="h-[520px] w-full rounded-xl">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[controlRoomLocation.lat, controlRoomLocation.lng]}>
            <Popup>{controlRoomLocation.name}</Popup>
          </Marker>
          <Marker position={[bin.lat, bin.lng]}>
            <Popup>{bin.locationName}</Popup>
          </Marker>
          <Polyline positions={routePath} pathOptions={{ color: '#0D99FF', weight: 6 }} />
          {jamZones.map((zone, index) => (
            <Polyline
              key={index}
              positions={[zone.from as [number, number], zone.to as [number, number]]}
              pathOptions={{ color: '#ef4444', weight: 7, dashArray: '8, 8' }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
