
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Routes } from "./app/shared/interfaces/routes.interface";
import { isAuthenticated } from "./core/lib/auth";

const protectedRoutes = [Routes.DASHBOARD.toString()];
const authRoutes = [Routes.SIGN_IN.toString(), Routes.SIGN_UP.toString()];

export default async function middleware(req: NextRequest) {
  const isAuth = await isAuthenticated();

  if (!isAuth && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL(Routes.SIGN_IN, req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (isAuth && authRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL(Routes.DASHBOARD, req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}