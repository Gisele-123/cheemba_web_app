import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_ROLES } from "@/lib/auth/constants";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "Invalid admin seed payload." }, { status: 400 });
    }

    const usersResponse = await supabaseAdmin.auth.admin.listUsers();
    const existing = usersResponse.data.users.find((user) => user.email?.toLowerCase() === ADMIN_EMAIL);

    if (!existing) {
      const created = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: APP_ROLES.ADMIN,
          display_name: "Cheemba Admin",
        },
      });

      if (created.error) {
        return NextResponse.json({ message: created.error.message }, { status: 400 });
      }
    } else {
      const updated = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: ADMIN_PASSWORD,
        user_metadata: {
          role: APP_ROLES.ADMIN,
          display_name: "Cheemba Admin",
        },
      });

      if (updated.error) {
        return NextResponse.json({ message: updated.error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ message: "Admin account is ready." });
  } catch {
    return NextResponse.json({ message: "Failed to seed admin account." }, { status: 500 });
  }
}
