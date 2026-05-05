export type CompanyFeedback = {
  id: string;
  companyName: string;
  category: "Performance" | "UI/UX" | "Routing" | "Support";
  rating: number;
  comment: string;
  createdAt: string;
};

export const FEEDBACK_STORAGE_KEY = "cheemba-company-feedback";

export const demoFeedback: CompanyFeedback[] = [
  {
    id: "fb-1",
    companyName: "EnviroServe",
    category: "Routing",
    rating: 5,
    comment: "The live map and overflow alerts helped our dispatch team reduce response time.",
    createdAt: "2026-05-03T10:12:00.000Z",
  },
  {
    id: "fb-2",
    companyName: "Kigali Clean Co",
    category: "UI/UX",
    rating: 4,
    comment: "Dashboard is clear and professional. We would love batch assignment next.",
    createdAt: "2026-05-04T08:33:00.000Z",
  },
];
