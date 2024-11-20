
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Routes } from "./app/shared/interfaces/routes.interface";
import { isAuthenticated } from "./core/lib/auth";

const protectedRoutes = [Routes.DASHBOARD.toString()];

export default async function middleware(req: NextRequest) {
  const isAuth = await isAuthenticated();

  if (!isAuth && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL(Routes.SIGN_IN, req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}