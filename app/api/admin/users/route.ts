import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_EMAIL, APP_ROLES } from "@/lib/auth/constants";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const allowedUserRoles = [APP_ROLES.COMPANY, APP_ROLES.HOUSEHOLD] as const;
type AllowedUserRole = (typeof allowedUserRoles)[number];

const isAllowedUserRole = (value: string): value is AllowedUserRole =>
  allowedUserRoles.includes(value as AllowedUserRole);

const getRequester = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return { error: "Unauthorized", status: 401 as const, requester: null };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return { error: "Supabase env is missing.", status: 500 as const, requester: null };
  }

  const publicClient = createClient(supabaseUrl, anonKey);
  const {
    data: { user: requester },
    error: requesterError,
  } = await publicClient.auth.getUser(token);

  if (requesterError || !requester || requester.email !== ADMIN_EMAIL) {
    return { error: "Admin access required.", status: 403 as const, requester: null };
  }

  return { error: null, status: 200 as const, requester };
};

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const requester = await getRequester(request);
    if (requester.error) {
      return NextResponse.json({ message: requester.error }, { status: requester.status });
    }

    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
    const role = String(body.role || "");
    const displayName = String(body.displayName || "").trim();
    const companyName = String(body.companyName || "").trim();

    if (!email || !password || !displayName) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    if (!isAllowedUserRole(role)) {
      return NextResponse.json({ message: "Invalid role selected." }, { status: 400 });
    }

    if (role === APP_ROLES.COMPANY && !companyName) {
      return NextResponse.json({ message: "Collection company name is required." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        display_name: displayName,
        company_name: role === APP_ROLES.COMPANY ? companyName : "",
      },
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "User created successfully.", userId: data.user?.id });
  } catch {
    return NextResponse.json({ message: "Unexpected server error." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const requester = await getRequester(request);
    if (requester.error) {
      return NextResponse.json({ message: requester.error }, { status: requester.status });
    }

    const usersResponse = await supabaseAdmin.auth.admin.listUsers();
    const users = usersResponse.data.users
      .filter((user) => isAllowedUserRole(String(user.user_metadata?.role || "")))
      .map((user) => ({
        id: user.id,
        email: user.email,
        displayName: String(user.user_metadata?.display_name || "No name"),
        companyName: String(user.user_metadata?.company_name || "-"),
        role: String(user.user_metadata?.role || "-"),
        createdAt: user.created_at,
      }));

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ message: "Unexpected server error." }, { status: 500 });
  }
}
