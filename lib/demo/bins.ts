export type WasteBin = {
  id: string;
  name: string;
  locationName: string;
  lat: number;
  lng: number;
  fillPercent: number;
  district: string;
};

export const bins: WasteBin[] = [
  {
    id: "kig-nyamirambo-01",
    name: "CH-1001",
    locationName: "Nyamirambo Taxi Park",
    lat: -1.9841,
    lng: 30.0444,
    fillPercent: 84,
    district: "Nyarugenge",
  },
  {
    id: "kig-kimisagara-02",
    name: "CH-1002",
    locationName: "Kimisagara Main Road",
    lat: -1.9587,
    lng: 30.0316,
    fillPercent: 38,
    district: "Nyarugenge",
  },
  {
    id: "kig-remera-03",
    name: "CH-1003",
    locationName: "Remera Bus Stop",
    lat: -1.9442,
    lng: 30.1123,
    fillPercent: 67,
    district: "Gasabo",
  },
  {
    id: "kig-kimironko-04",
    name: "CH-1004",
    locationName: "Kimironko Market",
    lat: -1.9494,
    lng: 30.1231,
    fillPercent: 22,
    district: "Gasabo",
  },
  {
    id: "kig-gisozi-05",
    name: "CH-1005",
    locationName: "Gisozi Health Center",
    lat: -1.9268,
    lng: 30.0733,
    fillPercent: 91,
    district: "Gasabo",
  },
  {
    id: "kig-kicukiro-06",
    name: "CH-1006",
    locationName: "Kicukiro Center",
    lat: -1.9705,
    lng: 30.1029,
    fillPercent: 49,
    district: "Kicukiro",
  },
];

export const controlRoomLocation = {
  name: "Cheemba Control Room",
  lat: -1.9441,
  lng: 30.0619,
};

export const jamZones = [
  { from: [-1.951, 30.071], to: [-1.944, 30.089] },
  { from: [-1.968, 30.094], to: [-1.959, 30.111] },
];
