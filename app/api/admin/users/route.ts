import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_EMAIL, APP_ROLES, type AppRole } from "@/lib/auth/constants";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ message: "Supabase env is missing." }, { status: 500 });
    }

    const publicClient = createClient(supabaseUrl, anonKey);

    const {
      data: { user: requester },
      error: requesterError,
    } = await publicClient.auth.getUser(token);

    if (requesterError || !requester || requester.email !== ADMIN_EMAIL) {
      return NextResponse.json({ message: "Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
    const role = String(body.role || "") as AppRole;
    const displayName = String(body.displayName || "").trim();

    if (!email || !password || !displayName) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    if (![APP_ROLES.COMPANY, APP_ROLES.HOUSEHOLD].includes(role)) {
      return NextResponse.json({ message: "Invalid role selected." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        display_name: displayName,
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
